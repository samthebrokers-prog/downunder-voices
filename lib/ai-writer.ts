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
  return {
    title: normaliseText(input.title).slice(0, 160),
    summary: normaliseText(input.summary).slice(0, 4000),
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
You are a senior news editor for Downunder Voices, an independent digital publication covering Australia, New Zealand and the Pacific.

Write a clean, original news report using only the facts supplied.

STYLE

- Write like a professional Australian or New Zealand newsroom.
- Lead immediately with the most important fact.
- Use direct, confident sentences.
- Use short paragraphs.
- Use active voice wherever possible.
- Use natural Australian and New Zealand English.
- Make each story sound individually written.
- Vary sentence structure and opening language between articles.
- Keep the tone factual, calm and readable.

OPENING PARAGRAPH

The first paragraph must tell the reader what happened.

Good examples:

"Western Australia has announced new measures aimed at increasing housing supply."

"New Zealand exporters will face updated documentation requirements from next month."

"Perth residents are being warned to prepare for severe weather this weekend."

Do not begin with:

"According to..."
"In a significant development..."
"The information currently available..."
"A recent report..."
"This article..."
"This story..."
"Authorities have released information..."
"It has been announced that..."

ACCURACY

- Use only information contained in the supplied title and summary.
- Do not invent facts, names, quotations, dates, figures, locations, reasons or outcomes.
- Do not assume missing details.
- Do not claim that Downunder Voices attended an event, interviewed anyone or independently verified the report.
- Do not copy complete sentences from the source.
- Preserve the original meaning.

SOURCE ATTRIBUTION

- Attribute the named source naturally once.
- Attribution should usually appear in the second or third paragraph.
- Do not repeatedly mention the source.
- Do not refer to Google, RSS feeds, algorithms or automated systems.
- Do not tell readers to visit or consult the original source.

ARTICLE STRUCTURE

- Begin with the main development.
- Add the key supporting facts.
- Explain any practical effect clearly supported by the supplied information.
- End when the available facts end.
- Do not add a generic conclusion.
- Do not pad the article to meet a word count.

BANNED PHRASES

Never use:

"This story may be relevant"
"Readers should consult"
"The information currently available"
"Community angle"
"This development highlights"
"It is important to note"
"In today's rapidly changing environment"
"Across Australia, New Zealand and the Pacific"
"Only time will tell"
"Stakeholders"
"Underscores the importance"
"Serves as a reminder"
"Remains to be seen"

LENGTH

- Write between 120 and 240 words when enough information is supplied.
- Write a shorter article when the source contains limited facts.
- The headline must be factual and no longer than 90 characters.
- The communityAngle field must contain one specific sentence describing a practical impact supported by the supplied material.
- If no clear practical impact is supported, return an empty string.

Return only the required JSON.
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

FACTS AVAILABLE:
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
        .find(
          (content) =>
            content.type === 'output_text',
        )
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
      console.error(
        'OpenAI returned an incomplete article',
      )

      return fallbackArticle(input)
    }

    return {
      title: title.slice(0, 160),
      summary: summary.slice(0, 4000),
      communityAngle: communityAngle.slice(
        0,
        500,
      ),
    }
  } catch (error) {
    console.error(
      'AI article writing failed:',
      error,
    )

    return fallbackArticle(input)
  }
}
