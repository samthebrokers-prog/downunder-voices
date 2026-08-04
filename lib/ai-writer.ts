type WriteArticleInput = {
  title: string
  summary: string
  sourceName: string
  sourceUrl: string
  category: string
}

export type WrittenArticle = {
  title: string
  summary: string
  communityAngle: string
}

function cleanJson(value: string): string {
  return value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

function fallbackArticle(
  input: WriteArticleInput,
): WrittenArticle {
  return {
    title: input.title,
    summary: input.summary,
    communityAngle:
      'This story may be relevant to readers across Australia, New Zealand and the Pacific. Please refer to the original source for the full report.',
  }
}

export async function writeArticle(
  input: WriteArticleInput,
): Promise<WrittenArticle> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn(
      'OPENAI_API_KEY is missing. Using the original feed summary.',
    )

    return fallbackArticle(input)
  }

  try {
    const response = await fetch(
      'https://api.openai.com/v1/responses',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5-mini',
          instructions: `
You are the news editor for Downunder Voices, an independent digital publication covering Australia, New Zealand and the Pacific.

Rewrite supplied news material into an original, accurate and neutral news brief.

Rules:
- Do not invent facts, names, dates, figures or quotations.
- Do not copy sentences from the source.
- Do not claim direct reporting or interviews.
- Preserve the factual meaning of the source material.
- Use clear Australian and New Zealand English.
- Avoid sensational or promotional language.
- Keep the article between 180 and 300 words.
- The title must be factual and no longer than 90 characters.
- The community angle must be 30 to 70 words.
- Clearly attribute the information to the named source.
- Return JSON only.
          `.trim(),
          input: `
Original title:
${input.title}

Source:
${input.sourceName}

Source URL:
${input.sourceUrl}

Category:
${input.category}

Available source summary:
${input.summary}

Return exactly this JSON structure:

{
  "title": "Rewritten factual headline",
  "summary": "Original 180 to 300 word news article with source attribution",
  "communityAngle": "Why this matters to Australia, New Zealand or Pacific readers"
}
          `.trim(),
          max_output_tokens: 900,
        }),
        signal: AbortSignal.timeout(30000),
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      const errorText = await response.text()

      console.error(
        `OpenAI writer failed with ${response.status}:`,
        errorText,
      )

      return fallbackArticle(input)
    }

    const data = (await response.json()) as {
      output_text?: string
      output?: Array<{
        content?: Array<{
          type?: string
          text?: string
        }>
      }>
    }

    const rawText =
      data.output_text ||
      data.output
        ?.flatMap((item) => item.content ?? [])
        .find((content) => content.type === 'output_text')
        ?.text ||
      ''

    if (!rawText) {
      console.error('OpenAI returned no article text')
      return fallbackArticle(input)
    }

    const parsed = JSON.parse(cleanJson(rawText)) as {
      title?: unknown
      summary?: unknown
      communityAngle?: unknown
    }

    const title =
      typeof parsed.title === 'string'
        ? parsed.title.trim()
        : ''

    const summary =
      typeof parsed.summary === 'string'
        ? parsed.summary.trim()
        : ''

    const communityAngle =
      typeof parsed.communityAngle === 'string'
        ? parsed.communityAngle.trim()
        : ''

    if (!title || !summary) {
      console.error('OpenAI returned incomplete article JSON')
      return fallbackArticle(input)
    }

    return {
      title: title.slice(0, 160),
      summary: summary.slice(0, 4000),
      communityAngle: communityAngle.slice(0, 1000),
    }
  } catch (error) {
    console.error('AI article writing failed:', error)
    return fallbackArticle(input)
  }
}
