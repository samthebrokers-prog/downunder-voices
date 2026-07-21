
type EmailInput = {
  subject: string
  html: string
  replyTo?: string
}

export async function sendEditorialEmail({ subject, html, replyTo }: EmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.EDITORIAL_EMAIL
  const from = process.env.EMAIL_FROM || 'Downunder Voices <onboarding@resend.dev>'

  if (!apiKey || !to) return { sent: false, reason: 'Email is not configured' }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html, reply_to: replyTo }),
  })

  if (!response.ok) {
    throw new Error(`Email delivery failed: ${await response.text()}`)
  }

  return { sent: true }
}
