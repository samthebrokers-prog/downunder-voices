import { NextResponse } from 'next/server'
import { createPost, deletePost, listPosts, reportPost } from '@/lib/audaisuki-board'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Message board API for AU大好き (audaisuki.com). Read: GET. Post, report or
// delete: POST with { action }. Only Audaisuki's own pages may call it.
const ALLOWED = ['https://audaisuki.com', 'https://www.audaisuki.com', 'https://audaisuki.vercel.app']

function cors(request: Request) {
  const origin = request.headers.get('origin') || ''
  return {
    'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

function ipOf(request: Request) {
  return (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || ''
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: cors(request) })
}

export async function GET(request: Request) {
  try {
    const posts = await listPosts()
    return NextResponse.json({ posts }, { headers: { ...cors(request), 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Board read failed:', error)
    return NextResponse.json({ posts: [] }, { status: 500, headers: cors(request) })
  }
}

export async function POST(request: Request) {
  const headers = cors(request)
  const origin = request.headers.get('origin') || ''
  if (origin && !ALLOWED.includes(origin)) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403, headers })
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad request' }, { status: 400, headers })
  }
  try {
    const action = String(body.action || 'create')
    if (action === 'report') {
      const ok = await reportPost(String(body.id || ''), ipOf(request))
      return NextResponse.json({ ok }, { headers })
    }
    if (action === 'delete') {
      const ok = await deletePost(String(body.id || ''), String(body.code || ''))
      return NextResponse.json({ ok, error: ok ? undefined : '削除コードが違います / Wrong delete code' }, { headers })
    }
    const result = await createPost(body, ipOf(request))
    return NextResponse.json(result, { status: result.ok ? 200 : 400, headers })
  } catch (error) {
    console.error('Board write failed:', error)
    return NextResponse.json({ ok: false, error: 'エラーが発生しました / Something went wrong' }, { status: 500, headers })
  }
}
