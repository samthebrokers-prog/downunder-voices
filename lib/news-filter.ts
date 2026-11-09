const BLOCKED_TERMS = [
  'earnings call',
  'earnings report',
  'quarterly earnings',
  'quarterly results',
  'q1 earnings',
  'q2 earnings',
  'q3 earnings',
  'q4 earnings',
  'stock price',
  'share price',
  'stock market today',
  'price target',
  'analyst rating',
  'buy this stock',
  'sell this stock',
  'dividend',
  'dividends',
  'nasdaq',
  'nyse',
  'sec filing',
  'securities filing',
  'insider sold',
  'insider sale',
  'board member sold',
  'equity stake',
  'investor relations',
  'marketbeat',
  'motley fool',
  'zacks',
  'benzinga',
  'seeking alpha',
  'moby summary',
  'crypto prediction',
  'bitcoin price prediction',
  'ethereum price prediction',
]

// Headlines that are really instructions to a writer or an AI (they slip
// through some feeds by mistake), e.g. "Examine the assignment and publish
// the post on container-news.com". Never show these as news.
const JUNK_TITLE_PATTERNS = [
  /\b(examine|complete|read|review|check) the (assignment|instructions?)\b/i,
  /\bpublish (the|this|a) (post|article)\b/i,
  /\b(write|create|draft) (an?|the) (article|post|blog|press release)\b/i,
  /\bignore (all |the )?(previous|prior|above) instructions\b/i,
  /\b(as an ai|language model|your task is|assignment:|instructions?:)\b/i,
  /\blorem ipsum\b/i,
]

export function isJunkTitle(title: string): boolean {
  return JUNK_TITLE_PATTERNS.some((p) => p.test(title || ''))
}

const BLOCKED_SOURCE_PATTERNS = [
  'finance.yahoo.com/news/rssindex',
]

export function shouldImportStory(
  title: string,
  description: string,
  sourceName = '',
  sourceUrl = '',
): boolean {
  if (isJunkTitle(title)) return false

  const text = `${title} ${description}`.toLowerCase()

  const sourceText =
    `${sourceName} ${sourceUrl}`.toLowerCase()

  if (
    BLOCKED_TERMS.some((term) =>
      text.includes(term),
    )
  ) {
    return false
  }

  if (
    BLOCKED_SOURCE_PATTERNS.some((pattern) =>
      sourceText.includes(pattern),
    )
  ) {
    return false
  }

  return true
}
