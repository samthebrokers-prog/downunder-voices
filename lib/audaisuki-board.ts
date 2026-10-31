/**
 * AU大好き (Audaisuki) message board — storage and rules.
 *
 * Posts are stored as one JSON file in the existing Downunder Voices
 * storage bucket. Owner's choice: posts go live without approval. Safety:
 * - spam filter (links, banned phrases, repeated text), honeypot field
 * - max 3 posts per hour per visitor (IP is stored only as a hash)
 * - every post can be reported; 3 reports hide it automatically
 * - posts expire after 30 days
 * - each poster gets a private delete code for their own post
 */
import { createHash, randomBytes } from 'crypto'
import { getJson, putJson } from '@/lib/radio-storage'

const FILE = 'audaisuki/board.json'
const MAX_POSTS = 600
const EXPIRY_DAYS = 30
const HIDE_AFTER_REPORTS = 3

export const CATEGORIES = [
  'english', // 英語を学ぶ
  'exchange', // 言語交換
  'parttime', // アルバイト
  'domestic', // 家事・ドメスティック
  'friends', // 友達
  'travel', // 旅行仲間
  'japanese', // 日本人を探しています
  'housing', // 住まい
  'sale', // 売ります・買います
] as const
export type Category = (typeof CATEGORIES)[number]

export const REGIONS = ['australia', 'nsw', 'vic', 'qld', 'gc', 'wa', 'sa', 'act', 'tas', 'nt', 'online'] as const

export type Post = {
  id: string
  category: Category
  region: string
  title: string
  body: string
  name: string
  contact: string
  createdAt: string
  reports: number
  deleteHash: string
  ipHash: string
}

type Board = { posts: Post[]; recent: { ipHash: string; at: string }[] }

export type PublicPost = Omit<Post, 'deleteHash' | 'ipHash' | 'reports'>

const hash = (s: string) => createHash('sha256').update(`audaisuki|${s}`).digest('hex').slice(0, 24)

async function load(): Promise<Board> {
  const b = await getJson<Board>(FILE, { posts: [], recent: [] })
  return { posts: b.posts || [], recent: b.recent || [] }
}

function live(p: Post) {
  return p.reports < HIDE_AFTER_REPORTS && Date.now() - Date.parse(p.createdAt) < EXPIRY_DAYS * 86_400_000
}

function toPublic(p: Post): PublicPost {
  const { deleteHash: _d, ipHash: _i, reports: _r, ...rest } = p
  return rest
}

export async function listPosts() {
  const b = await load()
  return b.posts.filter(live).map(toPublic)
}

const BANNED = [
  /bitcoin|crypto\s*invest|forex|binary option|guaranteed (profit|income)/i,
  /casino|gambling|betting|escort|adult (service|massage)/i,
  /\b(upfront|advance)\s+(fee|payment)\b/i,
  /western union|gift ?card|itunes card/i,
  /visa sponsorship for (a )?fee|buy (a )?visa/i,
]

function clean(s: unknown, max: number) {
  return String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max)
}

export type NewPostResult = { ok: true; post: PublicPost; deleteCode: string } | { ok: false; error: string }

export async function createPost(input: Record<string, unknown>, ip: string): Promise<NewPostResult> {
  if (clean(input.website, 50)) return { ok: false, error: 'spam' } // honeypot
  const category = clean(input.category, 20) as Category
  const region = clean(input.region, 20)
  const title = clean(input.title, 80)
  const body = clean(input.body, 1500)
  const name = clean(input.name, 40)
  const contact = clean(input.contact, 120)

  if (!CATEGORIES.includes(category)) return { ok: false, error: 'カテゴリーを選んでください / Choose a category' }
  if (!(REGIONS as readonly string[]).includes(region)) return { ok: false, error: '地域を選んでください / Choose a region' }
  if (title.length < 4) return { ok: false, error: 'タイトルを入力してください / Add a title' }
  if (body.length < 15) return { ok: false, error: '内容をもう少し詳しく書いてください / Add a little more detail' }
  if (contact.length < 3) return { ok: false, error: '連絡先を入力してください / Add a contact (LINE ID, Instagram or email)' }

  const text = `${title} ${body} ${contact}`
  if ((text.match(/https?:\/\//gi) || []).length > 2) return { ok: false, error: 'リンクは2つまでです / Maximum 2 links' }
  if (BANNED.some((re) => re.test(text))) return { ok: false, error: 'この内容は掲載できません / This post cannot be published' }

  const b = await load()
  const ipHash = hash(ip || 'unknown')
  const hourAgo = Date.now() - 3_600_000
  b.recent = b.recent.filter((r) => Date.parse(r.at) > hourAgo)
  if (b.recent.filter((r) => r.ipHash === ipHash).length >= 3) {
    return { ok: false, error: '投稿が多すぎます。1時間後にもう一度お試しください / Too many posts — please try again in an hour' }
  }
  const sameText = b.posts.some((p) => live(p) && p.body === body)
  if (sameText) return { ok: false, error: '同じ内容がすでに掲載されています / This post is already on the board' }

  const deleteCode = randomBytes(4).toString('hex')
  const post: Post = {
    id: randomBytes(6).toString('hex'),
    category,
    region,
    title,
    body,
    name: name || '匿名 / Anonymous',
    contact,
    createdAt: new Date().toISOString(),
    reports: 0,
    deleteHash: hash(deleteCode),
    ipHash,
  }
  b.posts = [post, ...b.posts.filter(live)].slice(0, MAX_POSTS)
  b.recent.push({ ipHash, at: post.createdAt })
  await putJson(FILE, b)
  return { ok: true, post: toPublic(post), deleteCode }
}

export async function reportPost(id: string, ip: string) {
  const b = await load()
  const post = b.posts.find((p) => p.id === id)
  if (!post) return false
  const key = `${hash(ip || 'unknown')}:${id}`
  if (b.recent.some((r) => r.ipHash === key)) return true // one report per visitor
  post.reports += 1
  b.recent.push({ ipHash: key, at: new Date().toISOString() })
  await putJson(FILE, b)
  return true
}

export async function deletePost(id: string, code: string) {
  const b = await load()
  const post = b.posts.find((p) => p.id === id)
  if (!post || post.deleteHash !== hash(code.trim())) return false
  b.posts = b.posts.filter((p) => p.id !== id)
  await putJson(FILE, b)
  return true
}
