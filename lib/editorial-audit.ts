import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import { runEditorialGenerator } from '@/lib/editorial-generator'
import { sendEditorialEmail } from '@/lib/email'

type AuditStory = {
  id: string
  title: string
  summary: string
  image_url: string | null
  published_at: string | null
}

export type EditorialAuditResult = {
  ok: boolean
  originalArticlesToday: number
  rssRowsRepaired: number
  problems: string[]
  emailSent: boolean
}

function normaliseTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!)
}

async function getTodayOriginals(startIso: string) {
  return dbRequest<AuditStory[]>('stories', {
    query:
      '?select=id,title,summary,image_url,published_at' +
      '&status=eq.published' +
      '&import_method=eq.automated-editorial' +
      `&published_at=gte.${encodeURIComponent(startIso)}` +
      '&order=published_at.desc',
  })
}

export async function runEditorialAudit(): Promise<EditorialAuditResult> {
  if (!isDatabaseConfigured()) {
    throw new Error('Database is not configured.')
  }

  const startOfTodayUtc = new Date()
  startOfTodayUtc.setUTCHours(0, 0, 0, 0)
  const startIso = startOfTodayUtc.toISOString()

  const publicRssRows = await dbRequest<Array<{ id: string }>>('stories', {
    query:
      '?select=id' +
      '&status=eq.published' +
      '&import_method=eq.rss' +
      '&limit=500',
  })

  if (publicRssRows.length > 0) {
    await dbRequest('stories', {
      method: 'PATCH',
      query: '?status=eq.published&import_method=eq.rss',
      body: {
        status: 'draft',
        published_at: null,
      },
    })
  }

  let originals = await getTodayOriginals(startIso)
  const problems: string[] = []

  if (originals.length < 2) {
    try {
      await runEditorialGenerator()
      originals = await getTodayOriginals(startIso)
    } catch (error) {
      problems.push(
        `Automatic editorial recovery failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  }

  if (originals.length < 2) {
    problems.push(
      `Only ${originals.length} original article(s) were published today; expected 2.`,
    )
  }

  const seenTitles = new Set<string>()
  const seenImages = new Set<string>()
  for (const story of originals) {
    const title = normaliseTitle(story.title)
    if (seenTitles.has(title)) {
      problems.push(`Duplicate original headline: ${story.title}`)
    }
    seenTitles.add(title)

    if (wordCount(story.summary) < 350) {
      problems.push(`Original article is too short: ${story.title}`)
    }

    const imageUrl = story.image_url?.trim()
    if (imageUrl) {
      if (seenImages.has(imageUrl)) {
        problems.push(`Repeated original-article image: ${story.title}`)
      }
      seenImages.add(imageUrl)
    }
  }

  let emailSent = false
  if (problems.length > 0) {
    const result = await sendEditorialEmail({
      subject: 'Downunder Voices editorial audit needs attention',
      html: `
        <h2>Automatic editorial audit</h2>
        <p>The site checked itself and found the following:</p>
        <ul>${problems
          .map((problem) => `<li>${escapeHtml(problem)}</li>`)
          .join('')}</ul>
        <p>Original articles today: ${originals.length}</p>
        <p>Legacy RSS rows automatically returned to draft: ${publicRssRows.length}</p>
      `,
    })
    emailSent = result.sent
  }

  return {
    ok: problems.length === 0,
    originalArticlesToday: originals.length,
    rssRowsRepaired: publicRssRows.length,
    problems,
    emailSent,
  }
}
