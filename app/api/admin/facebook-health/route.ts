import { NextResponse } from 'next/server'

import { isAdmin } from '@/lib/admin-auth'
import { verifyFacebookConnection } from '@/lib/facebook'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: 'Unauthorised' },
      { status: 401 },
    )
  }

  const result = await verifyFacebookConnection()

  return NextResponse.json(result, {
    status: result.ok ? 200 : 502,
  })
}
