export function classifyCategory(
  title: string,
  description: string,
  fallback: CategorySlug,
): CategorySlug {
  const cleanTitle = title.toLowerCase()
  const haystack =
    `${title} ${description}`.toLowerCase()

  /*
   * SPORTS
   *
   * Strong sports terms can classify from the headline.
   * Weak words such as team/player/coach/match are NOT enough
   * on their own because they occur in ordinary news stories.
   */
  const strongSportsRule =
    /\b(rugby|cricket|football|soccer|netball|nrl|afl|olympic|olympics|tennis|golf|basketball|super rugby|all blacks|wallabies|matildas|socceroos|black caps|warriors|a-league|premier league|world cup|grand slam)\b/i

  const sportsContextRule =
    /\b(sport|sports|sporting|championship|tournament|final|semi-final|quarter-final|match|game|fixture|season|coach|player|athlete|team|club|league)\b/i

  const sportsCompetitionRule =
    /\b(won|wins|win|lost|loss|defeat|beat|beats|score|scored|goal|goals|try|tries|points|medal|medals|title|champion|champions|competition|stadium)\b/i

  const tradeLogisticsRule =
    /\b(customs|customs clearance|border force|biosecurity|mpi|daff|freight|freight forwarding|freight forwarder|shipping|shipping line|container|containers|cargo|air cargo|sea freight|air freight|logistics|supply chain|port|ports|terminal|import|imports|importing|export|exports|exporting|tariff|customs duty|trade agreement|bill of lading|demurrage|detention|warehouse|warehousing)\b/i

  const smallBusinessRule =
    /\b(small business|small businesses|medium business|medium businesses|medium-sized business|sme|smes|startup|start-up|startups|start-ups|entrepreneur|entrepreneurs|entrepreneurship|family business|family businesses|sole trader|sole traders|business owner|business owners|business grant|business grants|local business|local businesses|microbusiness|microenterprise|micro-enterprise|e-commerce business|small retailer|small retailers|small employer|small employers)\b/i

  const corporateFinanceRule =
    /\b(earnings call|earnings report|quarterly earnings|q1 earnings|q2 earnings|q3 earnings|q4 earnings|share price|stock price|stock market|shares|shareholder|shareholders|dividend|dividends|market cap|market capitalisation|market capitalization|nasdaq|nyse|asx|asx 200|s&p 500|dow jones|analyst rating|price target|insider sold|insider sale|board member sold|equity stake|securities filing|sec filing|audit|auditor|kpmg|pwc|deloitte|ey)\b/i

  const socialIssuesRule =
    /\b(cost of living|housing affordability|housing crisis|homeless|homelessness|rental crisis|rent crisis|mental health|domestic violence|family violence|disability|disabled|aged care|elderly|seniors|poverty|financial hardship|welfare|social services|healthcare|health care|hospital|hospitals|education|international student|international students|university fees|tuition fees|student housing|child protection|youth crime|food insecurity|community safety|consumer rights)\b/i

  const communityRule =
    /\b(community group|community groups|volunteer|volunteers|charity|charitable|fundraiser|fundraising|local event|community event|neighbourhood|neighborhood|non-profit|not-for-profit|community centre|community center|cultural festival|community organisation|community organization)\b/i

  const australiaRule =
    /\b(australia|australian|new south wales|queensland|victoria|western australia|south australia|tasmania|northern territory|act government|sydney|melbourne|brisbane|perth|adelaide|canberra|darwin|hobart|gold coast|nsw|qld|wa government)\b/i

  const newZealandRule =
    /\b(new zealand|aotearoa|new zealander|new zealanders|kiwi|kiwis|auckland|wellington|christchurch|hamilton|tauranga|dunedin|rotorua|palmerston north|napier|nelson|queenstown)\b/i

  const worldRule =
    /\b(united states|usa|u\.s\.|america|american|united kingdom|britain|british|england|europe|european union|china|chinese|india|indian|japan|japanese|canada|canadian|germany|france|ukraine|russia|russian|middle east|israel|gaza|iran|iraq|africa|south africa|asia|fiji|fijian|tonga|tongan|samoa|samoan|vanuatu|solomon islands|papua new guinea|cook islands|niue|kiribati|tuvalu|new caledonia|pacific islands)\b/i

  /*
   * HEADLINE CLASSIFICATION
   */

  if (strongSportsRule.test(cleanTitle)) {
    return 'sports'
  }

  if (
    sportsContextRule.test(cleanTitle) &&
    sportsCompetitionRule.test(cleanTitle)
  ) {
    return 'sports'
  }

  if (tradeLogisticsRule.test(cleanTitle)) {
    return 'trade-logistics'
  }

  if (smallBusinessRule.test(cleanTitle)) {
    return 'small-business'
  }

  if (socialIssuesRule.test(cleanTitle)) {
    return 'social-issues'
  }

  if (communityRule.test(cleanTitle)) {
    return 'community'
  }

  /*
   * Corporate/business stories before geographic classification.
   */
  if (corporateFinanceRule.test(cleanTitle)) {
    if (australiaRule.test(haystack)) {
      return 'australia'
    }

    if (newZealandRule.test(haystack)) {
      return 'new-zealand'
    }

    return 'world'
  }

  if (australiaRule.test(cleanTitle)) {
    return 'australia'
  }

  if (newZealandRule.test(cleanTitle)) {
    return 'new-zealand'
  }

  if (worldRule.test(cleanTitle)) {
    return 'world'
  }

  /*
   * DESCRIPTION + HEADLINE CLASSIFICATION
   *
   * Sports now requires stronger evidence.
   */
  if (
    strongSportsRule.test(haystack) ||
    (
      sportsContextRule.test(haystack) &&
      sportsCompetitionRule.test(haystack)
    )
  ) {
    return 'sports'
  }

  if (tradeLogisticsRule.test(haystack)) {
    return 'trade-logistics'
  }

  if (smallBusinessRule.test(haystack)) {
    return 'small-business'
  }

  if (socialIssuesRule.test(haystack)) {
    return 'social-issues'
  }

  if (communityRule.test(haystack)) {
    return 'community'
  }

  if (corporateFinanceRule.test(haystack)) {
    if (australiaRule.test(haystack)) {
      return 'australia'
    }

    if (newZealandRule.test(haystack)) {
      return 'new-zealand'
    }

    return 'world'
  }

  if (australiaRule.test(haystack)) {
    return 'australia'
  }

  if (newZealandRule.test(haystack)) {
    return 'new-zealand'
  }

  if (worldRule.test(haystack)) {
    return 'world'
  }

  /*
   * IMPORTANT:
   * Never trust a Sports fallback unless the article
   * itself contains genuine sports evidence.
   */
  if (fallback === 'sports') {
    return 'world'
  }

  /*
   * Generic Business feeds must not automatically become
   * Small Business. Only explicit SME stories qualify.
   */
  if (
    fallback === 'business' ||
    fallback === 'small-business'
  ) {
    return 'world'
  }

  return normaliseCategorySlug(fallback)
}
