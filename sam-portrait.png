type QueryOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  query?: string
  body?: unknown
  prefer?: string
}

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

const url = cleanEnv(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
).replace(/\/$/, '')
const serviceKey = cleanEnv(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
)

function isLegacyJwt(key: string) {
  return key.startsWith('eyJ') && key.split('.').length === 3
}

export function isDatabaseConfigured() {
  return Boolean(url && serviceKey)
}

export function databaseConfigurationSummary() {
  return {
    configured: isDatabaseConfigured(),
    projectRef: url.match(/^https:\/\/([^.]+)\.supabase\.co$/)?.[1] ?? null,
    keyType: !serviceKey
      ? 'missing'
      : serviceKey.startsWith('sb_secret_')
        ? 'secret'
        : isLegacyJwt(serviceKey)
          ? 'legacy-service-role'
          : 'unknown',
  }
}

export async function dbRequest<T>(
  table: string,
  { method = 'GET', query = '', body, prefer }: QueryOptions = {},
): Promise<T> {
  if (!url || !serviceKey) {
    throw new Error('Database is not configured')
  }

  const headers: Record<string, string> = {
    apikey: serviceKey,
    'Content-Type': 'application/json',
    Prefer: prefer ?? (method === 'POST' ? 'return=representation' : 'return=minimal'),
  }

  // Legacy service_role keys are JWTs and should also be supplied as the
  // Authorization token. New sb_secret_ keys are opaque API keys and must
  // not be used as Bearer tokens.
  if (isLegacyJwt(serviceKey)) {
    headers.Authorization = `Bearer ${serviceKey}`
  }

  const response = await fetch(`${url}/rest/v1/${table}${query}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Database request failed (${response.status}): ${detail}`)
  }

  if (response.status === 204) return undefined as T
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}
