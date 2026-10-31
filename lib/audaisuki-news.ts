/**
 * AU大好き (Audaisuki) — daily Japanese-language Australian news.
 *
 * Twice a day this picks the most useful recent Australian stories already
 * published on Downunder Voices, writes a short Japanese summary of each in
 * ONE cheap AI call, and saves the result as a public JSON file. The
 * Audaisuki website simply reads that file — it needs no keys of its own.
 *
 * Cost: about US$0.005 per run (well under US$1 a month). Every call goes
 * through the shared spending guard in lib/radio-budget.ts.
 */
import { dbRequest } from '@/lib/db'
import { canSpend, PRICES, recordFailure, recordSpend } from '@/lib/radio-budget'
import { getJson, publicUrl, putJson } from '@/lib/radio-storage'

const FILE = 'audaisuki/news.json'
const KEEP = 60
const SITE = 'https://www.downundervoices.com'

type Story = {
  slug: string
  title: string
  summary: string | null
  category: string
  published_at: string
  source_name: string | null
  source_url: string | null
}

export type AudaisukiNewsItem = {
  id: string
  titleJa: string
  summaryJa: string
  tag: string
  titleEn: string
  source: string
  link: string
  publishedAt: string
  writtenAt: string
}

export type AudaisukiNewsFile = { updatedAt: string; items: AudaisukiNewsItem[] }

const TAGS = ['ビザ・移民', '仕事・お金', '暮らし', '安全・天気', '交通', 'イベント・文化', 'スポーツ', '国際', 'ニュース']

export async function readAudaisukiNews() {
  return getJson<AudaisukiNewsFile>(FILE, { updatedAt: '', items: [] })
}

export function audaisukiNewsUrl() {
  return publicUrl(FILE)
}

export async function produceAudaisukiNews() {
  const existing = await readAudaisukiNews()
  const done = new Set(existing.items.map((i) => i.id))

  const stories = await dbRequest<Story[]>('stories', {
    query:
      '?select=slug,title,summary,category,published_at,source_name,source_url&status=eq.published&category=eq.australia&published_at=not.is.null&order=published_at.desc&limit=30',
  })
  const fresh = stories
    .filter((s) => s.slug && !done.has(s.slug))
    .filter((s) => Date.now() - Date.parse(s.published_at) < 36 * 3_600_000)
    .slice(0, 8)

  if (!fresh.length) return { ok: true, added: 0, reason: 'no new Australian stories' }

  const check = await canSpend('news', 0.02)
  if (!check.ok) return { ok: false, added: 0, reason: check.reason }

  const instructions = `
あなたは、オーストラリアで暮らす日本人（ワーキングホリデー、留学生、語学学習者、在住者）向けのニュースサイト「AU大好き」の編集者です。
与えられた英語のニュースそれぞれについて、自然で読みやすい日本語の見出し（30字以内）と要約（2〜3文、120字程度）を書いてください。
- 与えられた事実だけを使い、推測や事実の追加はしないこと。引用を作らないこと。
- 政治的に中立に。事故や事件は敬意をもって冷静に。
- 日本人の読者に関係する点（ビザ、仕事、物価、安全など）があれば、事実の範囲で一言添えてよい。
- tag は次から一つ選ぶ: ${TAGS.join('、')}
- 各記事の id は入力の id をそのまま返すこと。
`.trim()

  const input = fresh
    .map((s) => `id: ${s.slug}\n${s.title}\n${(s.summary || '').replace(/\s+/g, ' ').slice(0, 700)}`)
    .join('\n\n')

  const schema = {
    type: 'object',
    additionalProperties: false,
    required: ['items'],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'titleJa', 'summaryJa', 'tag'],
          properties: {
            id: { type: 'string' },
            titleJa: { type: 'string' },
            summaryJa: { type: 'string' },
            tag: { type: 'string', enum: TAGS },
          },
        },
      },
    },
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.DV_RADIO_SCRIPT_MODEL || 'gpt-5-mini',
      reasoning: { effort: 'low' },
      instructions,
      input,
      max_output_tokens: 6000,
      text: { format: { type: 'json_schema', name: 'audaisuki_news', schema, strict: true } },
    }),
  })
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 200)
    await recordFailure('news', `audaisuki ${response.status}: ${detail}`)
    throw new Error(`Japanese news writing failed (${response.status})`)
  }
  const data = (await response.json()) as {
    output_text?: string
    output?: { type: string; content?: { type: string; text?: string }[] }[]
    usage?: { input_tokens?: number; output_tokens?: number }
  }
  await recordSpend(
    'news',
    (data.usage?.input_tokens || 0) * PRICES.inputPerToken + (data.usage?.output_tokens || 0) * PRICES.outputPerToken,
    `Audaisuki Japanese news x${fresh.length}`,
  )
  const text =
    data.output_text ||
    (data.output || [])
      .filter((o) => o.type === 'message')
      .flatMap((o) => o.content || [])
      .map((c) => c.text || '')
      .join('')
  const parsed = JSON.parse(text) as { items: { id: string; titleJa: string; summaryJa: string; tag: string }[] }

  const now = new Date().toISOString()
  const bySlug = new Map(fresh.map((s) => [s.slug, s]))
  const added: AudaisukiNewsItem[] = []
  for (const item of parsed.items || []) {
    const s = bySlug.get(item.id)
    if (!s || !item.titleJa || !item.summaryJa) continue
    added.push({
      id: s.slug,
      titleJa: item.titleJa.trim(),
      summaryJa: item.summaryJa.trim(),
      tag: item.tag,
      titleEn: s.title,
      source: s.source_name || 'Downunder Voices',
      link: `${SITE}/story/${s.slug}`,
      publishedAt: s.published_at,
      writtenAt: now,
    })
  }

  const items = [...added, ...existing.items]
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, KEEP)
  await putJson(FILE, { updatedAt: now, items } satisfies AudaisukiNewsFile)
  return { ok: true, added: added.length, total: items.length, url: audaisukiNewsUrl() }
}
