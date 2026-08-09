import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import { uniqueSlug } from '@/lib/slug'
import type { CategorySlug } from '@/lib/news-data'

type EditorialCountry = 'Australia' | 'New Zealand'

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
  country: EditorialCountry
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

const AUSTRALIA_PATTERN =
  /\b(australia|australian|nsw|new south wales|victoria|victorian|queensland|western australia|south australia|tasmania|australian capital territory|northern territory|sydney|melbourne|brisbane|perth|adelaide|hobart|darwin|canberra)\b/i

const NEW_ZEALAND_PATTERN =
  /\b(new zealand|new zealander|new zealanders|aotearoa|nz|auckland|wellington|christchurch|hamilton|tauranga|dunedin|queenstown|rotorua|palmerston north|napier|nelson|invercargill)\b/i

const PACIFIC_ONLY_PATTERN =
  /\b(fiji|fijian|samoa|samoan|tonga|tongan|vanuatu|solomon islands|papua new guinea|png|kiribati|tuvalu|nauru|cook islands|new caledonia|french polynesia)\b/i

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

function storyText(story: RecentStory): string {
  return `${story.title} ${story.summary}`
}

function looksAustralian(
  story: RecentStory,
): boolean {
  if (story.category === 'australia') {
    return true
  }

  return AUSTRALIA_PATTERN.test(
    storyText(story),
  )
}

function looksNewZealand(
  story: RecentStory,
): boolean {
  const text = storyText(story)

  if (NEW_ZEALAND_PATTERN.test(text)) {
    return true
  }

  if (
    story.category === 'nz-pacific' &&
    !PACIFIC_ONLY_PATTERN.test(text)
  ) {
    return true
  }

  return false
}

function storiesForCountry(
  stories: RecentStory[],
  country: EditorialCountry,
): RecentStory[] {
  const selected = stories.filter(
    (story) => {
      if (country === 'Australia') {
        return looksAustralian(story)
      }

      return looksNewZealand(story)
    },
  )

  return selected.slice(0, 24)
}

function previousEditorialsForCountry(
  stories: RecentStory[],
  country: EditorialCountry,
): RecentStory[] {
  return stories
    .filter((story) => {
      if (country === 'Australia') {
        return looksAustralian(story)
      }

      return looksNewZealand(story)
    })
    .slice(0, 15)
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
      ?.flatMap(
        (item) => item.content ?? [],
      )
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
    const parameters =
      new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch:
          `${searchTerm} filetype:bitmap`,
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
        signal:
          AbortSignal.timeout(15000),
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      console.error(
        `Wikimedia image search returned ${response.status}`,
      )

      return null
    }

    const data =
      (await response.json()) as {
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
      const image =
        page.imageinfo?.[0]

      if (!image) {
        continue
      }

      const licence =
        image.extmetadata
          ?.LicenseShortName
          ?.value
          ?.toLowerCase()
          .trim() ?? ''

      const acceptableLicence =
        licence.includes(
          'public domain',
        ) ||
        licence.includes('cc0') ||
        licence.includes('cc by') ||
        licence.includes(
          'creative commons',
        )

      const imageUrl =
        image.thumburl ||
        image.url

      if (
        acceptableLicence &&
        imageUrl &&
        /^https?:\/\//i.test(
          imageUrl,
        )
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

async function generateEditorialForCountry(
  country: EditorialCountry,
  newsStories: RecentStory[],
  previousEditorials: RecentStory[],
): Promise<GeneratedEditorial> {
  const apiKey =
    process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is missing. Automated editorials cannot be generated.',
    )
  }

  if (newsStories.length < 2) {
    throw new Error(
      `Not enough recent ${country} stories to create an editorial.`,
    )
  }

  const newsMaterial =
    newsStories
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

  const previousMaterial =
    previousEditorials.length > 0
      ? previousEditorials
          .map(
            (story) =>
              `- ${story.title}`,
          )
          .join('\n')
      : '- No recent automated editorials for this country'

  const response = await fetch(
    'https://api.openai.com/v1/responses',
    {
      method: 'POST',

      headers: {
        Authorization:
          `Bearer ${apiKey}`,
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        model: 'gpt-5-mini',

        instructions: `
You are the senior opinion editor for Downunder Voices.

Downunder Voices is an independent digital publication covering Australia and New Zealand.

You must write exactly ONE original OPINION article about ${country}.

TOPIC SELECTION

Choose the strongest, most timely and most important public-interest issue from the supplied recent news material.

The priority is a genuine burning issue attracting national or substantial public attention.

Prefer subjects such as:

- government and politics
- cost of living
- housing
- employment
- immigration
- trade and the economy
- taxation
- health services
- education
- crime and public safety
- infrastructure
- major business developments
- significant court or regulatory matters
- major social policy debates
- major national controversies

Do not choose a trivial lifestyle story when a more important public-interest story is available.

Do not choose a Pacific-only issue.

The editorial must genuinely concern ${country}.

If several supplied stories concern the same underlying issue, you may use them together to understand the topic.

DUPLICATE AVOIDANCE

Recent Downunder Voices editorial headlines are supplied separately.

Do not substantially repeat a topic, argument or angle that has recently been covered.

A different headline about essentially the same issue still counts as a duplicate.

Choose a genuinely different issue whenever possible.

EDITORIAL APPROACH

- Establish what has happened.
- Explain why the issue matters.
- Present reasonable competing arguments fairly where relevant.
- Reach a clear but measured Downunder Voices editorial view.
- Focus on public interest.
- Challenge governments, opposition parties, businesses and institutions when justified by the supplied facts.
- Give credit where justified.
- Do not campaign for or against a political party or candidate.
- Do not tell readers how to vote.
- Do not make personal attacks.
- Do not blame entire ethnic, religious, migrant or community groups.
- Do not dismiss legitimate public concerns.

ACCURACY

- Use only facts contained in the supplied recent news material.
- Do not invent quotations.
- Do not invent polling numbers.
- Do not invent dates.
- Do not invent statistics.
- Do not invent policies.
- Do not invent motives.
- Do not invent events or outcomes.
- Do not state allegations as proven facts.
- Clearly distinguish factual reporting from editorial opinion.
- Do not claim Downunder Voices interviewed anyone.
- Do not claim Downunder Voices attended an event.
- Do not claim independent verification that did not occur.

SOURCE

Choose one genuine source URL from the supplied material that directly supports the central issue.

Never invent or modify a source URL.

WRITING STYLE

- Use natural Australian and New Zealand newspaper English.
- Write in a confident independent editorial voice.
- Sound human and individually written.
- Use short paragraphs.
- Use active voice.
- Avoid corporate language.
- Avoid academic language.
- Avoid promotional language.
- Avoid exaggerated language.
- Do not use bullet points inside the editorial.
- Begin directly with the issue.
- Do not add a generic conclusion simply to finish the article.
- The editorial should normally be 450 to 750 words.
- If the available facts do not support that length, write less.
- Never pad the story.

HEADLINE

Write a strong, responsible headline of no more than 100 characters.

Do not begin the headline with:

"Opinion:"
"Editorial:"

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
"At the end of the day"
"In an ever-changing world"

COMMUNITY ANGLE

Provide one concise sentence explaining how the issue could practically matter to ordinary people in ${country}, but only when supported by the supplied facts.

IMAGE SEARCH

Provide a short, neutral Wikimedia Commons search phrase related to the subject.

Examples:

Australian Parliament House Canberra
Sydney housing construction
New Zealand Parliament Wellington
Auckland housing
Australian supermarket
Wellington city

Do not request an insulting, defamatory or manipulated image.

Return only the required JSON.
        `.trim(),

        input: `
COUNTRY

${country}

RECENT NEWS MATERIAL

${newsMaterial}

RECENT DOWNUNDER VOICES EDITORIALS TO AVOID REPEATING

${previousMaterial}
        `.trim(),

        text: {
          format: {
            type: 'json_schema',
            name:
              'downunder_voices_country_editorial',
            strict: true,

            schema: {
              type: 'object',
              additionalProperties:
                false,

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

                country: {
                  type: 'string',
                  enum: [
                    'Australia',
                    'New Zealand',
                  ],
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
                'country',
              ],
            },
          },
        },

        max_output_tokens: 2200,
      }),

      signal:
        AbortSignal.timeout(60000),
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    const errorText =
      await response.text()

    throw new Error(
      `OpenAI ${country} editorial generator failed with ${response.status}: ${errorText}`,
    )
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
    extractOutputText(data)

  if (!rawText.trim()) {
    throw new Error(
      `OpenAI returned no ${country} editorial content`,
    )
  }

  const parsed =
    JSON.parse(rawText) as GeneratedEditorial

  const sourceStory =
    newsStories.find(
      (story) =>
        story.source_url.trim() ===
        parsed.sourceUrl.trim(),
    )

  if (!sourceStory) {
    throw new Error(
      `The ${country} editorial returned a source URL that was not in the supplied news material.`,
    )
  }

  const title =
    normaliseText(parsed.title)

  const summary =
    cleanEditorial(parsed.summary)

  if (!title || !summary) {
    throw new Error(
      `The ${country} editorial was incomplete.`,
    )
  }

  return {
    title:
      title.slice(0, 220),

    summary:
      summary.slice(0, 9000),

    communityAngle:
      normaliseText(
        parsed.communityAngle,
      ).slice(0, 1200),

    category:
      validCategory(
        parsed.category,
      )
        ? parsed.category
        : country === 'Australia'
          ? ('australia' as CategorySlug)
          : ('nz-pacific' as CategorySlug),

    sourceName:
      normaliseText(
        sourceStory.source_name ||
          parsed.sourceName,
      ).slice(0, 160),

    sourceUrl:
      sourceStory.source_url,

    imageSearch:
      normaliseText(
        parsed.imageSearch,
      ).slice(0, 160),

    country,
  }
}

function wordsForDuplicateCheck(
  value: string,
): string[] {
  const ignored = new Set([
    'about',
    'after',
    'again',
    'against',
    'australia',
    'australian',
    'could',
    'from',
    'have',
    'into',
    'more',
    'new',
    'new zealand',
    'over',
    'should',
    'that',
    'their',
    'this',
    'with',
    'will',
    'what',
    'when',
    'where',
  ])

  return normaliseText(value)
    .toLowerCase()
    .replace(
      /[^a-z0-9\s]/g,
      ' ',
    )
    .split(/\s+/)
    .filter(
      (word) =>
        word.length >= 4 &&
        !ignored.has(word),
    )
}

function looksLikeDuplicateTopic(
  title: string,
  previousEditorials: RecentStory[],
): boolean {
  const currentWords =
    new Set(
      wordsForDuplicateCheck(title),
    )

  if (currentWords.size === 0) {
    return false
  }

  return previousEditorials.some(
    (previous) => {
      const previousWords =
        new Set(
          wordsForDuplicateCheck(
            previous.title,
          ),
        )

      let overlap = 0

      for (const word of currentWords) {
        if (
          previousWords.has(word)
        ) {
          overlap += 1
        }
      }

      const smallerSize =
        Math.min(
          currentWords.size,
          previousWords.size,
        )

      if (smallerSize === 0) {
        return false
      }

      return (
        overlap / smallerSize >= 0.65
      )
    },
  )
}

async function publishEditorial(
  editorial: GeneratedEditorial,
  previousEditorials: RecentStory[],
  index: number,
): Promise<boolean> {
  if (
    looksLikeDuplicateTopic(
      editorial.title,
      previousEditorials,
    )
  ) {
    console.log(
      `Skipping similar recent editorial: ${editorial.title}`,
    )

    return false
  }

  const existing =
    await dbRequest<
      Array<{ id: string }>
    >('stories', {
      query:
        `?select=id&title=eq.${encodeURIComponent(
          editorial.title,
        )}&limit=1`,
    })

  if (existing.length > 0) {
    console.log(
      `Skipping duplicate editorial: ${editorial.title}`,
    )

    return false
  }

  const imageUrl =
    (await findWikimediaImage(
      editorial.imageSearch,
    )) ||
    DEFAULT_EDITORIAL_IMAGE

  await dbRequest('stories', {
    method: 'POST',

    body: {
      slug: uniqueSlug(
        editorial.title,
        `${editorial.sourceUrl}-${editorial.country}-${Date.now()}-${index}`,
      ),

      title:
        editorial.title,

      category:
        editorial.category,

      summary:
        editorial.summary,

      source_name:
        editorial.sourceName ||
        'Downunder Voices Editorial',

      source_url:
        editorial.sourceUrl,

      image_url:
        imageUrl,

      community_angle:
        editorial.communityAngle ||
        null,

      author:
        'Downunder Voices Editorial',

      status:
        'published',

      published_at:
        new Date().toISOString(),

      import_method:
        'automated-editorial',
    },
  })

  console.log(
    `Published ${editorial.country} automated editorial: ${editorial.title}`,
  )

  return true
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
          '?select=id,title,summary,category,source_name,source_url,image_url,import_method,published_at&status=eq.published&order=published_at.desc&limit=100',
      },
    )

  const previousEditorials =
    recentStories
      .filter(
        (story) =>
          story.import_method ===
          'automated-editorial',
      )
      .slice(0, 30)

  const newsStories =
    recentStories
      .filter(
        (story) =>
          story.import_method !==
            'automated-editorial' &&
          Boolean(
            story.title &&
            story.summary &&
            story.source_url,
          ),
      )
      .slice(0, 70)

  const australianStories =
    storiesForCountry(
      newsStories,
      'Australia',
    )

  const newZealandStories =
    storiesForCountry(
      newsStories,
      'New Zealand',
    )

  console.log(
    `Editorial candidates: Australia=${australianStories.length}, New Zealand=${newZealandStories.length}`,
  )

  if (
    australianStories.length < 2
  ) {
    throw new Error(
      'Not enough recent Australian stories to create an automated opinion article.',
    )
  }

  if (
    newZealandStories.length < 2
  ) {
    throw new Error(
      'Not enough recent New Zealand stories to create an automated opinion article.',
    )
  }

  const previousAustralia =
    previousEditorialsForCountry(
      previousEditorials,
      'Australia',
    )

  const previousNewZealand =
    previousEditorialsForCountry(
      previousEditorials,
      'New Zealand',
    )

  const [
    australianEditorial,
    newZealandEditorial,
  ] = await Promise.all([
    generateEditorialForCountry(
      'Australia',
      australianStories,
      previousAustralia,
    ),

    generateEditorialForCountry(
      'New Zealand',
      newZealandStories,
      previousNewZealand,
    ),
  ])

  const generatedEditorials = [
    australianEditorial,
    newZealandEditorial,
  ]

  const createdTitles: string[] =
    []

  for (
    let index = 0;
    index <
    generatedEditorials.length;
    index += 1
  ) {
    const editorial =
      generatedEditorials[index]

    const countryPrevious =
      editorial.country ===
      'Australia'
        ? previousAustralia
        : previousNewZealand

    const created =
      await publishEditorial(
        editorial,
        countryPrevious,
        index,
      )

    if (created) {
      createdTitles.push(
        editorial.title,
      )
    }
  }

  return {
    created:
      createdTitles.length,

    titles:
      createdTitles,
  }
}
