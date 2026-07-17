import { NextResponse } from 'next/server'
import { adminCookie, createAdminToken } from '@/lib/admin-auth'

export async function POST(request: Request) {
  const form = await request.formData()
  const password = String(form.get('password') ?? '')
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/admin/login?error=1', request.url), 303)
  }
  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  response.cookies.set(adminCookie.name, createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: adminCookie.maxAge,
  })
  return response
}
