type ArticleMode = 'news' | 'opinion'

type WriteArticleInput = {
  title: string
  summary: string
  sourceName: string
  sourceUrl: string
  category: string
  mode?: ArticleMode
  country?:
    | 'Australia'
    | 'New Zealand'
    | 'Pacific'
    | 'World'
}

export type WrittenArticle = {
  title: string
  summary: string
  communityAngle: string
  rewritten: boolean
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
    rewritten: false,
  }
}

function getWriterInstructions(
  mode: ArticleMode,
): string {
  if (mode === 'opinion') {
    return `
You are the editorial writer for Downunder Voices,
an independent digital publication covering Australia
and New Zealand.

You are writing an OPINION article, not a straight
news report.

PURPOSE

Write an original, thoughtful editorial about a major
current issue affecting Australia or New Zealand.

The article should explain what has happened, why it
matters, the competing arguments, and reach a clear
editorial view.

The writing must sound like a professional Australian
or New Zealand newspaper opinion column.

STYLE

- Use natural Australian and New Zealand English.
- Write clearly and confidently.
- Use short paragraphs.
- Avoid academic or corporate language.
- Avoid generic AI-style phrases.
- Do not sound like a press release.
- Do not exaggerate or sensationalise.
- Make the opening strong and specific.
- Vary sentence structure.
- Write for ordinary readers, not specialists.

EDITORIAL APPROACH

- Establish the issue first.
- Explain why it matters to people in Australia or
  New Zealand.
- Present the strongest reasonable argument on both
  sides where relevant.
- Then give a clear Downunder Voices editorial view.
- Criticise policy or decisions where justified by
  the supplied facts.
- Give credit where justified.
- Focus on public interest.
- Do not promote political parties or candidates.
- Do not tell readers how to vote.
- Do not make personal attacks.

ACCURACY

- Use only facts contained in the supplied material.
- Do not invent names, quotes, dates, statistics,
  motives, events or outcomes.
- Clearly distinguish fact from opinion.
- Do not make allegations that are not supported by
  the supplied information.
- Do not claim Downunder Voices interviewed anyone,
  attended events or independently verified facts.
- Do not copy complete sentences from the source.

SOURCE ATTRIBUTION

- Attribute the source naturally where appropriate.
- Do not repeatedly name the source.
- Do not mention RSS feeds, algorithms or automation.
- Do not tell readers to visit another publisher.

OPENING

Begin directly with the issue.

Good style:

"New Zealand's housing debate has reached the point
where another short-term fix will not be enough."

"Australians deserve a clearer answer on how this
policy will affect household costs."

Do not begin with:

"According to..."
"In a significant development..."
"This article..."
"This story..."
"In today's rapidly changing world..."
"It is important to note..."
"The information currently available..."

BANNED PHRASES

Never use:

"This development highlights"
"Underscores the importance"
"Serves as a reminder"
"Only time will tell"
"Remains to be seen"
"Stakeholders"
"Community angle"
"Readers should consult"
"Across Australia, New Zealand and the Pacific"
"In today's rapidly changing environment"

LENGTH

- Aim for 450 to 750 words when sufficient material
  is supplied.
- If the supplied facts are limited, write less.
- Never pad the article.
- Headline should be strong but responsible.
- Headline maximum 100 characters.
- communityAngle should contain one concise sentence
  explaining why the issue matters to ordinary people.
- If no clear practical impact is supported, return
  an empty string.

The article will already be labelled OPINION on the
website.

Do not put "Opinion:" or "Editorial:" at the start of
the headline.

Return only the required JSON.
`.trim()
  }

  return `
You are a senior news editor for Downunder Voices,
an independent digital publication covering Australia,
New Zealand, the Pacific and the wider world.

Write a clean, original news report using only the
facts supplied.

STYLE

- Write like a professional Australian or New Zealand
  newsroom.
- Lead immediately with the most important fact.
- Use direct, confident sentences.
- Use short paragraphs.
- Use active voice wherever possible.
- Use natural Australian and New Zealand English.
- Make each story sound individually written.
- Vary sentence structure and opening language.
- Keep the tone factual, calm and readable.
- Avoid formulaic transitions and repetitive conclusions.
- Do not use filler simply to make the report longer.

OPENING PARAGRAPH

The first paragraph must tell the reader what happened.

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

- Use only information contained in the supplied title
  and summary.
- Do not invent facts, names, quotations, dates,
  figures, locations, reasons or outcomes.
- Do not assume missing details.
- Do not claim that Downunder Voices attended an event,
  interviewed anyone or independently verified the
  report.
- Do not copy complete sentences from the source.
- Preserve the original meaning.

SOURCE ATTRIBUTION

- Attribute the named source naturally once.
- Attribution should usually appear in the second or
  third paragraph.
- Do not repeatedly mention the source.
- Do not refer to Google, RSS feeds, algorithms or
  automated systems.
- Do not tell readers to visit the original source.

ARTICLE STRUCTURE

- Begin with the main development.
- Explain who is affected and the immediate consequences.
- Add the background, competing positions, public response
  and next steps when those details are supplied.
- Distinguish clearly between confirmed facts, claims and
  matters that remain unresolved.
- Connect major Pacific and world developments to Australia,
  New Zealand or Pacific readers only when the supplied facts
  support that connection.
- Cover every material angle contained in the supplied facts,
  but never manufacture a missing angle.
- End when the available facts end.
- Do not add a generic conclusion.
- Do not pad the article.

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

- Write between 280 and 450 words when enough
  information is supplied.
- Write less when the source contains limited facts.
- Headline maximum 90 characters.
- communityAngle must contain one practical impact
  supported by the supplied material.
- If no clear practical impact is supported, return
  an empty string.

Return only the required JSON.
`.trim()
}

export async function writeArticle(
  input: WriteArticleInput,
): Promise<WrittenArticle> {
  const apiKey = process.env.OPENAI_API_KEY
  const mode: ArticleMode = input.mode ?? 'news'

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

          instructions:
            getWriterInstructions(mode),

          input: `
ARTICLE TYPE:
${mode === 'opinion' ? 'OPINION' : 'NEWS'}

COUNTRY:
${input.country ?? 'Not specified'}

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
                      'Original headline for the article.',
                  },

                  summary: {
                    type: 'string',
                    description:
                      'Original article based only on supplied facts.',
                  },

                  communityAngle: {
                    type: 'string',
                    description:
                      'One sentence explaining practical relevance, or an empty string.',
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

          max_output_tokens:
            mode === 'opinion' ? 1800 : 1500,
        }),

        signal: AbortSignal.timeout(45000),
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      const errorText =
        await response.text()

      console.error(
        `OpenAI writer failed with ${response.status}:`,
        errorText,
      )

      return fallbackArticle(input)
    }

    const data =
      (await response.json()) as {
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
        ?.flatMap(
          (item) => item.content ?? [],
        )
        .find(
          (content) =>
            content.type === 'output_text',
        )
        ?.text ??
      ''

    if (!rawText.trim()) {
      console.error(
        'OpenAI returned no article text',
      )

      return fallbackArticle(input)
    }

    const parsed =
      JSON.parse(rawText) as {
        title: string
        summary: string
        communityAngle: string
      }

    const title =
      normaliseText(parsed.title)

    const summary =
      parsed.summary
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim()

    const communityAngle =
      normaliseText(
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

      summary:
        summary.slice(
          0,
          mode === 'opinion'
            ? 9000
            : 4000,
        ),

      communityAngle:
        communityAngle.slice(
          0,
          500,
        ),

      rewritten: true,
    }
  } catch (error) {
    console.error(
      'AI article writing failed:',
      error,
    )

    return fallbackArticle(input)
  }
}
