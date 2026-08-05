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

function normaliseText(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim()
}

function fallbackArticle(
  input: WriteArticleInput,
): WrittenArticle {
  const cleanSummary = normaliseText(input.summary)

  return {
    title: normaliseText(input.title).slice(0, 160),
    summary: cleanSummary.slice(0, 4000),
    communityAngle: '',
  }
}

export async function writeArticle(
  input: WriteArticleInput,
): Promise<WrittenArticle> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn(
      'OPENAI_API_KEY is missing. Publishing the original feed content.',
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
You are the editor of Downunder Voices, an independent news publication covering Australia, New Zealand and the Pacific.

Rewrite the supplied source material as a concise, natural news report.

Editorial rules:

- Use only facts contained in the supplied title and summary.
- Never invent names, quotations, dates, figures, locations, causes or outcomes.
- Never claim that Downunder Voices attended an event, interviewed anyone or independently confirmed the report.
- Do not copy complete sentences from the source.
- Use Australian and New Zealand English.
- Write in a calm, factual newsroom style.
- Use short paragraphs and active voice.
- Do not use promotional, dramatic or sensational wording.
- Do not pad the article to reach a word count.
- Do not explain that the information was supplied through an RSS feed.
- Do not tell readers to consult the original source.
- Do not use phrases such as:
  "This story may be relevant"
  "The information currently available"
  "Readers should consult"
  "Community angle"
  "This development highlights"
  "It is important to note"
  "In a significant development"
  "Across Australia, New Zealand and the Pacific"
- Do not add a generic conclusion.
- Mention the source naturally once, preferably near the beginning.
- The article should normally be 120 to 240 words, but may be shorter when limited information is available.
- The headline must be factual and no longer than 90 characters.
- The communityAngle field must contain one specific sentence explaining the practical relevance of the story.
- If there is no clear community relevance in the supplied material, return an empty string for communityAngle.
          `.trim(),

          input: `
SOURCE TITLE:
${input.title}

SOURCE NAME:
${input.sourceName}

SOURCE URL:
${input.sourceUrl}

CATEGORY:
${input.category}

SOURCE SUMMARY:
${input.summary}
          `.trim(),

          text: {
            format: {
              type: 'json_schema',
              name: 'downunder_voices_article',
              strict: true,
              schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  title: {
                    type: 'string',
                    description:
                      'A factual news headline no longer than 90 characters.',
                  },
                  summary: {
                    type: 'string',
                    description:
                      'A concise original news report based only on the supplied material.',
                  },
                  communityAngle: {
                    type: 'string',
                    description:
                      'One specific sentence about practical relevance, or an empty string.',
                  },
                },
                required: [
                  'title',
                  'summary',
                  'communityAngle',
                ],
              },
            },
          },

          max_output_tokens: 850,
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
      data.output_text ??
      data.output
        ?.flatMap((item) => item.content ?? [])
        .find((content) => content.type === 'output_text')
        ?.text ??
      ''

    if (!rawText.trim()) {
      console.error('OpenAI returned no article text')
      return fallbackArticle(input)
    }

    const parsed = JSON.parse(rawText) as {
      title: string
      summary: string
      communityAngle: string
    }

    const title = normaliseText(parsed.title)
    const summary = parsed.summary.trim()
    const communityAngle = normaliseText(
      parsed.communityAngle,
    )

    if (!title || !summary) {
      console.error('OpenAI returned an incomplete article')
      return fallbackArticle(input)
    }

    return {
      title: title.slice(0, 160),
      summary: summary.slice(0, 4000),
      communityAngle: communityAngle.slice(0, 500),
    }
  } catch (error) {
    console.error('AI article writing failed:', error)
    return fallbackArticle(input)
  }
}
