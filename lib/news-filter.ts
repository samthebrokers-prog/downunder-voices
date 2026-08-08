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

const BLOCKED_SOURCE_PATTERNS = [
  'finance.yahoo.com/news/rssindex',
]

export function shouldImportStory(
  title: string,
  description: string,
  sourceName = '',
  sourceUrl = '',
): boolean {
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
