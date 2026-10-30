/**
 * Downunder Voices Radio — small helpers for the Supabase Storage bucket
 * that holds every cached radio file (news story clips, station clips,
 * the programme library, and the files AzuraCast plays).
 */

export const BUCKET = 'radio'

function cleanEnv(value?: string) {
  const trimmed = value?.trim() ?? ''
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

export const supabaseUrl = cleanEnv(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
).replace(/\/$/, '')
const supabaseKey = cleanEnv(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
)

export function storageHeaders(extra: Record<string, string> = {}) {
  const headers: Record<string, string> = { apikey: supabaseKey, ...extra }
  if (supabaseKey.startsWith('eyJ') && supabaseKey.split('.').length === 3) {
    headers.Authorization = `Bearer ${supabaseKey}`
  }
  return headers
}

let bucketReady = false
export async function ensureBucket() {
  if (bucketReady) return
  const check = await fetch(`${supabaseUrl}/storage/v1/bucket/${BUCKET}`, {
    headers: storageHeaders(),
    cache: 'no-store',
  })
  if (!check.ok) {
    const create = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: storageHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
    })
    if (!create.ok && create.status !== 409) {
      throw new Error(`Could not create radio storage (${create.status}): ${(await create.text()).slice(0, 200)}`)
    }
  }
  bucketReady = true
}

export function publicUrl(path: string) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function putObject(path: string, body: Uint8Array | string, contentType: string, cacheControl = 'max-age=31536000') {
  await ensureBucket()
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: storageHeaders({ 'Content-Type': contentType, 'x-upsert': 'true', 'cache-control': cacheControl }),
    body: typeof body === 'string' ? body : (body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer),
  })
  if (!response.ok) {
    throw new Error(`Could not save radio file ${path} (${response.status}): ${(await response.text()).slice(0, 200)}`)
  }
  return publicUrl(path)
}

export async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`, {
      headers: storageHeaders(),
      cache: 'no-store',
    })
    if (!response.ok) return fallback
    return (await response.json()) as T
  } catch {
    return fallback
  }
}

export async function putJson(path: string, data: unknown) {
  return putObject(path, JSON.stringify(data), 'application/json', 'max-age=0')
}

export async function getBytes(path: string) {
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${path}`, {
    headers: storageHeaders(),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Could not read radio file ${path} (${response.status})`)
  return new Uint8Array(await response.arrayBuffer())
}

export type StoredObject = { name: string; created_at: string }

export async function listObjects(prefix: string, limit = 100) {
  const response = await fetch(`${supabaseUrl}/storage/v1/object/list/${BUCKET}`, {
    method: 'POST',
    headers: storageHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prefix: prefix.endsWith('/') ? prefix : `${prefix}/`, limit, sortBy: { column: 'name', order: 'desc' } }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Could not list radio files (${response.status})`)
  const items = (await response.json()) as StoredObject[]
  return items.filter((item) => item.name.endsWith('.mp3'))
}

export async function deleteObjects(paths: string[]) {
  if (!paths.length) return
  await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE',
    headers: storageHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prefixes: paths }),
  })
}

/** Remove the ID3 tag at the start of an MP3 so files join cleanly. */
function stripId3(bytes: Uint8Array) {
  if (bytes.length > 10 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    const size = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f)
    return bytes.subarray(10 + size)
  }
  return bytes
}

/** Join MP3 files end to end (all ours come from the same voice model). */
export function joinMp3(parts: Uint8Array[]) {
  const cleaned = parts.map((p, i) => (i === 0 ? p : stripId3(p)))
  const total = cleaned.reduce((n, p) => n + p.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const part of cleaned) {
    out.set(part, offset)
    offset += part.length
  }
  return out
}

export async function sha(text: string) {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16)
}
