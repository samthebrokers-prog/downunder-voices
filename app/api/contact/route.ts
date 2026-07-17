import { NextResponse } from 'next/server'
import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import { sendEditorialEmail } from '@/lib/email'
import { cleanMultiline, cleanText, validEmail } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (String(body.company ?? '').trim()) return NextResponse.json({ ok: true })
    const name = cleanText(body.name, 120)
    const email = cleanText(body.email, 200)
    const subject = cleanText(body.subject, 180)
    const message = cleanMultiline(body.message, 5000)
    if (!name || !validEmail(email) || !subject || !message) {
      return NextResponse.json({ error: 'Please complete all fields correctly.' }, { status: 400 })
    }

    let stored = false
    if (isDatabaseConfigured()) {
      await dbRequest('contact_messages', {
        method: 'POST',
        body: { name, email, subject, message },
      })
      stored = true
    }

    const result = await sendEditorialEmail({
      subject: `Website message: ${subject}`,
      replyTo: email,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    })

    if (!stored && !result.sent) {
      return NextResponse.json(
        { error: 'The message service is not configured yet. Please email us directly.' },
        { status: 503 },
      )
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'The message could not be sent. Please try again.' }, { status: 500 })
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!)
}
