import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import { uniqueSlug } from '@/lib/slug'
import type { CategorySlug } from '@/lib/news-data'

type RecentStory = {
  id: string
  title: string
  summary: string
  category: CategorySlug
  source_name: string
  source_url: string
  image_url: string | null
  import_method: string | null
  published_at: string | null
}

type GeneratedEditorial = {
  title: string
  summary: string
  communityAngle: string
  category: CategorySlug
  sourceName: string
  sourceUrl: string
  imageSearch: string
}

export type EditorialGenerationResult = {
  created: number
  titles: string[]
}

const DEFAULT_EDITORIAL_IMAGE =
  'https://www.downundervoices.com/images/downunder-default-news.jpg'

const ALLOWED_CATEGORIES: CategorySlug[] = [
  'politics',
  'australia',
  'nz-pacific',
  'business',
  'community',
  'sports',
]

function normaliseText(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .trim()
}

function cleanEditorial(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function validCategory(
  value: string,
): value is CategorySlug {
  return ALLOWED_CATEGORIES.includes(
    value as CategorySlug,
  )
}

function extractOutputText(data: {
  output_text?: string
  output?: Array<{
    content?: Array<{
      type?: string
      text?: string
    }>
  }>
}): string {
  return (
    data.output_text ??
    data.output
      ?.flatMap((item) => item.content ?? [])
      .find(
        (content) =>
          content.type === 'output_text',
      )
      ?.text ??
    ''
  )
}

async function findWikimediaImage(
  searchTerm: string,
): Promise<string | null> {
  if (!searchTerm.trim()) {
    return null
  }

  try {
    const parameters = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: `${searchTerm} filetype:bitmap`,
      gsrnamespace: '6',
      gsrlimit: '10',
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: '1400',
      format: 'json',
      origin: '*',
    })

    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?${parameters.toString()}`,
      {
        headers: {
          'User-Agent':
            'DownunderVoicesBot/1.0 (+https://www.downundervoices.com)',
        },
        signal: AbortSignal.timeout(15000),
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      console.error(
        `Wikimedia image search returned ${response.status}`,
      )

      return null
    }

    const data = (await response.json()) as {
      query?: {
        pages?: Record<
          string,
          {
            imageinfo?: Array<{
              url?: string
              thumburl?: string
              extmetadata?: {
                LicenseShortName?: {
                  value?: string
                }
              }
            }>
          }
        >
      }
    }

    const pages = Object.values(
      data.query?.pages ?? {},
    )

    for (const page of pages) {
      const image = page.imageinfo?.[0]

      if (!image) {
        continue
      }

      const licence =
        image.extmetadata?.LicenseShortName?.value
          ?.toLowerCase()
          .trim() ?? ''

      const acceptableLicence =
        licence.includes('public domain') ||
        licence.includes('cc0') ||
        licence.includes('cc by') ||
        licence.includes('creative commons')

      const imageUrl =
        image.thumburl || image.url

      if (
        acceptableLicence &&
        imageUrl &&
        /^https?:\/\//i.test(imageUrl)
      ) {
        return imageUrl
      }
    }

    return null
  } catch (error) {
    console.error(
      'Wikimedia image search failed:',
      error,
    )

    return null
  }
}

async function generateEditorials(
  newsStories: RecentStory[],
  previousEditorials: RecentStory[],
): Promise<GeneratedEditorial[]> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is missing. Automated editorials cannot be generated.',
    )
  }

  const newsMaterial = newsStories
    .map(
      (story, index) => `
STORY ${index + 1}
Title: ${story.title}
Category: ${story.category}
Source: ${story.source_name}
Source URL: ${story.source_url}
Facts: ${story.summary}
      `.trim(),
    )
    .join('\n\n')

  const previousTitles =
    previousEditorials.length > 0
      ? previousEditorials
          .map(
            (story) => `- ${story.title}`,
          )
          .join('\n')
      : '- No recent automated editorials'

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
You are the senior editorial writer for Downunder Voices, an independent publication covering Australia, New Zealand and the Pacific.

Choose exactly two important and timely topics from the supplied recent news stories.

Write two original editorials.

EDITORIAL POSITION

- Do not endorse Pauline Hanson, One Nation or any political party.
- Do not campaign for or against a candidate.
- Examine political claims critically.
- Challenge racism, personal attacks and the blaming of entire communities.
- Recognise legitimate public concerns about housing, migration, infrastructure, public services and cost of living.
- Do not dismiss voters as ignorant or racist.
- Focus criticism on policies, statements, leadership and political conduct.
- Support respectful democratic debate and social cohesion.

ACCURACY

- Use only facts contained in the supplied stories.
- Do not invent quotations, polling numbers, dates, events, policies or personal details.
- Do not state allegations as proven facts.
- Clearly distinguish fact from editorial opinion.
- Do not claim Downunder Voices interviewed anyone or attended an event.
- Select a genuine source name and source URL from the supplied material.
- Never create or alter a source URL.

WRITING STYLE

- Use natural Australian and New Zealand English.
- Write in a confident independent editorial voice.
- Avoid artificial or promotional language.
- Use short paragraphs.
- Do not use bullet points in the editorial.
- Do not begin both editorials in the same way.
- Do not use generic conclusions.
- Each editorial should be between 350 and 650 words.
- Each headline must be no longer than 100 characters.
- The articles must discuss two different topics.
- Avoid repeating recent editorial headlines or substantially repeating the same argument.

BANNED PHRASES

Never use:

"This development highlights"
"It is important to note"
"In today's rapidly changing world"
"Only time will tell"
"Remains to be seen"
"Serves as a reminder"
"Stakeholders"
"Underscores the importance"
"This article explores"
"This editorial will examine"

IMAGE SEARCH

For each editorial, provide a short Wikimedia Commons image search phrase.

Use a neutral subject such as:

- Australian Parliament House Canberra
- multicultural community Australia
- Parliament House Wellington New Zealand
- Australian housing construction
- cost of living supermarket Australia

Do not request a defamatory, insulting or manipulated image.

Return exactly two editorial objects and only the required JSON.
        `.trim(),

        input: `
RECENT NEWS MATERIAL

${newsMaterial}

RECENT EDITORIALS TO AVOID REPEATING

${previousTitles}
        `.trim(),

        text: {
          format: {
            type: 'json_schema',
            name: 'downunder_voices_editorials',
            strict: true,

            schema: {
              type: 'object',
              additionalProperties: false,

              properties: {
                editorials: {
                  type: 'array',
                  minItems: 2,
                  maxItems: 2,

                  items: {
                    type: 'object',
                    additionalProperties: false,

                    properties: {
                      title: {
                        type: 'string',
                      },

                      summary: {
                        type: 'string',
                      },

                      communityAngle: {
                        type: 'string',
                      },

                      category: {
                        type: 'string',
                        enum: [
                          'politics',
                          'australia',
                          'nz-pacific',
                          'business',
                          'community',
                          'sports',
                        ],
                      },

                      sourceName: {
                        type: 'string',
                      },

                      sourceUrl: {
                        type: 'string',
                      },

                      imageSearch: {
                        type: 'string',
                      },
                    },

                    required: [
                      'title',
                      'summary',
                      'communityAngle',
                      'category',
                      'sourceName',
                      'sourceUrl',
                      'imageSearch',
                    ],
                  },
                },
              },

              required: ['editorials'],
            },
          },
        },

        max_output_tokens: 4000,
      }),

      signal: AbortSignal.timeout(60000),
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `OpenAI editorial generator failed with ${response.status}: ${errorText}`,
    )
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

  const rawText = extractOutputText(data)

  if (!rawText.trim()) {
    throw new Error(
      'OpenAI returned no editorial content',
    )
  }

  const parsed = JSON.parse(rawText) as {
    editorials?: GeneratedEditorial[]
  }

  if (
    !Array.isArray(parsed.editorials) ||
    parsed.editorials.length !== 2
  ) {
    throw new Error(
      'OpenAI did not return exactly two editorials',
    )
  }

  return parsed.editorials
    .map((editorial) => ({
      title: normaliseText(
        editorial.title,
      ).slice(0, 220),

      summary: cleanEditorial(
        editorial.summary,
      ).slice(0, 4000),

      communityAngle: normaliseText(
        editorial.communityAngle,
      ).slice(0, 1200),

      category: validCategory(
        editorial.category,
      )
        ? editorial.category
        : ('politics' as CategorySlug),

      sourceName: normaliseText(
        editorial.sourceName,
      ).slice(0, 160),

      sourceUrl:
        editorial.sourceUrl.trim(),

      imageSearch: normaliseText(
        editorial.imageSearch,
      ).slice(0, 160),
    }))
    .filter(
      (editorial) =>
        editorial.title &&
        editorial.summary &&
        /^https?:\/\//i.test(
          editorial.sourceUrl,
        ),
    )
}

export async function runEditorialGenerator(): Promise<EditorialGenerationResult> {
  if (!isDatabaseConfigured()) {
    throw new Error(
      'Database is not configured',
    )
  }

  const recentStories =
    await dbRequest<RecentStory[]>(
      'stories',
      {
        query:
          '?select=id,title,summary,category,source_name,source_url,image_url,import_method,published_at&status=eq.published&order=published_at.desc&limit=60',
      },
    )

  const previousEditorials =
    recentStories
      .filter(
        (story) =>
          story.import_method ===
          'automated-editorial',
      )
      .slice(0, 12)

  const newsStories = recentStories
    .filter(
      (story) =>
        story.import_method !==
          'automated-editorial' &&
        story.title &&
        story.summary &&
        story.source_url,
    )
    .slice(0, 30)

  if (newsStories.length < 4) {
    throw new Error(
      'Not enough recent published stories to create editorials.',
    )
  }

  const generatedEditorials =
    await generateEditorials(
      newsStories,
      previousEditorials,
    )

  if (generatedEditorials.length !== 2) {
    throw new Error(
      'The editorial generator did not produce two valid articles.',
    )
  }

  const createdTitles: string[] = []

  for (const [
    index,
    editorial,
  ] of generatedEditorials.entries()) {
    const imageUrl =
      (await findWikimediaImage(
        editorial.imageSearch,
      )) || DEFAULT_EDITORIAL_IMAGE

    const existing = await dbRequest<
      Array<{ id: string }>
    >('stories', {
      query: `?select=id&title=eq.${encodeURIComponent(
        editorial.title,
      )}&limit=1`,
    })

    if (existing.length > 0) {
      console.log(
        `Skipping duplicate editorial: ${editorial.title}`,
      )

      continue
    }

    await dbRequest('stories', {
      method: 'POST',

      body: {
        slug: uniqueSlug(
          editorial.title,
          `${editorial.sourceUrl}-${Date.now()}-${index}`,
        ),

        title: editorial.title,
        category: editorial.category,
        summary: editorial.summary,

        source_name:
          editorial.sourceName ||
          'Downunder Voices Editorial',

        source_url: editorial.sourceUrl,
        image_url: imageUrl,

        community_angle:
          editorial.communityAngle || null,

        author:
          'Downunder Voices Editorial',

        status: 'published',

        published_at:
          new Date().toISOString(),

        import_method:
          'automated-editorial',
      },
    })

    createdTitles.push(editorial.title)

    console.log(
      `Published automated editorial: ${editorial.title}`,
    )
  }

  return {
    created: createdTitles.length,
    titles: createdTitles,
  }
}
