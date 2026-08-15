import { dbRequest, isDatabaseConfigured } from '@/lib/db'
import { uniqueSlug } from '@/lib/slug'
import {
  normaliseCategorySlug,
  type CategorySlug,
} from '@/lib/news-data'
import { scoreStory } from '@/lib/story-score'

type EditorialRegion =
  | 'Australia'
  | 'New Zealand'
  | 'World'

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
  region: EditorialRegion
}

export type EditorialGenerationResult = {
  created: number
  titles: string[]
}

const DEFAULT_EDITORIAL_IMAGE =
  'https://www.downundervoices.com/images/downunder-default-news.jpg'

const ALLOWED_CATEGORIES: CategorySlug[] = [
  'australia',
  'new-zealand',
  'world',
  'social-issues',
  'small-business',
  'trade-logistics',
  'community',
  'sports',
  'entertainment',

  // Legacy compatibility while older stories remain in the database.
  'politics',
  'business',
  'nz-pacific',
]

const AUSTRALIA_PATTERN =
  /\b(australia|australian|australians|nsw|new south wales|victoria|victorian|queensland|western australia|south australia|tasmania|australian capital territory|northern territory|sydney|melbourne|brisbane|perth|adelaide|hobart|darwin|canberra)\b/i

const NEW_ZEALAND_PATTERN =
  /\b(new zealand|new zealander|new zealanders|aotearoa|auckland|wellington|christchurch|hamilton|tauranga|dunedin|queenstown|rotorua|palmerston north|napier|nelson|invercargill)\b/i

const HIGH_PRIORITY_PATTERN =
  /\b(hunger|famine|food insecurity|poverty|poor|inequality|inequity|racism|racist|racial|discrimination|discriminatory|migrant|migrants|migration|immigration|refugee|refugees|asylum|worker|workers|wage theft|underpayment|exploitation|exploited|modern slavery|forced labour|forced labor|human trafficking|housing|homeless|homelessness|rent|rental|cost of living|living costs|healthcare|health care|hospital|education|school|unemployment|employment|layoff|redundancy|war|conflict|civilian|civilians|humanitarian|human rights|corruption|corrupt|abuse of power|social injustice|injustice|indigenous|first nations|māori|maori|child poverty|domestic violence|family violence|crime|justice|prison|detention|deportation|deport|tax|taxation|inflation|food prices|grocery|groceries|energy prices|electricity prices|interest rates|mortgage|wages|salary|union|labour rights|labor rights)\b/i

const MEDIUM_PRIORITY_PATTERN =
  /\b(government|minister|parliament|election|politics|political|policy|economy|economic|business|trade|infrastructure|transport|public service|public services|regulator|regulation|court|legal|law|climate|environment|disaster|flood|fire|drought|housing supply|health system|education system)\b/i

const LOW_PRIORITY_PATTERN =
  /\b(celebrity|entertainment|reality tv|masterchef|royal family|fashion|beauty|recipe|travel tips|holiday tips|horoscope|lottery|gaming review|movie review|television review)\b/i


const PUBLIC_ANGER_PATTERN =
  /\b(protest|protests|protester|protesters|demonstration|demonstrations|march|rally|public anger|outrage|backlash|boycott|petition|strike|walkout|student protest|mass protest|civil unrest)\b/i

const ACCOUNTABILITY_PATTERN =
  /\b(corruption|corrupt|misconduct|abuse of power|conflict of interest|cover-up|cover up|inquiry|investigation|ombudsman|watchdog|royal commission|audit|resign|resignation|sacked|fired|breach|ethics|accountability|public money|taxpayer money|political donation|lobbying)\b/i

const MIGRANT_LABOUR_PATTERN =
  /\b(migrant worker|migrant workers|asian worker|asian workers|temporary migrant|temporary migrants|visa worker|visa workers|foreign worker|foreign workers|underpaid|underpayment|wage theft|unpaid wages|exploitation|exploited|labour exploitation|labor exploitation|unsafe working conditions|modern slavery|forced labour|forced labor|human trafficking|employer abuse|workplace abuse)\b/i

const SERIOUS_CRIME_JUSTICE_PATTERN =
  /\b(murder|homicide|assault|sexual assault|domestic violence|family violence|fraud|scam|charged|arrested|court|trial|sentenced|sentence|prison|police investigation|criminal investigation|justice system|victim|victims)\b/i

const GOVERNMENT_DECISION_PATTERN =
  /\b(government decision|government policy|policy decision|ministerial decision|budget cut|funding cut|law change|legislation|bill before parliament|regulation|immigration policy|deportation policy|visa policy|tax change|welfare cut|health funding|education funding|housing policy)\b/i

const ENTERTAINMENT_PUBLIC_INTEREST_PATTERN =
  /\b(celebrity|actor|actress|singer|musician|film|movie|television|tv|entertainment|influencer|social media)\b/i

const SPORT_PUBLIC_INTEREST_PATTERN =
  /\b(racism|discrimination|abuse|exploitation|corruption|governance|public money|gender equality|safety|indigenous rights|human rights|betting scandal|match fixing|doping|sexual assault|violence)\b/i

function normaliseText(
  value: string,
): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(
      /\s+([,.!?;:])/g,
      '$1',
    )
    .trim()
}

function cleanEditorial(
  value: string,
): string {
  return value
    .replace(
      /```[\s\S]*?```/g,
      ' ',
    )
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

function storyText(
  story: RecentStory,
): string {
  return `${story.title} ${story.summary}`
}

function detectRegion(
  story: RecentStory,
): EditorialRegion {
  const text =
    storyText(story)

  const normalisedCategory =
    normaliseCategorySlug(
      story.category,
    )

  if (
    normalisedCategory ===
      'australia' ||
    AUSTRALIA_PATTERN.test(text)
  ) {
    return 'Australia'
  }

  if (
    normalisedCategory ===
      'new-zealand' ||
    NEW_ZEALAND_PATTERN.test(text)
  ) {
    return 'New Zealand'
  }

  return 'World'
}

function storyPriorityScore(
  story: RecentStory,
  index: number,
): number {
  const text =
    storyText(story)

  const normalisedCategory =
    normaliseCategorySlug(
      story.category,
    )

  /*
   * Start with the same reader-interest score used by the
   * public site, then apply stricter Opinion/public-interest
   * weighting below.
   */
  let score = Math.round(
    scoreStory({
      title: story.title,
      summary: story.summary,
      category: normalisedCategory,
      sourceName: story.source_name,
      publishedAt:
        story.published_at ?? undefined,
    }) / 4,
  )

  if (
    HIGH_PRIORITY_PATTERN.test(text)
  ) {
    score += 12
  }

  if (
    PUBLIC_ANGER_PATTERN.test(text)
  ) {
    score += 15
  }

  if (
    ACCOUNTABILITY_PATTERN.test(text)
  ) {
    score += 18
  }

  if (
    MIGRANT_LABOUR_PATTERN.test(text)
  ) {
    score += 20
  }

  if (
    SERIOUS_CRIME_JUSTICE_PATTERN.test(text)
  ) {
    score += 10
  }

  if (
    GOVERNMENT_DECISION_PATTERN.test(text)
  ) {
    score += 12
  }

  if (
    MEDIUM_PRIORITY_PATTERN.test(text)
  ) {
    score += 5
  }

  const region =
    detectRegion(story)

  if (
    region === 'Australia' ||
    region === 'New Zealand'
  ) {
    score += 6
  }

  if (
    normalisedCategory ===
      'social-issues'
  ) {
    score += 6
  }

  if (
    normalisedCategory ===
      'community'
  ) {
    score += 3
  }

  if (
    normalisedCategory ===
      'small-business'
  ) {
    score += 2
  }

  if (
    normalisedCategory ===
      'entertainment'
  ) {
    /*
     * Entertainment is welcome on the news site, but an
     * Opinion article should normally require a wider issue
     * such as discrimination, exploitation, public policy,
     * misconduct or another serious public-interest angle.
     */
    if (
      ACCOUNTABILITY_PATTERN.test(text) ||
      PUBLIC_ANGER_PATTERN.test(text) ||
      HIGH_PRIORITY_PATTERN.test(text)
    ) {
      score += 3
    } else {
      score -= 14
    }
  }

  if (
    normalisedCategory === 'sports'
  ) {
    if (
      SPORT_PUBLIC_INTEREST_PATTERN.test(
        text,
      )
    ) {
      score += 4
    } else {
      score -= 8
    }
  }

  if (
    LOW_PRIORITY_PATTERN.test(text) &&
    !ACCOUNTABILITY_PATTERN.test(text) &&
    !PUBLIC_ANGER_PATTERN.test(text)
  ) {
    score -= 10
  }

  /*
   * RecentStories arrives newest first. Give slightly
   * greater weight to fresher material without allowing
   * freshness to overwhelm public-interest importance.
   */
  score += Math.max(
    0,
    5 - Math.floor(index / 10),
  )

  return score
}

function rankNewsStories(
  stories: RecentStory[],
): RecentStory[] {
  return stories
    .map(
      (story, index) => ({
        story,
        score:
          storyPriorityScore(
            story,
            index,
          ),
      }),
    )
    .sort(
      (a, b) =>
        b.score - a.score,
    )
    .map(
      (item) => item.story,
    )
}

function extractOutputText(
  data: {
    output_text?: string

    output?: Array<{
      content?: Array<{
        type?: string
        text?: string
      }>
    }>
  },
): string {
  return (
    data.output_text ??
    data.output
      ?.flatMap(
        (item) =>
          item.content ?? [],
      )
      .find(
        (content) =>
          content.type ===
          'output_text',
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
        iiprop:
          'url|extmetadata',
        iiurlwidth: '1400',
        format: 'json',
        origin: '*',
      })

    const response =
      await fetch(
        `https://commons.wikimedia.org/w/api.php?${parameters.toString()}`,
        {
          headers: {
            'User-Agent':
              'DownunderVoicesBot/1.0 (+https://www.downundervoices.com)',
          },

          signal:
            AbortSignal.timeout(
              15000,
            ),

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

    const pages =
      Object.values(
        data.query?.pages ??
          {},
      )

    for (
      const page of pages
    ) {
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
        licence.includes(
          'cc0',
        ) ||
        licence.includes(
          'cc by',
        ) ||
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

function buildNewsMaterial(
  stories: RecentStory[],
): string {
  return stories
    .map(
      (story, index) => `
STORY ${index + 1}
Region: ${detectRegion(story)}
Title: ${story.title}
Category: ${story.category}
Source: ${story.source_name}
Source URL: ${story.source_url}
Facts: ${story.summary}
      `.trim(),
    )
    .join('\n\n')
}

function buildPreviousMaterial(
  previousEditorials: RecentStory[],
): string {
  if (
    previousEditorials.length ===
    0
  ) {
    return (
      '- No recent automated Opinion articles'
    )
  }

  return previousEditorials
    .map(
      (story) =>
        `- ${story.title}`,
    )
    .join('\n')
}

async function generateEditorialCandidates(
  newsStories: RecentStory[],
  previousEditorials: RecentStory[],
): Promise<
  GeneratedEditorial[]
> {
  const apiKey =
    process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is missing. Automated Opinion articles cannot be generated.',
    )
  }

  if (
    newsStories.length < 4
  ) {
    throw new Error(
      'Not enough recent news stories to create automated Opinion articles.',
    )
  }

  const newsMaterial =
    buildNewsMaterial(
      newsStories,
    )

  const previousMaterial =
    buildPreviousMaterial(
      previousEditorials,
    )

  const response =
    await fetch(
      'https://api.openai.com/v1/responses',
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify({
            model:
              'gpt-5-mini',

            instructions: `
You are the senior opinion editor for Downunder Voices.

Downunder Voices is an independent digital publication based in the Australia-New Zealand region with an international public-interest outlook.

Your task is to identify the strongest burning issues from the supplied recent news material and prepare THREE ranked Opinion candidates. Prioritise stories that ordinary readers are likely to care about, discuss or debate, but never invent engagement figures or social-media reaction that is not supplied.

Only the best TWO valid and non-duplicate candidates will normally be published.

MISSION

Downunder Voices gives a voice to ordinary people and examines issues affecting dignity, fairness, opportunity, democracy and social justice.

Australia and New Zealand are our home region and should receive strong editorial attention.

However, important world issues must also be covered.

Do not force an Australian or New Zealand topic merely to satisfy geography when a much more important world issue deserves attention.

Likewise, do not ignore a major Australian or New Zealand issue simply because an international story appears more dramatic.

BURNING ISSUES

Give strong priority to current public-interest issues involving:

- hunger
- famine
- food insecurity
- poverty
- child poverty
- economic inequality
- the widening gap between rich and poor
- racism
- racial discrimination
- discrimination against minorities
- migrant communities
- migrant worker exploitation
- exploitation or underpayment of Asian and other migrant workers in Australia and New Zealand where supported by the supplied facts
- temporary worker exploitation
- visa-worker abuse
- wage theft
- underpayment
- unpaid wages
- unsafe working conditions
- modern slavery
- forced labour
- human trafficking
- refugee treatment
- asylum seekers
- immigration policy
- housing affordability
- homelessness
- rent pressure
- cost of living
- grocery and food prices
- electricity and energy costs
- unemployment
- insecure employment
- access to healthcare
- failures in health services
- access to education
- social disadvantage
- Indigenous and First Nations disadvantage
- Māori disadvantage
- human rights
- social injustice
- war and civilian suffering
- humanitarian crises
- corruption and credible corruption allegations
- political misconduct and conflicts of interest
- abuse of political or corporate power
- failures of government accountability
- controversial government decisions with serious public consequences
- public protests, demonstrations and sustained public anger
- misuse or questionable use of public money
- significant crime and justice issues
- major economic policies affecting ordinary households
- major environmental or climate injustice

These themes are priorities, not an exhaustive list.

TOPIC SELECTION

Choose THREE strong candidates ranked from most important to third most important.

Candidates must concern THREE genuinely different underlying issues.

Do not simply choose three headlines about the same controversy.

Prefer stories that:

1. affect a large number of people or expose serious harm to a vulnerable group;
2. involve serious human, economic or social consequences;
3. raise questions of fairness, accountability or public policy;
4. are current and timely;
5. have enough factual material supplied to support a responsible Opinion article;
6. involve public protest, controversy, investigation, court action, institutional failure or another clear sign that the issue has become a significant public debate, when that is supported by the supplied material.

Avoid trivial celebrity, entertainment or lifestyle stories when serious public-interest material is available. Entertainment or sport may be selected when the supplied facts reveal a substantial issue involving discrimination, exploitation, misconduct, governance, public money, safety, rights or another serious public-interest concern.

SPORT

Sport should normally not be selected unless the story raises a major public-interest issue such as:

- discrimination
- racism
- abuse
- exploitation
- corruption
- governance
- public money
- gender equality
- serious safety issues
- Indigenous rights
- human rights

GEOGRAPHIC BALANCE

Australia, New Zealand and the wider world are all eligible.

Try to maintain geographic variety over time.

When two issues are similarly important, prefer the Australian or New Zealand issue.

Do not manufacture geographic balance.

Do not reject an important world issue merely because it is outside Australia or New Zealand.

EDITORIAL VALUES

Downunder Voices is independent.

Do not endorse or campaign for any political party or candidate.

Do not automatically support governments.

Do not automatically oppose governments.

Do not automatically support opposition parties.

Do not automatically oppose opposition parties.

Judge policies, decisions, institutions and conduct on their merits.

The editorial may criticise:

- governments
- opposition parties
- corporations
- employers
- unions
- institutions
- regulators
- political leaders
- international organisations

when criticism is reasonably supported by the supplied facts.

Give credit where it is justified.

Do not dismiss legitimate public concerns.

Do not use racism, xenophobia or hatred as an editorial tool.

Do not blame an entire ethnic, religious, migrant or national community for the conduct of individuals.

Do not make personal attacks.

Do not tell readers how to vote.

FAIRNESS

Where a serious issue has reasonable competing arguments, explain the strongest relevant arguments fairly before reaching the Downunder Voices editorial view.

Do not create false balance where the supplied facts do not support it.

Distinguish clearly between:

- established facts;
- allegations;
- claims;
- political arguments;
- editorial opinion.

ACCURACY

Use ONLY facts contained in the supplied recent news material.

Do not invent:

- quotations
- names
- dates
- polling numbers
- statistics
- policies
- laws
- motives
- events
- outcomes
- locations
- financial figures
- allegations

Do not state an allegation as proven fact.

Do not claim Downunder Voices interviewed anyone.

Do not claim Downunder Voices attended an event.

Do not claim independent verification that did not occur.

If the supplied material is too thin to support a statement, leave that statement out.

SOURCE RULE

Each candidate must select ONE genuine Source URL from the supplied recent news material that directly supports the main issue.

Copy the Source URL exactly.

Never invent a Source URL.

Never alter a Source URL.

The sourceName should correspond with that source.

ORIGINALITY

Do not copy complete sentences from source material.

Do not merely rewrite a source article paragraph by paragraph.

Use the available facts to create an original Downunder Voices Opinion piece.

RECENT OPINIONS

Recent Downunder Voices Opinion headlines are supplied separately.

Avoid substantially repeating:

- the same underlying issue;
- the same editorial argument;
- the same policy debate;
- the same central subject.

A different headline about essentially the same issue still counts as repetition.

If one burning issue has already been heavily covered recently, choose another strong issue where possible.

WRITING STYLE

Use natural Australian and New Zealand newspaper English.

Sound like a thoughtful independent newspaper editorial writer.

Write for ordinary readers.

Use clear language.

Use active voice.

Use short paragraphs.

Vary sentence structure.

Begin directly with the issue.

Do not sound like an AI assistant.

Do not sound like an academic essay.

Do not sound like a government press release.

Do not sound like corporate communications.

Do not use bullet points inside the final Opinion article.

Do not add a generic conclusion simply to reach a word count.

Each Opinion article should normally be 450 to 750 words.

If the supplied facts support less, write less.

Never pad an article.

EDITORIAL VIEW

The article must contain a genuine editorial perspective.

It should not simply summarise the news.

Explain:

- why the issue matters;
- who is affected;
- what questions need answering;
- what policy or institutional problem is exposed where supported;
- what a reasonable response should focus on.

The editorial view should be clear but measured.

HEADLINES

Each headline must:

- be original;
- be responsible;
- be no longer than 100 characters;
- accurately reflect the article;
- avoid clickbait.

Do not begin headlines with:

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
"In today's world"
"The issue at hand"
"Moving forward"

COMMUNITY ANGLE

For each candidate, provide one concise sentence explaining why the issue matters to ordinary people.

It must be supported by the supplied facts.

IMAGE SEARCH

For each candidate provide a short, neutral Wikimedia Commons image search phrase.

The search should describe:

- a location;
- public institution;
- streetscape;
- parliament;
- workplace;
- housing;
- community;
- humanitarian setting;
- another neutral representation of the issue.

Do not request:

- humiliating images;
- insulting images;
- defamatory images;
- manipulated images;
- graphic suffering;
- images designed to portray a person as guilty.

REGION FIELD

Set region to exactly one of:

Australia
New Zealand
World

Use Australia when the central issue concerns Australia.

Use New Zealand when the central issue concerns New Zealand.

Use World for other international issues.

CATEGORY FIELD

Use the most suitable current category from:

australia
new-zealand
world
social-issues
small-business
trade-logistics
community
sports
entertainment

Use australia when the central issue is Australian.
Use new-zealand when the central issue is New Zealand.
Use world for major international issues that do not fit a more specific topic category.
Use social-issues for poverty, housing, discrimination, migration, labour exploitation, human rights, crime/justice or similar social-impact issues.
Use small-business for issues centred on small firms, employment or entrepreneurship.
Use trade-logistics only when customs, freight, ports, shipping, supply chains or international trade are central.
Use community for community organisations, local action or humanitarian/community impact.
Use sports only when sport is genuinely central and the story has a substantial public-interest dimension.
Use entertainment only when entertainment is genuinely central and the story has a substantial public-interest dimension.

Return exactly THREE ranked candidate objects.

Candidate 1 must be your strongest topic.

Candidate 2 must be your second strongest topic.

Candidate 3 is a reserve in case one of the first two cannot be published.

Return only the required JSON.
            `.trim(),

            input: `
RECENT NEWS MATERIAL

${newsMaterial}

RECENT DOWNUNDER VOICES OPINION ARTICLES TO AVOID REPEATING

${previousMaterial}
            `.trim(),

            text: {
              format: {
                type:
                  'json_schema',

                name:
                  'downunder_voices_burning_issue_editorials',

                strict: true,

                schema: {
                  type: 'object',

                  additionalProperties:
                    false,

                  properties: {
                    editorials: {
                      type: 'array',

                      minItems: 3,
                      maxItems: 3,

                      items: {
                        type:
                          'object',

                        additionalProperties:
                          false,

                        properties: {
                          title: {
                            type:
                              'string',
                          },

                          summary: {
                            type:
                              'string',
                          },

                          communityAngle:
                            {
                              type:
                                'string',
                            },

                          category: {
                            type:
                              'string',

                            enum: [
                              'australia',
                              'new-zealand',
                              'world',
                              'social-issues',
                              'small-business',
                              'trade-logistics',
                              'community',
                              'sports',
                              'entertainment',
                            ],
                          },

                          sourceName: {
                            type:
                              'string',
                          },

                          sourceUrl: {
                            type:
                              'string',
                          },

                          imageSearch: {
                            type:
                              'string',
                          },

                          region: {
                            type:
                              'string',

                            enum: [
                              'Australia',
                              'New Zealand',
                              'World',
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
                          'region',
                        ],
                      },
                    },
                  },

                  required: [
                    'editorials',
                  ],
                },
              },
            },

            max_output_tokens:
              6000,
          }),

        signal:
          AbortSignal.timeout(
            90000,
          ),

        cache: 'no-store',
      },
    )

  if (!response.ok) {
    const errorText =
      await response.text()

    throw new Error(
      `OpenAI editorial generator failed with ${response.status}: ${errorText}`,
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
      'OpenAI returned no editorial content.',
    )
  }

  const parsed =
    JSON.parse(rawText) as {
      editorials?: GeneratedEditorial[]
    }

  if (
    !Array.isArray(
      parsed.editorials,
    ) ||
    parsed.editorials.length !==
      3
  ) {
    throw new Error(
      'OpenAI did not return exactly three editorial candidates.',
    )
  }

  const validSourceUrls =
    new Set(
      newsStories.map(
        (story) =>
          story.source_url.trim(),
      ),
    )

  const sourceByUrl =
    new Map(
      newsStories.map(
        (story) => [
          story.source_url.trim(),
          story,
        ],
      ),
    )

  return parsed.editorials
    .map(
      (
        editorial,
      ): GeneratedEditorial | null => {
        const title =
          normaliseText(
            editorial.title,
          )

        const summary =
          cleanEditorial(
            editorial.summary,
          )

        const sourceUrl =
          editorial.sourceUrl
            .trim()

        if (
          !title ||
          !summary ||
          !sourceUrl ||
          !validSourceUrls.has(
            sourceUrl,
          )
        ) {
          return null
        }

        const sourceStory =
          sourceByUrl.get(
            sourceUrl,
          )

        if (!sourceStory) {
          return null
        }

        const category =
          normaliseCategorySlug(
            validCategory(
              editorial.category,
            )
              ? editorial.category
              : sourceStory.category,
          )

        const region:
          EditorialRegion =
          editorial.region ===
            'Australia' ||
          editorial.region ===
            'New Zealand'
            ? editorial.region
            : 'World'

        return {
          title:
            title.slice(
              0,
              220,
            ),

          summary:
            summary.slice(
              0,
              9000,
            ),

          communityAngle:
            normaliseText(
              editorial.communityAngle,
            ).slice(
              0,
              1200,
            ),

          category,

          sourceName:
            normaliseText(
              sourceStory.source_name ||
                editorial.sourceName ||
                'Downunder Voices Editorial',
            ).slice(
              0,
              160,
            ),

          sourceUrl:
            sourceStory.source_url,

          imageSearch:
            normaliseText(
              editorial.imageSearch,
            ).slice(
              0,
              160,
            ),

          region,
        }
      },
    )
    .filter(
      (
        editorial,
      ): editorial is GeneratedEditorial =>
        editorial !== null,
    )
}

function wordsForDuplicateCheck(
  value: string,
): string[] {
  const ignored =
    new Set([
      'about',
      'after',
      'again',
      'against',
      'australia',
      'australian',
      'australians',
      'could',
      'from',
      'have',
      'into',
      'more',
      'new',
      'zealand',
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
      'world',
      'needs',
      'need',
      'must',
    ])

  return normaliseText(
    value,
  )
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

function topicSimilarity(
  first: string,
  second: string,
): number {
  const firstWords =
    new Set(
      wordsForDuplicateCheck(
        first,
      ),
    )

  const secondWords =
    new Set(
      wordsForDuplicateCheck(
        second,
      ),
    )

  if (
    firstWords.size === 0 ||
    secondWords.size === 0
  ) {
    return 0
  }

  let overlap = 0

  for (
    const word of firstWords
  ) {
    if (
      secondWords.has(word)
    ) {
      overlap += 1
    }
  }

  const smallerSize =
    Math.min(
      firstWords.size,
      secondWords.size,
    )

  if (smallerSize === 0) {
    return 0
  }

  return (
    overlap /
    smallerSize
  )
}

function looksLikeDuplicateTopic(
  title: string,
  previousEditorials: RecentStory[],
): boolean {
  return previousEditorials.some(
    (previous) =>
      topicSimilarity(
        title,
        previous.title,
      ) >= 0.65,
  )
}

function duplicatesCreatedTopic(
  title: string,
  createdTitles: string[],
): boolean {
  return createdTitles.some(
    (createdTitle) =>
      topicSimilarity(
        title,
        createdTitle,
      ) >= 0.6,
  )
}

async function exactTitleExists(
  title: string,
): Promise<boolean> {
  const existing =
    await dbRequest<
      Array<{
        id: string
      }>
    >(
      'stories',
      {
        query:
          `?select=id&title=eq.${encodeURIComponent(
            title,
          )}&limit=1`,
      },
    )

  return (
    existing.length > 0
  )
}

async function publishEditorial(
  editorial: GeneratedEditorial,
  previousEditorials: RecentStory[],
  createdTitles: string[],
  index: number,
): Promise<boolean> {
  if (
    looksLikeDuplicateTopic(
      editorial.title,
      previousEditorials,
    )
  ) {
    console.log(
      `Skipping similar recent Opinion topic: ${editorial.title}`,
    )

    return false
  }

  if (
    duplicatesCreatedTopic(
      editorial.title,
      createdTitles,
    )
  ) {
    console.log(
      `Skipping similar Opinion candidate from this run: ${editorial.title}`,
    )

    return false
  }

  if (
    await exactTitleExists(
      editorial.title,
    )
  ) {
    console.log(
      `Skipping duplicate Opinion headline: ${editorial.title}`,
    )

    return false
  }

  const imageUrl =
    (await findWikimediaImage(
      editorial.imageSearch,
    )) ||
    DEFAULT_EDITORIAL_IMAGE

  await dbRequest(
    'stories',
    {
      method: 'POST',

      body: {
        slug:
          uniqueSlug(
            editorial.title,
            `${editorial.sourceUrl}-${editorial.region}-${Date.now()}-${index}`,
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
    },
  )

  console.log(
    `Published ${editorial.region} automated Opinion: ${editorial.title}`,
  )

  return true
}

export async function runEditorialGenerator(): Promise<EditorialGenerationResult> {
  if (
    !isDatabaseConfigured()
  ) {
    throw new Error(
      'Database is not configured.',
    )
  }

  const recentStories =
    await dbRequest<
      RecentStory[]
    >(
      'stories',
      {
        query:
          '?select=id,title,summary,category,source_name,source_url,image_url,import_method,published_at&status=eq.published&order=published_at.desc&limit=160',
      },
    )

  const previousEditorials =
    recentStories
      .filter(
        (story) =>
          story.import_method ===
          'automated-editorial',
      )
      .slice(
        0,
        40,
      )

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

  if (
    newsStories.length < 4
  ) {
    throw new Error(
      'Not enough recent published news stories to create automated Opinion articles.',
    )
  }

  const rankedStories =
    rankNewsStories(
      newsStories,
    ).slice(
      0,
      60,
    )

  const australiaCount =
    rankedStories.filter(
      (story) =>
        detectRegion(
          story,
        ) === 'Australia',
    ).length

  const newZealandCount =
    rankedStories.filter(
      (story) =>
        detectRegion(
          story,
        ) === 'New Zealand',
    ).length

  const worldCount =
    rankedStories.filter(
      (story) =>
        detectRegion(
          story,
        ) === 'World',
    ).length

  console.log(
    `Opinion candidates: Australia=${australiaCount}, New Zealand=${newZealandCount}, World=${worldCount}`,
  )

  const generatedEditorials =
    await generateEditorialCandidates(
      rankedStories,
      previousEditorials,
    )

  if (
    generatedEditorials.length <
    2
  ) {
    throw new Error(
      'The editorial generator did not return at least two valid Opinion candidates.',
    )
  }

  const createdTitles:
    string[] = []

  for (
    let index = 0;
    index <
      generatedEditorials.length;
    index += 1
  ) {
    if (
      createdTitles.length >= 2
    ) {
      break
    }

    const editorial =
      generatedEditorials[
        index
      ]

    const created =
      await publishEditorial(
        editorial,
        previousEditorials,
        createdTitles,
        index,
      )

    if (created) {
      createdTitles.push(
        editorial.title,
      )
    }
  }

  if (
    createdTitles.length < 2
  ) {
    console.warn(
      `Only ${createdTitles.length} automated Opinion article(s) were published because remaining candidates were duplicates or invalid.`,
    )
  }

  return {
    created:
      createdTitles.length,

    titles:
      createdTitles,
  }
}
