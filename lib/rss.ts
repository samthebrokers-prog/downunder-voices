export function classifyCategory(
  title: string,
  description: string,
  fallback: CategorySlug,
): CategorySlug {
  const cleanTitle = title.toLowerCase()
  const haystack = `${title} ${description}`.toLowerCase()

  /*
   * Check strong topic categories first.
   * The headline receives priority because descriptions often contain
   * unrelated source wording, navigation text or background information.
   */

  const sportsRule =
    /\b(sport|sports|rugby|cricket|football|soccer|netball|nrl|afl|league|olympic|olympics|tennis|golf|basketball|championship|tournament|match|coach|player|team)\b/i

  const politicsRule =
    /\b(government|parliament|prime minister|premier|minister|mp|senator|election|electoral|coalition|opposition|cabinet|policy|political|politics|legislation|bill|referendum|mayor|councillor)\b/i

  const businessRule =
    /\b(business|economy|economic|company|companies|corporate|market|markets|bank|banking|interest rate|inflation|trade|investment|investor|shares|stock market|asx|nzx|profit|revenue|retail|industry|employment|unemployment)\b/i

  const communityRule =
    /\b(community group|volunteer|volunteers|charity|charitable|fundraiser|fundraising|school|schools|student|students|local event|community event|neighbourhood|non-profit|not-for-profit)\b/i

  /*
   * Strong headline matches take priority.
   */

  if (sportsRule.test(cleanTitle)) {
    return 'sports'
  }

  if (politicsRule.test(cleanTitle)) {
    return 'politics'
  }

  if (businessRule.test(cleanTitle)) {
    return 'business'
  }

  if (communityRule.test(cleanTitle)) {
    return 'community'
  }

  /*
   * Check geographic categories.
   * Use specific country, city and regional names rather than broad,
   * ambiguous words.
   */

  const australiaRule =
    /\b(australia|australian|new south wales|queensland|victoria|western australia|south australia|tasmania|northern territory|act|sydney|melbourne|brisbane|perth|adelaide|canberra|darwin|hobart|gold coast)\b/i

  const nzPacificRule =
    /\b(new zealand|aotearoa|new zealander|kiwi|auckland|wellington|christchurch|hamilton|tauranga|dunedin|rotorua|palmerston north|napier|nelson|fiji|fijian|tonga|tongan|samoa|samoan|vanuatu|solomon islands|papua new guinea|cook islands|niue|kiribati|tuvalu|new caledonia)\b/i

  if (australiaRule.test(cleanTitle)) {
    return 'australia'
  }

  if (nzPacificRule.test(cleanTitle)) {
    return 'nz-pacific'
  }

  /*
   * If the headline was unclear, inspect the full summary.
   */

  if (sportsRule.test(haystack)) {
    return 'sports'
  }

  if (politicsRule.test(haystack)) {
    return 'politics'
  }

  if (businessRule.test(haystack)) {
    return 'business'
  }

  if (australiaRule.test(haystack)) {
    return 'australia'
  }

  if (nzPacificRule.test(haystack)) {
    return 'nz-pacific'
  }

  if (communityRule.test(haystack)) {
    return 'community'
  }

  return fallback
}
