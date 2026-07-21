import { NextResponse } from 'next/server'
import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import { sendEditorialEmail } from '@/lib/email'
import { categories } from '@/lib/news-data'
import { cleanMultiline, cleanText, validEmail, validHttpUrl } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (String(body.company ?? '').trim()) return NextResponse.json({ ok: true })
    const name = cleanText(body.name, 120)
    const email = cleanText(body.email, 200)
    const location = cleanText(body.location, 160)
    const category = cleanText(body.category, 40)
    const title = cleanText(body.title, 220)
    const story = cleanMultiline(body.story, 10000)
    const sourceUrl = cleanText(body.source, 1000)

    if (!name || !validEmail(email) || !title || !story || !categories.some((c) => c.slug === category)) {
      return NextResponse.json({ error: 'Please complete all required fields correctly.' }, { status: 400 })
    }
    if (!validHttpUrl(sourceUrl)) {
      return NextResponse.json({ error: 'The source link is not valid.' }, { status: 400 })
    }

    let stored = false
    if (isDatabaseConfigured()) {
      await dbRequest('story_submissions', {
        method: 'POST',
        body: { name, email, location, category, title, story, source_url: sourceUrl || null },
      })
      stored = true
    }

    const result = await sendEditorialEmail({
      subject: `Community story submission: ${title}`,
      replyTo: email,
      html: `<p><strong>From:</strong> ${e(name)} (${e(email)})</p><p><strong>Location:</strong> ${e(location || 'Not supplied')}</p><p><strong>Category:</strong> ${e(category)}</p><p><strong>Source:</strong> ${sourceUrl ? `<a href="${e(sourceUrl)}">${e(sourceUrl)}</a>` : 'Not supplied'}</p><hr><p>${e(story).replace(/\n/g, '<br>')}</p>`,
    })

    if (!stored && !result.sent) {
      return NextResponse.json({ error: 'Submissions are not configured yet. Please email the editorial team.' }, { status: 503 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'The story could not be submitted. Please try again.' }, { status: 500 })
  }
}

function e(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
}
