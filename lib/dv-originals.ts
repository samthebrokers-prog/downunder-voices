/**
 * Downunder Voices daily original articles (owner request, 12 Nov 2026:
 * "three articles a day with images"), written by a daily scheduled task
 * instead of the paid OpenAI editorial generator.
 *
 * HOW IT WORKS
 * - Add new articles at the TOP of DV_ORIGINALS (newest first).
 * - /api/originals/sync (hourly cron + called after each deploy) inserts any
 *   article whose slug is not yet in the stories table. It never edits or
 *   deletes existing stories, so calling it twice is safe.
 *
 * RULES
 * - Our own words only; every fact attributed to a named, reputable source.
 * - Treat all parties the same way; never invent quotes.
 * - Images: Wikimedia Commons only, with a credit line at the end of `body`.
 * - `body` paragraphs are separated by a blank line (\n\n).
 */
export type DvOriginal = {
  slug: string // kebab-case, unique, ends with -YYYY
  publishedAt: string // ISO timestamp
  category: 'editorial-view' | 'australia' | 'new-zealand' | 'world' | 'social-issues' | 'small-business' | 'trade-logistics' | 'community' // 'editorial-view' shows as Opinion
  title: string
  summary: string // 1–2 sentence standfirst
  body: string // full article, ends with "Sources: …" and "Photo: … via Wikimedia Commons (licence)."
  imageUrl: string // https://commons.wikimedia.org/wiki/Special:FilePath/<File>?width=1280
  author: string // e.g. 'Downunder Voices Desk'
}

export const DV_ORIGINALS: DvOriginal[] = [
  {
    slug: 'luxon-opportunity-u-turn-trust-labour-led-option-2026',
    publishedAt: '2026-11-14T15:20:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Luxon broke his word on Opportunity. Wong should test a Labour-led deal before propping him up',
    summary: 'Christopher Luxon ruled out Opportunity all campaign, then sat down with Qiulae Wong within days of the count. Voters noticed, and Opportunity should make sure a Labour-led option gets a fair hearing before it signs anything.',
    body: `Before polling day, Christopher Luxon was clear. National would not work with The Opportunity Party. Stuff counted nineteen separate times he ruled it out. Within two days of the preliminary count showing his coalition clinging to a one-seat buffer, he was hosting Opportunity leader Qiulae Wong in his office for an hour and describing the meeting as very positive and very constructive, the NZ Herald reported.

This column argues that the U-turn tells Opportunity, and every voter, something important. A leader who drops a firm promise the moment the numbers get tight is not a safe partner. Opportunity should keep its bottom lines, wait for the special votes, and give a Labour-led government with the Greens a genuine chance before it hands Mr Luxon a second term.

Voters noticed

The public reaction has been sharp. A Stuff "Pulse of the Nation" survey of 533 people, reported by Isaac Davison on 14 November, found 45 per cent said the U-turn made them less likely to trust Mr Luxon to keep his word. Only 8 per cent said it made them more likely. Stuff also reported claims that Mr Luxon could have faced another leadership challenge from his own caucus had he refused to talk to Opportunity.

That is the man asking Opportunity to keep him in power: a leader who has already faced two confidence votes among his own MPs this year, according to the Associated Press, and whose promise on this very question lasted barely a weekend.

The mandate is thin

National's claim to govern rests on being the largest party in Parliament. But Labour narrowly won the party vote on election night, 29.36 per cent to National's 29.21 per cent, according to the Electoral Commission's preliminary count. National ended up with more seats because its electorate wins created a record overhang.

The Post's Henry Cooke reported that the three right-bloc parties are only about 17,000 party votes ahead of the rest of Parliament. Three years ago the gap was about 256,000. That is not a ringing endorsement of the outgoing government. It is a country split almost down the middle, with roughly 399,000 special votes still to be counted, according to interest.co.nz. Specials have usually helped the left by a seat or two.

Labour and the Greens did not need a U-turn

The contrast with the other side is striking. Labour and the Greens were open to working with Opportunity before a single vote was cast, 1News reported on 4 November. Since the election, Chris Hipkins and Greens co-leader Chlöe Swarbrick both reached out to Ms Wong, and Ms Swarbrick caught up with her over a beer. The Spinoff observed that Mr Hipkins is far more eager than his National counterpart to form a government with Opportunity, and more prepared to compromise in talks.

Mr Hipkins met Ms Wong for an hour on 10 November. He described it as a chance to understand each other's priorities. That is how a partnership should start: with respect, not a reluctant phone call two days late.

There is also the question of who Opportunity represents. The Herald's Thomas Coughlan has pointed out that Opportunity's voters are concentrated in urban Wellington seats that elected Labour or Green MPs. Many of those voters chose Opportunity as a fresh, evidence-based voice, not as a route to keeping ACT and New Zealand First in cabinet.

What Opportunity should do

Ms Wong has said Opportunity will talk to National first and turn to Labour if those talks stall, 1News reported. She has also said her five bottom lines are non-negotiable. Holding firm on them is right. But "National first" should not mean "National only". On issues such as ending bottom trawling, a cleaner tax system and evidence-based policy, Opportunity has more in common with Labour and the Greens than with ACT, or with New Zealand First, which ruled Opportunity out during the campaign.

The best outcome for New Zealand is a stable government that reflects the full count. If the specials move even one or two seats, a Labour-led government with the Greens and Opportunity would be the natural fit, and Opportunity should be ready for it.

The other side

Mr Luxon's supporters make a fair point: on the provisional numbers National, ACT and NZ First already hold 67 of 131 seats, one more than needed, and Mr Luxon says he does not need Opportunity's support at all. National is the largest party in Parliament. The Herald's Coughlan has also argued that any left-leaning deal relying on Te Pāti Māori would be very risky, which is why many commentators expect Opportunity to lean right.

Those arguments deserve a hearing. But trust is the currency of any coalition, and on that measure the outgoing Prime Minister has started these talks in deficit. Opportunity should keep every door open until 27 November, and walk through the one that leads to a fairer, more honest government.

Sources: NZ Herald, 10 November 2026; Stuff (Isaac Davison), 14 November 2026; The Post (Henry Cooke), via The Democracy Project briefing, 14 November 2026; NZ Herald (Thomas Coughlan), via The Democracy Project briefing, 14 November 2026; 1News, 4 and 10 November 2026; The Spinoff, 10 November 2026; interest.co.nz, 9 November 2026; Associated Press, 8 November 2026; NZ Electoral Commission preliminary results.

Photo: Bowen House, the Beehive and Parliament House, Wellington, by Midnighttonight via Wikimedia Commons (CC BY-SA 3.0).`,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-election-one-week-on-what-happens-before-27-november-2026',
    publishedAt: '2026-11-14T15:10:00.000Z',
    category: 'new-zealand',
    title: 'NZ election one week on: where the numbers stand and what happens before 27 November',
    summary: 'A week after polling day New Zealand still has no clear winner. Here is where the seats sit, why special votes matter, and how a government could be formed.',
    body: `A week after New Zealanders voted on 7 November, nobody can yet say who will govern. Christopher Luxon's National-led government stays on as a caretaker while the Electoral Commission counts the last votes. Here is a plain guide to where things stand.

The numbers on election night

On the preliminary count, National has 42 seats, Labour 36, the Greens 16, ACT 13, New Zealand First 12, The Opportunity Party 7 and Te Pāti Māori 5. That makes a Parliament of 131 seats, so 66 are needed to govern.

National, ACT and New Zealand First together have 67, just one more than they need. Labour, the Greens and Te Pāti Māori have 57. Opportunity's seven MPs sit in between.

On the party vote, Labour finished narrowly ahead of National, 29.36 per cent to 29.21 per cent. National still has more seats because it won many electorates, which created 11 overhang seats, an unusually high number.

Why special votes matter

About 399,000 special votes, roughly 14 per cent of the total, are still being checked and counted, according to interest.co.nz. Special votes include ballots from New Zealanders overseas and people who voted outside their home electorate. In past elections they have usually helped the left by one or two seats.

Several electorates are also very close. Wairarapa was separated by only 139 votes on election night and Mt Roskill by 252. A change in either could shift the overall numbers.

The official result is due on Friday 27 November.

Who is talking to whom

National leader Christopher Luxon ruled out working with Opportunity throughout the campaign, but met Opportunity leader Qiulae Wong for an hour on 9 November. Labour leader Chris Hipkins met her the following day. Wong has said Opportunity will talk to National first and turn to Labour if those talks stall, and that its five bottom lines are not negotiable, 1News and the NZ Herald reported.

Luxon has said formal coalition talks will start once the official result is declared, the Herald reported. He maintains National, ACT and New Zealand First can govern on the current numbers. Labour and the Greens are waiting for the final count, and have said they are willing to work with Opportunity.

Three possible outcomes

If the special votes barely change things, National, ACT and New Zealand First keep a narrow majority and can govern on their own, though with almost no room for error.

If the specials take a seat or two from the right, the coalition loses its majority and Opportunity's support becomes essential for either side. Opportunity would then effectively decide who governs.

If no stable government can be formed, the Associated Press notes New Zealand could face a fresh election. Every party leader has said they want to avoid that.

A debate about the system itself

The result has started a wider argument about MMP. A Stuff survey of 533 people, published on 14 November, found only 21 per cent want the system kept exactly as it is, while about a third would like a new system. The Post has estimated that each overhang MP costs taxpayers about $2.1 million over a three-year term. Labour's Chris Hipkins and the Greens' Chlöe Swarbrick have both said they are open to reforms to stop large overhangs in future.

Downunder Voices will keep its NZ Election 2026 Live page updated until a government is formed.

Sources: NZ Electoral Commission preliminary results; interest.co.nz, 9 November 2026; 1News, 4 and 10 November 2026; NZ Herald, 9 and 10 November 2026; Associated Press, 8 November 2026; Stuff, 14 November 2026; The Post, via The Democracy Project briefing, 14 November 2026.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/nz-election-one-week-on-what-happens-before-27-november-2026',
    author: 'Downunder Voices Desk',
  },
  {
    slug: 'victoria-election-two-weeks-out-one-nation-preferences-2026',
    publishedAt: '2026-11-14T15:00:00.000Z',
    category: 'australia',
    title: 'Victoria votes in two weeks: Labor trails as the Coalition and One Nation swap preferences',
    summary: 'Early voting opens on Wednesday 18 November. Polls put Jess Wilson\'s Coalition well ahead, and the biggest question for voters may be how much influence One Nation would have in the next government.',
    body: `Victorians go to the polls on Saturday 28 November to elect all 88 members of the Legislative Assembly and all 40 members of the Legislative Council. Early voting opens this Wednesday, 18 November, and runs until Friday 27 November, from 9am to 6pm every day except Sunday 22 November, according to the Victorian Electoral Commission. Nobody needs a reason to vote early, and on election day voters can use any voting centre in the state.

Where the polls stand

Labor goes into the final fortnight in serious trouble. A Lighthouse tracking poll for News Corp, surveying 1,351 voters and reported on 13 November, put the Liberal-National Coalition on 32 per cent, One Nation on 23 per cent, Labor on 21 per cent and the Greens on 14 per cent. Opposition Leader Jess Wilson had a net favourability of plus 17, compared with minus 19 for Premier Ben Carroll. The same report said Mr Carroll is at risk of losing his own seat of Niddrie in Melbourne's north-west.

Other polls tell a similar story. A DemosAU survey taken from 30 October to 5 November had Labor on just 18 per cent and the Coalition ahead 56 to 44 after preferences.

Mr Carroll replaced Jacinta Allan as premier on 28 July, four months before the election, promising a new direction after 11 years of Labor government. So far there has been no poll bounce. The ABC reported on 1 November that some Labor MPs privately concede they cannot win.

The preference question

The biggest issue in the final fortnight may be preferences. The Coalition and One Nation have agreed to put each other ahead of Labor on how-to-vote cards in key seats, NCA NewsWire reported on 12 November, and AAP reported the Coalition will largely rank One Nation above Labor across the state. Ms Wilson has ruled out a formal deal with One Nation and has said the Coalition will put Labor, the Greens and the Victorian Socialists last.

Labor has gone the other way. Labor's Anthony Carbines told reporters Labor would put One Nation at the bottom of its how-to-vote cards, calling it a principled decision. Labor's campaign has warned that a vote for the Coalition risks a Liberal-One Nation government, a line Prime Minister Anthony Albanese has also used.

Polls suggest the Coalition could win a majority in its own right. But in a close finish, One Nation, led in Victoria by Warren Pickering, could hold real bargaining power in the upper house or in a hung lower house. Voters are entitled to a straight answer from Ms Wilson before 28 November about what role, if any, One Nation would have in a government she leads.

What each side is saying

Mr Carroll argues that only Labor can stop a Liberal-One Nation government, and has offered to debate Ms Wilson only if One Nation's leader is also on stage. Labor has pitched policies at health workers, including tougher action against violent patients.

Coalition supporters argue that 11 years of Labor has left Victoria with high debt, cost blowouts on major projects and rising crime, and that change is overdue. They point out that she has refused a formal deal with One Nation, and say preference decisions are a normal part of campaigning under Victoria's voting system.

Whoever wins, this is shaping up as one of the most fragmented elections in Victoria's history, with four parties all polling well into double figures. With up to 60 per cent of voters expected to vote early, according to the VEC, much of the result may be locked in well before election night.

Sources: Victorian Electoral Commission; Parliament of Victoria; NCA NewsWire / Yahoo News Australia, 12 November 2026; DemosAU poll, 30 October to 5 November 2026; AAP; ABC News, 1 November 2026.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/victoria-election-two-weeks-out-one-nation-preferences-2026',
    author: 'Downunder Voices Desk',
  },
  {
    slug: 'rnz-deficit-staff-should-not-pay-for-governance-failure-2026',
    publishedAt: '2026-11-13T21:40:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: RNZ\'s $11.8m hole was a failure at the top, and staff and listeners should not pay for it',
    summary: 'RNZ lost $11.8 million last year against a forecast loss of $470,000 and now plans to cut 58 jobs. The people who made the programmes did not cause this, and the next government should protect public broadcasting rather than shrink it further.',
    body: `Public broadcasting in New Zealand has taken a hit it did not need. RNZ has reported a loss of $11.8 million for the year to June, against a forecast loss of just $470,000, and says it will cut 58 roles to recover. That is roughly one in six jobs at the country's public radio and digital news service.

This column argues that the people who put RNZ on air every day are being asked to pay for mistakes made well above their heads, at the end of two years in which the outgoing government steadily squeezed RNZ's funding. A Labour-led government, with the Greens and The Opportunity Party, should fix the governance, protect the newsroom and give RNZ stable funding it can plan around.

What went wrong

The numbers come from RNZ's own annual result, reported by 1News on 9 November. RNZ said its internal financial reporting during the year did not accurately reflect its real position, so neither the board nor management took action in time. It said costs were not cut after a 7% drop in its baseline funding. Around $2 million from land sales was wrongly counted as revenue. Staff costs ran $3.2 million over budget, including $1.4 million in redundancy payments. Other operating costs ran $6.4 million over, including about $1.85 million for moving the Auckland office and $1.7 million for remediation work at the Titahi Bay site.

There is more. According to 1News, the auditor EY, acting for the Auditor-General, found RNZ had set up a $5 million overdraft without ministers' approval when it was only authorised to borrow $3.5 million. RNZ says it drew no more than $2.3 million and the facility is now closed. Its cash fell from $18.8 million to $8.5 million over the year, and it is forecasting a further loss of $7.8 million this year.

The chief financial officer resigned and left on 2 October. Board chair Brent Impey has said there is no suggestion of criminality, and David Seymour, one of RNZ's two shareholding ministers, told TVNZ's Breakfast on 10 November that there was currently no suggestion of fraud. That matters, and it should be said clearly. This looks like a failure of financial control and oversight, not of honesty. Mr Impey summed it up himself: "It's a crisis, but it has to be fixed, and we'll do it."

Experts were blunt. Stephen Walker, a former executive director at Audit New Zealand, said the result showed "a real weakness in forecasting and budgeting", The Spinoff reported on 10 November, and Auckland University's Norman Wong called counting land sales as income a basic error. Mr Walker told RNZ a board should be checking results every month.

Who pays

Now look at who is paying. RNZ says the 58 cuts, made up of 18 roles already announced and 40 new ones, will reach right across the organisation, including news, audio, technical and operations staff as well as senior management. Its workforce would fall from 347 to 289 by the end of March. In August RNZ had already said it would cut 25 to 30 roles, about 10% of staff, because of "a further reduction in our funding this year", with more reductions signalled for the next two years, 1News reported on 14 August.

Unionised RNZ staff have announced protests, according to the Council of Trade Unions' daily news roundup on 13 November. They have every reason to. Reporters, producers and technicians did not set the budget, did not sign off the overdraft and did not book land sales as income. Yet most of the pain of fixing the hole will land on them and on the listeners who rely on what they make.

The squeeze came first

It is also worth remembering how RNZ got so little room to absorb a shock. In Budget 2025 the government cut RNZ's funding by $18 million over four years, Metronews reported in June 2025, with part of the money redirected to regional journalism through other channels. Labour's media spokesperson at the time, Reuben Davidson, called it a "giant step back". Stephen Walker made a similar point from a neutral position: "Virtually every public entity has had their annual budget reduced."

None of that excuses poor reporting inside RNZ. A smaller budget makes accurate forecasting more important, not less. But it does explain why one bad year now threatens one in six jobs. An organisation that has been cut year after year has no cushion left, and the first casualties are the reporters who cover the regions, the courts and the councils that commercial outlets have increasingly left behind.

What should happen next

First, the independent review that the RNZ board has promised must be published in full, so the public can see who knew what and when. Accountability should start at the top. That is the standard the public should expect of every public body, and it should apply here.

Second, the job cuts should be paused until the review is finished. Even Mr Seymour has said there may be room to save some of the 58 roles because the budgeting assumptions were wrong. If the shareholding minister believes that, the board should test it before anyone is made redundant.

Third, the next government should give RNZ multi-year funding it can plan around, tied to clear standards for financial reporting. Public media is part of the infrastructure of a democracy, like courts and libraries. It cannot do its job if every Budget brings a fresh cut and every mistake becomes a reason to shrink it again. A Labour-led government that values trusted, independent news should say so in its first Budget.

Fourth, protect what makes RNZ worth having: regional reporting, te reo Māori and Pacific programming, and free, ad-free news for everyone. Those are exactly the things a struggling commercial media market will not replace.

The government's case

The outgoing government's view deserves a fair hearing. Mr Seymour has called RNZ's finances disastrous for taxpayers, audiences and staff, and said that on the reporting ministers received there was no reason to think anything was wrong. He has argued that the board's audit and risk committee was the body that should have caught the problem. "Clearly, the buck stops somewhere," he said. Ministers have also argued that every public entity has had to find savings, and Media Minister Paul Goldsmith said in 2025 that part of RNZ's funding was redirected to regional newsrooms. Those are reasonable points: boards must own their mistakes, and taxpayers are entitled to tight control of public money.

But accountability for a board is not the same as cutting the newsroom. The people in charge should answer for this. The people who report the news should not lose their jobs because of it.

The bottom line

Victoria University media professor Peter Thompson called the shortfall unprecedented, and he is right. An unprecedented failure deserves a careful, honest response, not a rushed round of redundancies. New Zealanders own RNZ. Whoever forms the next government should make sure it comes out of this crisis better run, properly funded and still on air in every corner of the country.

Sources: 1News, 9 November 2026; 1News, 10 November 2026; The Spinoff (Henry Oliver), 10 November 2026; RNZ (Mary Argue) via Otago Daily Times, 9 November 2026; 1News, 14 August 2026; NZCTU Union News, 13 November 2026; Metronews, 3 June 2025.

Photo: Bowen House, the Beehive and Parliament House, Wellington, by Midnighttonight via Wikimedia Commons (CC BY-SA 3.0).`,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'bottom-trawling-phase-out-healthy-oceans-2026',
    publishedAt: '2026-11-13T21:30:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Start phasing out bottom trawling now and give our seabed a chance to recover',
    summary: 'The Opportunity Party wants a phase-out of bottom trawling to begin straight away, starting with sensitive areas like the Hauraki Gulf. With so little of our ocean protected, the conservation case is strong, and a careful plan can look after fishing exports and port towns too.',
    body: `New Zealand likes to sell itself to the world as clean and green. Under the water, that promise is harder to keep. Bottom trawling, which drags heavy nets across the seafloor, still brings in most of the fish caught in our waters. After this month's election, the question of whether to phase it out has moved from the margins to the negotiating table.

This column backs a phase-out. The Opportunity Party (TOP) has made it one of its five bottom lines, and Labour leader Chris Hipkins has signalled he is open to it. A Labour-led government, working with the Greens and TOP, should make it happen, carefully and with the industry, but starting now.

What is on the table

TOP set out its bottom lines in September. According to 1News on 29 September, one is that the next government must begin phasing out bottom trawling immediately, working with industry, iwi and coastal communities. Party leader Qiulae Wong argued that bottom trawling cannot be squared with healthy oceans. RNZ reported on 8 October that TOP wants an end to the practice in sensitive areas, including the Hauraki Gulf, first, followed by a progressive phase-out elsewhere.

TOP's own policy page says New Zealand has the fifth-largest ocean territory on earth, yet only about 0.5% of it is protected as marine reserve. It wants 30% protected by 2035, cameras on commercial fishing boats and an ecosystem-based approach to quota. It also points out that three companies control about 60% of fishing quota. Those are party figures, but they frame the choice well: this is a public resource, and the public is entitled to a say in how it is managed.

Why it matters now

The provisional results give National, ACT and NZ First 67 seats, with special votes still to be counted and the final result due on 27 November, 1News reported on 10 November. TOP holds seven seats. Ms Wong met Christopher Luxon on 9 November and Mr Hipkins the following day. Whoever governs may need TOP, so its ocean policy is now part of the deal-making.

At a televised leaders' debate before the election, Mr Hipkins answered yes when asked about phasing in a ban, RNZ reported. Since the election he has said his concern is mainly about method. "It all comes down to a question of how," he told The Spinoff on 10 November. That is the right question, and it has good answers: start with the most fragile places, set a clear timetable, fund new gear and training, and back the workers and port towns that depend on fishing.

The other side

The industry's concerns are real and should be stated plainly. Moana New Zealand chief executive Steve Tarrant told RNZ that about 70% of the volume caught in New Zealand comes from bottom trawling, and called a blanket ban irresponsible. Sealord chief executive Doug Paulin described the policy as populist and said no other technique can catch those species economically. Mr Luxon said he was "open to" a phase-in, but stressed the need to balance it against the two billion dollars and 9000 jobs he linked to the practice. Even Greenpeace, RNZ reported, favours a phased, targeted ban on the most damaged areas rather than an immediate nationwide one.

Those points argue for doing this well, not for doing nothing. A phase-out with a timetable gives companies time to change boats and methods. Starting with sensitive places like the Hauraki Gulf protects the areas that matter most while the rest of the plan is worked out.

The bottom line

A seabed scraped bare does not grow back in an election cycle. Protecting it is a long-term investment in fish stocks, in the communities that catch them and in the reputation that sells New Zealand seafood overseas. Labour, the Greens and TOP should agree on a sensible, staged plan and get on with it.

Sources: 1News, 29 September 2026; RNZ (Felix Walton) via Otago Daily Times, 8 October 2026; The Opportunity Party, Healthy Oceans policy (accessed 14 November 2026); 1News, 10 November 2026; The Spinoff (Lyric Waiwiri-Smith), 10 November 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/bottom-trawling-phase-out-healthy-oceans-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-essential-workers-priced-out-of-rentals-2026',
    publishedAt: '2026-11-13T21:20:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: When nurses and cleaners cannot afford to rent, Australia needs far more social housing',
    summary: 'Anglicare\'s latest snapshot found fewer than 1% of rental listings were affordable for cleaners, retail workers and social workers on the full-time minimum wage. The people who keep the country running deserve a secure home, and that means building much more social and affordable housing.',
    body: `Ask almost any Australian town what it needs and the answer is the same: more nurses, more carers, more teachers, more people to clean, cook and serve. Then ask where those workers are supposed to live. A new report suggests that, for many of them, there is no realistic answer.

This column argues that the rental crisis has become a crisis for essential work itself, and that the answer is a much larger, faster build of social and affordable housing, along with a fairer deal for renters.

What the snapshot found

Anglicare Australia's annual Rental Affordability Snapshot looked at 48,776 rental listings across the country and tested them against the full-time minimum wage for 16 essential jobs, the ABC reported on 5 November. Only three of those 16 occupations saw affordability improve on last year. For retail workers, social workers and cleaners, fewer than 1% of listings were affordable. For nursing it was 1.1%, and for teaching 3.3%. In the Northern Territory, the report found no affordable rental at all for a hospitality worker.

The ABC also cited Cotality data showing unit rents up 44.3% over five years and house rents up 36.6%. Anglicare executive director Kasy Chambers said wages had risen by less than half as much, so most of the pay rises have gone straight into rent.

Behind the numbers are people. The ABC reported on 7 November on a 61-year-old disability support worker in Albany, Western Australia, who has moved seven times in 18 months and now splits a rent of $850 a week with a housemate. Anglicare found just one property across WA's Great Southern and South West regions that was within budget for key health and childcare workers. In Karratha, a local mechanic told the ABC that a lack of housing was stopping him from taking on more staff.

The pressure is not easing. A property industry daily brief on 13 November, summarising REA Group research, reported that rent increases have been the steepest since the 1980s, even as home values have slipped from their March peak.

Why this is everyone's problem

When a nurse cannot find a rental near the hospital, the hospital runs short. When a childcare worker cannot afford to live in a regional town, families there lose childcare and parents lose work hours. Housing is not just a private worry for renters; it decides whether communities can keep the services they depend on.

Ms Chambers put the cause plainly: successive governments stopped building and funding housing. The result, as housing advocates have long argued, is a system that rewards owning several properties while leaving the people who staff our hospitals and aged care homes moving from lease to lease.

What should change

First, build social and affordable housing at a scale that matches the problem, with a clear share set aside for essential workers near where they work, especially in the regions. Second, give renters more security, including limits on unfair rent rises and no-grounds evictions, so a worker does not have to move seven times in 18 months. Third, keep reviewing tax settings that tilt the market towards investors rather than people looking for a home to live in. The first of these is exactly what Anglicare is calling for.

The government's case

The federal government says it is acting. A spokesperson for Housing Minister Clare O'Neil told the ABC: "We're building 55,000 social and affordable homes, with more than 8,000 already complete." The minister's office also pointed to below-market rentals for essential workers. That is a real commitment, and it deserves credit.

But Anglicare's snapshot shows how far there is still to go. When fewer than one listing in a hundred is affordable for a cleaner on the minimum wage, the current pace is not enough. Australia's essential workers have kept the country going through fires, floods and a pandemic. The least we owe them is somewhere affordable to live.

Sources: ABC News (Emma Johnson and Amy Rossbach), 5 November 2026; ABC News (Rachel Jennings, Andrew Chounding and Amy Rossbach), 7 November 2026; Property Buzz daily brief, 13 November 2026, summarising REA Group.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-essential-workers-priced-out-of-rentals-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'kaitaia-triboard-mill-northland-jobs-plan-2026',
    publishedAt: '2026-11-12T21:40:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Kaitāia is losing its last mill, and Northland deserves a real plan for its jobs',
    summary: 'Juken says its Triboard Mill will stop operating by mid-March 2027, putting up to 157 jobs at risk in a town that lost its other mill in August. A Labour-led approach would treat wood processing in the Far North as worth fighting for.',
    body: `Kaitāia has been here before, and that is the problem. In August the town lost the Juken Northland Mill. This week the same company told the workers at its second Kaitāia site, the Triboard Mill, that it will stop operating no later than mid-March 2027. For a small Far North town, that is the difference between young families staying or leaving.

This column argues that what happens next should not be left to chance, a buyer's timetable or a caretaker period in Wellington. Northland needs an active plan for wood processing jobs, and the parties best placed to deliver one are Labour, the Greens and The Opportunity Party.

What Juken has announced

The facts are set out in Juken's own statement, reported by 1News on 11 November. Juken New Zealand has put two proposals to staff. Under the first, it would sell the mill's land, buildings and other assets to a prospective buyer. Under the second, if that sale falls through, it would close the mill and keep trying to sell the site. Either way, the company says it will stop running the mill by mid-March 2027, or earlier. Chief executive Yasufumi Tsuchiya was clear that "No binding sale agreement has been reached." Consultation with staff closes on 25 November.

The prospective buyer has said it intends to restart the mill under new ownership. That is welcome, but it is not a guarantee. Wood Central, a timber industry news site, reported on 12 November that the possible sale covers the land, buildings and machinery but not the staff, and that 157 jobs are at risk either way. Workers First Union organiser Marcus Coverdale told the site the union had hoped the offer would include the workforce, and warned that a gap before re-hiring had left a reopened Gisborne mill short of experienced people.

The same report noted that Juken booked a $39.7 million loss for the year to March. B2B News reported on 11 November that, when the Northland Mill closed, 78 workers were affected; 44 left and 19 were redeployed to Triboard.

A pattern, not a one-off

Kaitāia is not an isolated case. Workers First counts the two Juken mills as the seventh and eighth wood processing closures in New Zealand in two years, Wood Central reported. In a June statement the union put the losses at more than 800 wood processing jobs since late 2023. Those are union figures and should be read as such, but nobody seriously disputes the direction. In February 2025 the Greens' regional development spokesperson Scott Willis said job losses at the Kinleith mill in Tokoroa "could have easily been avoided", and called for a Future Workforce Agency to help regions plan ahead.

This is the core of the case. New Zealand grows enormous amounts of timber. Wood Central reported that Northland MP Grant McCallum pointed to about 50,000 hectares of forestry north of Kaitāia alone. Yet more and more of that wood leaves the country as logs, while the mills that add value at home shut their doors.

What was asked for, and what was refused

The most frustrating part of the Kaitāia story is that local leaders tried to get ahead of it. When Juken first moved to close the Northland Mill, local bodies did not simply accept the decision. BioEnergy Times reported on 15 July that the Northland Regional Council, the Far North District Council and the regional development agency Northland NZ sought government funding to modernise the mill and add a plant turning waste and low-grade wood into biomass fuel. Regional council chair Pita Tipene told Wood Central in July: "That model would require investment by the Government."

That investment did not come. BioEnergy Times reported that David Seymour, then acting prime minister, rejected the calls. B2B News reported that in June Prime Minister Christopher Luxon rejected the union's request for intervention, and that Northland NZ's head of investment, Tui Rutherford, had argued "investing right now will generate a good return." The mill closed in August.

Now, with Triboard on the line, the timing could hardly be worse. The general election was held on 7 November, the final count is not due until later this month, and the outgoing government is in caretaker mode. Northland MP Grant McCallum was candid about it, telling Wood Central "we're between governments now, so that will hold things up for a bit." He said he was still working with potential buyers and government colleagues, and that effort deserves credit. But workers facing redundancy cannot wait for coalition talks to finish.

What a Labour-led approach would do differently

Labour's 2026 manifesto promises to "Continue to grow wood processing in New Zealand", to back businesses that make better use of the whole tree, and to develop local transition plans with working people when industries change. Those are the right instincts. Transition planning means a region gets warning, training and new investment before the last shift ends, rather than a redundancy notice and a pamphlet about benefits.

The Greens bring the long-term view: that wood processing, low-carbon building materials and biomass are part of how New Zealand meets its climate goals while keeping jobs in the regions. TOP brings a focus on evidence-based economic policy and on fixing the incentives that make exporting raw logs more attractive than processing them here.

Concretely, the next government should do three things. First, work with any credible buyer of Triboard to keep the experienced workforce together, including with wage support during a restart if that is what it takes. Second, take a fresh look at the biomass and modernisation proposal that Northland's councils put forward, judged on its merits rather than dismissed. Third, set up the kind of regional workforce planning that Labour and the Greens have both proposed, so Kaitāia is the last town to learn about its future from a consultation document.

The government's case

The outgoing government's position deserves a fair hearing. B2B News reported that Resources Minister Shane Jones said Juken never formally approached the government for help, and ministers have argued that taxpayers should not prop up private businesses that their owners have decided are not viable. The union reported in June that the Prime Minister pointed to Ministry of Social Development support for affected families. National went into the election promising to double value-added timber exports by 2034, according to Wood Central, so the goal of more processing is shared across the House. Governments cannot save every business, and that is a fair point.

But a target for 2034 does little for the 157 people at Triboard in March 2027. When a private owner has already decided to leave and local leaders bring a plan with a return attached, saying no is also a choice, and in Kaitāia it has had consequences.

The bottom line

Acting Far North mayor Chicky Rudkin said in June that "news like this will hit hard". It has hit twice now. The people of Kaitāia have done everything asked of them: they turned up to work, they moved mills when they were told to, and their local leaders brought forward a plan. Whoever forms the next government should treat the Triboard decision as a test of whether regional New Zealand still counts. A Labour-led government, working with the Greens and TOP, would have the policies to pass it.

Sources: 1News, 11 November 2026; Wood Central, 12 November 2026; B2B News, 11 November 2026; BioEnergy Times, 15 July 2026; Wood Central, 21 July 2026; 1News (Emma Hildesley), 24 June 2026; Workers First Union statement via Scoop, 27 June 2026; New Zealand Labour Party 2026 manifesto; Green Party of Aotearoa New Zealand, 14 February 2025.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/kaitaia-triboard-mill-northland-jobs-plan-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'warehouse-strike-ai-robots-staff-deserve-a-say-2026',
    publishedAt: '2026-11-12T21:30:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: The Warehouse strike shows why staff need a say before the robots arrive',
    summary: 'More than 300 distribution-centre staff at The Warehouse walked off for 24 hours over AI and automation. The company rejects the union\'s claims, but the dispute shows New Zealand needs clear rules giving staff a voice when new technology changes their work.',
    body: `On Thursday more than 300 people who keep The Warehouse's shelves stocked put down their scanners for a day. Staff at the company's distribution centres in Wiri, Auckland, and Rolleston, near Christchurch, along with Noel Leeming installation drivers, held a 24-hour strike on 12 November, 1News reported. Their main worry was not pay. It was whether robots and artificial intelligence will leave them without a job.

This column argues they have a point, and that it goes well beyond one company. New Zealand needs rules that give working people a real say before new technology reshapes their jobs. That is the approach Labour, the Greens and The Opportunity Party should push for in the next Parliament.

What the union says

In a statement released through Scoop on 11 November, Workers First Union said a large robot is being installed in Auckland for stock picking, that drones have already shrunk the physical inventory team, and that performance monitoring is tracking how long staff spend on bathroom breaks. Organiser Hayley Courtney said staff with long service simply wanted certainty: "They want to know they have a future here."

The union is asking for consultation, retraining and redeployment for anyone affected, and for agreement with the union before any job-cutting technology is introduced. It also says some Noel Leeming drivers are being rostered extra overtime runs without being asked.

What the company says

The Warehouse Group strongly disputes much of this. RNZ reported on 11 November that the group's people officer, Richard Parker, said bathroom use is not tracked, that monitoring is of efficiency through scanning devices and is not AI, and that the stocktake drones have caused no job losses; in fact, he said, three extra temporary roles were created. On the union's more lurid claims about conditions in the distribution centres, Parker said: "This has never happened."

Those are serious denials and readers should weigh them. Neither side has published figures on how many roles the new robot could affect, so nobody outside the company can yet say how big the change will be.

Why this matters beyond The Warehouse

That uncertainty is exactly the problem. RNZ noted that unemployment is at an 11-year high. In that climate, a worker with 15 or 20 years at a distribution centre who sees a robot being installed is not being unreasonable when they ask what it means for them. At the moment, New Zealand law gives them few guarantees beyond a general duty of good faith and whatever their collective agreement says.

The union's request is modest. Courtney told RNZ the union is not trying to stop the robot or AI. Workers are asking to be told early, to be retrained where possible, and to be moved into other roles rather than shown the door. Many good employers already do this. A clear legal floor would make sure all of them do.

What the left offers

Labour's 2026 manifesto commits to working with working people, employers and unions to prepare for how AI will change jobs and skills, and to safeguards where AI is used to make decisions about individuals. Waatea News reported in September that Labour wants productivity gains from AI to be reflected in wages and conditions. Commentary in LawNews in October described the Greens' AI plan as giving people rights to challenge AI-assisted decisions. TOP's evidence-first approach to policy would sit well alongside both.

The other side

Supporters of faster automation argue that New Zealand's productivity has lagged for decades, and that firms must be free to invest in automation to compete and keep prices down for shoppers. The Warehouse says its technology is about efficiency, not surveillance, and has created some roles. Those are fair points: automation can make work safer and businesses stronger.

But productivity gains that are shared with the people doing the work are more durable than gains that come at their expense. A short strike in Wiri and Rolleston is an early warning. The next government should listen to it.

Sources: 1News, 12 November 2026; Workers First Union statement via Scoop, 11 November 2026; RNZ (Sammy Carter), 11 November 2026, as published by the Otago Daily Times; New Zealand Labour Party 2026 manifesto; Waatea News, 11 September 2026; LawNews (Kalev Crossland), 21 October 2026.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/warehouse-strike-ai-robots-staff-deserve-a-say-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'dairy-welfare-code-winter-grazing-shelter-2026',
    publishedAt: '2026-11-12T21:20:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: The new dairy welfare code dropped winter grazing and shelter rules, and they should be put back',
    summary: 'The dairy cattle code issued in September left out proposed standards on intensive winter grazing and shelter after a contested process. The best farmers already do better, and the rules should reflect that.',
    body: `New Zealand sells its dairy products to the world on a promise: grass-fed cows, open pastures and high standards. A new code of welfare for dairy cattle was supposed to back that promise with clear minimum rules. On some important issues it does. On others, the protections that were consulted on simply disappeared. This column argues that the next government, ideally one led by Labour with the Greens and The Opportunity Party, should finish the job.

What the code does

The government announced the new code on 23 September. Acting Agriculture Minister Nicola Grigg said calves must be fed milk or milk replacer at least twice a day for their first two weeks, the minimum body condition score for milking cows will rise, thin cows will need a vet's approval before leaving the farm, and regulations to ban the tethering of dairy cattle will be developed. The code takes effect on 19 April 2027. Those are real improvements and deserve credit.

What was left out

RNZ reported on 30 September that several standards consulted on since 2022 were dropped from the final code. They included rules on intensive winter grazing, standards for transporting cull cows, and a requirement for farms to have a working relationship with a vet. National Animal Welfare Advisory Committee chair Matthew Stone said shade, shelter, calf rearing and pasture management during intensive winter grazing were among the most contested issues.

Winter grazing is the issue many New Zealanders will remember from images of cows standing in deep mud. Shelter and dry ground at calving remain only recommended best practice. SAFE chief executive Debra Ashton put the problem simply, telling RNZ: "how can you enforce good animal welfare when these are just recommendations?"

A process under a cloud

How the code was made matters too. B2B News reported on 12 November that associate agriculture minister Andrew Hoggard, a former Federated Farmers president, sent the draft back to the advisory committee in 2024 with a letter asking for "elevated consideration of economics and practicality". Hoggard was later seen to have a conflict of interest, and Grigg signed off the final code. Newsroom has since reported legal concerns: Animal Law Association president Marcelo Rodriguez Ferrere described the dairy and pig codes as "extremely vulnerable" to court challenge, according to the Democracy Project's summary of that report.

These are legal opinions, not court findings. But a code that may not survive a challenge gives farmers no certainty either.

What should happen next

Labour, the Greens and TOP should commit to revisiting the dropped standards through a clean, transparent process. That means restoring minimum rules on intensive winter grazing and shelter, consulting properly, and making sure no decision-maker has an industry conflict. It would protect animals, and it would protect the reputation that every dairy exporter relies on.

The other side

The outgoing government and farming groups argue the code is practical and workable. Grigg said "it's vital we maintain the confidence of New Zealanders and our overseas markets", and said the industry regards a higher body condition score as good practice. DairyNZ described it as the first major update in more than a decade, and Federated Farmers welcomed the changes, RNZ reported. The advisory committee chair said some proposals were scaled back because they did not meet the legal criteria in the Animal Welfare Act. Many farmers already invest heavily in good welfare and worry about costs piling up in a tough season.

Those concerns are real. But good farmers are already meeting higher standards on shelter and winter grazing. Writing those standards into the rules would reward them and bring everyone up to their level.

Sources: New Zealand Government press release (Hon Nicola Grigg) via Scoop, 23 September 2026; RNZ (Monique Steele), 30 September 2026, as published by the Otago Daily Times and Farmers Weekly; B2B News, 12 November 2026; The Democracy Project (Bryce Edwards), News Briefing, 12 November 2026, summarising Newsroom.

Photo: public-domain photograph via Wikimedia Commons (public domain / CC0), selected by Downunder Voices.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/dairy-welfare-code-winter-grazing-shelter-2026',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-special-votes-case-for-progressive-government-2026',
    publishedAt: '2026-11-11T21:20:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: Every special vote counts, and the case for a Labour-led government has never been stronger',
    summary: 'The preliminary count gives the National-led coalition a one-seat majority, with about 14 per cent of votes still to be counted. A government built around Labour, the Greens and The Opportunity Party would answer the questions voters actually asked.',
    body: `New Zealand is waiting. Five days after polling day, nobody can say for certain who will govern the country, and that uncertainty is itself a verdict. A government that had delivered on its promises would not be clinging to a one-seat margin. This column argues that when the final count lands, the better result for working New Zealanders is a government led by Labour, with the Greens and The Opportunity Party (TOP) at the table.

Where the count stands

The facts first. According to Al Jazeera's report of the Electoral Commission's preliminary results, published on 7 November, the National-led coalition of National, ACT and New Zealand First holds 67 of a projected 131 seats. That is one more than the 66 needed to govern. National and Labour each won just under 30 per cent of the party vote.

That majority is not final. About 14 per cent of all votes are special votes, still to be counted. These include ballots cast overseas and votes cast outside a voter's home electorate. Al Jazeera notes that special votes have historically favoured the left. The final result is due on 27 November, and until then the coalition stays on as a caretaker government.

The Electoral Commission also said TOP will clear the 5 per cent threshold and enter Parliament. If the coalition loses even one seat on the specials, the arithmetic changes completely, and TOP could become the party that decides who governs.

Christopher Luxon summed it up on election night: "But right now, it is too close to call." Chris Hipkins did not claim victory either, telling supporters: "New Zealand has spoken." He added that it may take a little longer to understand exactly what voters said.

A vote about the cost of living

Whatever the final seat count, the message from voters is hard to miss. In an analysis for the ABC on 10 November, chief business correspondent Ian Verrender argued that soaring prices pushed voters to shake up the status quo in New Zealand, as they did in the United States midterms. He noted that several high-ranking ministers lost their places.

The numbers behind that anger are stark. Stats NZ figures reported by RNZ and the Otago Daily Times on 3 November show unemployment at 5.7 per cent in the September quarter, the highest in 11 years, with 174,000 people out of work. Take-home pay rose 3.3 per cent over the year while inflation ran at 3.7 per cent. In plain terms, many workers went backwards.

Verrender also pointed out that about 120,000 New Zealanders moved to Australia in the three years to mid-2026. When young workers and families leave in those numbers, it is not a sign that the government's growth plan is working.

National was elected three years ago promising to tame inflation and get the economy moving. Inflation is still well above the Reserve Bank's target, growth remains weak, and the dole queue is longer. After three years in charge, the government owns these results.

Why Labour should lead

Labour went into this campaign promising cheaper healthcare and cheaper transport, Al Jazeera reported. Those are not abstract ideas. They are the bills that come out of household budgets every week: the GP visit that gets put off, the bus fare or petrol that eats into a wage that is not keeping up.

Labour's record on wages, the minimum wage and public health investment gives it the credibility to lead a government focused on the household squeeze. It is also the only party with the size and depth to hold a centre-left government together through a full term.

What the Greens bring

The Greens have spent years making the case that climate action and fair incomes belong together. They have long argued that a fairer tax system, where the wealthiest pay a reasonable share, can fund better income support and public services. In a Parliament where the cost of living dominated the campaign, that argument deserves a seat at the cabinet table, not just the cross benches.

A government that includes the Greens would also bring stronger voices on housing quality, public transport and the health of rivers and coastlines. Those are long-term investments that every New Zealander benefits from.

Why TOP matters

The Opportunity Party's arrival in Parliament is good news for anyone who wants evidence-based policy. TOP has long pushed for a tax system that leans less on wages and more on land and unearned property gains. Whatever one thinks of the detail, that is a serious answer to the housing affordability problem that has priced a generation out of home ownership.

Luxon has repeatedly ruled out working with TOP, Al Jazeera reported, although National campaign chair Simeon Brown told TVNZ he was not ruling out talks. That shift matters. If National is already rethinking its red lines, TOP has every reason to test which partner would give its ideas a real hearing. A Labour-led arrangement is the more natural fit.

The government's case

To be fair to the other side: National is once again the largest party, and on the preliminary count its coalition has a majority. Brown told TVNZ the party was in a strong position and confident of forming a government with its partners. National campaigned on returning the budget to surplus through spending discipline while expanding the national pension scheme, and its supporters argue that steady fiscal management is what an economy coming out of recession needs. ACT and New Zealand First also won seats and have a legitimate claim to be part of any coalition the numbers allow.

Patience, then a change

Former minister Peter Dunne, who served under both National and Labour, told Al Jazeera: "We could face weeks of interparty negotiations to form a government." He noted that Parliament has to sit by early January, raising the prospect of going into Christmas without a clear government.

That is uncomfortable, but it is how MMP is meant to work. Every special vote must be counted, every party must be heard, and the government that emerges should reflect the full result, not the election-night snapshot.

If the specials shift even one seat, Labour, the Greens and TOP should be ready with a clear, costed plan for the first hundred days: lower health costs, help with transport, a serious jobs plan for the regions with the highest unemployment, and a fair way to pay for it. New Zealanders voted for change on prices and jobs. They deserve a government that will deliver it.

Sources: Al Jazeera, 7 November 2026; ABC News (Ian Verrender analysis), 10 November 2026; Otago Daily Times / RNZ, 3 November 2026; interest.co.nz, 4 November 2026.

Photo: Bowen House, the Beehive and Parliament House, Wellington, by Midnighttonight via Wikimedia Commons (CC BY-SA 3.0).`,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bowen_House_Beehive_Parliament.JPG?width=1280',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'nz-unemployment-11-year-high-workers-left-behind-2026',
    publishedAt: '2026-11-11T21:10:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: 174,000 people out of work is a choice, and the next government must make a different one',
    summary: 'Unemployment has reached 5.7 per cent, its highest level in 11 years, and wages are falling behind prices. A jobs-first plan from Labour, the Greens and TOP would put workers ahead of austerity.',
    body: `The last labour market figures before the election were the worst in more than a decade. They should shape every conversation in the coalition talks now under way.

What the figures show

Stats NZ data, reported by RNZ and the Otago Daily Times on 3 November and by interest.co.nz on 4 November, put the unemployment rate at 5.7 per cent in the September quarter, up from 5.6 per cent. According to interest.co.nz, the last time it was that high was in 2015. The number of people out of work rose to 174,000, which is 14,000 more than a year earlier.

Behind the headline figure the picture is worse. Long-term unemployment, meaning people out of work for more than a year, now makes up about 21.5 per cent of the total, the highest share since 1994, the ODT reported. The underutilisation rate, which counts people who want more work as well as the jobless, was 13.8 per cent, covering about 438,000 people, according to interest.co.nz. The share of young people aged 15 to 24 not in work, education or training rose to 14.1 per cent.

The pain is not shared evenly. Northland's unemployment rate was 8.3 per cent, and Auckland, Waikato and Manawatū-Whanganui were all above 6 per cent, the ODT reported. Underutilisation among Māori was 22.3 per cent and among Pacific peoples 21.2 per cent, according to interest.co.nz.

The jobs that are being created are less secure. Stats NZ's Abby Johnston said: "Casual and fixed term roles increased over the year." interest.co.nz reported that casual employees rose by almost a fifth over the year, while full-time employment fell over the quarter.

Wages going backwards

Meanwhile, pay is not keeping up. Broad wage growth slowed to 2.1 per cent, near a five-year low, and take-home pay rose 3.3 per cent against inflation of 3.7 per cent, the ODT reported. For many households, that means another year of working just as hard for less.

Renters are being squeezed from the other side. Trade Me figures reported by B2B News on 11 November show the national median rent up 2.5 per cent to $625 a week, with Auckland at $660. The same report notes that full interest deductibility for landlords returned in April 2026, a tax break that went to property investors while people looking for work were left to cope with rising rents.

A different choice

None of this was inevitable. A government that put spending restraint first and restored a tax break for landlords made choices that put pressure on the people with the least room to absorb it.

Labour, the Greens and The Opportunity Party offer a different direction. Labour campaigned on making healthcare and transport cheaper, which would ease the cost of getting to work and staying well enough to work. The Greens have long championed public investment in warm homes, public transport and clean energy, all of which create jobs in the regions that need them most. TOP has argued for a tax system that rewards work over property speculation. Together, they could build a jobs plan that targets Northland, the regions and young people first.

That plan should include keeping apprenticeships and trades training funded, bringing forward shovel-ready infrastructure and housing, and making sure the welfare system helps people back into decent work rather than simply pushing them off the books.

The government's case

The government and its supporters argue that the job market is a lagging cost of bringing inflation down. The ODT reported that the Reserve Bank has said subdued wage growth is needed to reduce inflation pressures, and there are still 19,000 more people in work than a year ago. National has campaigned on spending discipline and a return to surplus, arguing that stable public finances will support growth over time.

But ordinary families cannot pay the rent with a promise about the long run. With unemployment at an 11-year high, the next government's first test is simple: does it put workers first? Labour, the Greens and TOP are ready to say yes.

Sources: Otago Daily Times / RNZ, 3 November 2026; interest.co.nz, 4 November 2026; OneRoof, 9 November 2026; B2B News, 11 November 2026.

Photo: Auckland Town Hall, by ChewyPineapple via Wikimedia Commons (CC BY-SA 3.0 NZ).`,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aucklandtownhall.jpg?width=1280',
    author: 'Downunder Voices Opinion',
  },
  {
    slug: 'australia-record-home-loan-slump-first-buyers-renters-2026',
    publishedAt: '2026-11-11T21:00:00.000Z',
    category: 'editorial-view',
    title: 'Opinion: A record slump in investor lending is a chance to put first home buyers and renters first',
    summary: 'New home lending has suffered its biggest quarterly fall on record, led by investors. Australia should use this moment to tilt the housing market back towards people who want a home to live in.',
    body: `Australia's housing market has just recorded something it has never seen before. According to Australian Bureau of Statistics figures reported by the ABC on 11 November, the value of new home loan commitments fell 15.5 per cent in the September quarter. That is the largest quarterly fall since the series began in 2002, deeper than the falls during the global financial crisis and the start of the pandemic.

The detail matters. Investor lending fell a record 32.3 per cent over the quarter, while owner-occupier lending fell 5.3 per cent and first home buyer lending fell 8 per cent, the ABC reported. In other words, investors pulled back far harder than families buying a place to live.

Why investors are retreating

Higher interest rates are part of the story. The Reserve Bank has lifted the cash rate five times this year, the ABC reported. But tax changes in the federal budget also appear to be playing a role. J.P. Morgan economist Tom Ryan told the ABC that "investor lending has declined much more sharply" than owner-occupier lending, and said the budget tax changes had likely made the fall worse. The ABS's Mish Tan said investor activity was being influenced by more than borrowing costs.

For years, tax settings tilted the field towards people buying their second, third or tenth property. If that tilt is now being corrected, it is a reform worth defending, not reversing at the first sign of a softer market.

The squeeze on families is real

None of this means ordinary buyers are having an easy time. Canstar estimates that a person on the average full-time wage of $108,650 has lost more than $58,000 in borrowing power after the latest rate rise, and a couple on average wages close to $117,000, the ABC reported. Cotality data shows national house prices have fallen for seven months in a row.

Outside the property market, the cost of living keeps biting. An ABC Story Lab feature on 9 November followed seven households through their weekly shop and found families cutting back on fresh food, meat and treats. Foodbank reported that 100,000 more households experienced food insecurity in the past year, with high living costs the top reason given.

What a fair housing policy looks like

Falling investor demand creates an opening. With fewer investors competing at auctions, first home buyers have a better chance of getting a foot in the door, as long as they can still borrow. Governments should use this moment to back them: more social and affordable housing, shared-equity schemes that lower the deposit barrier, and strong support for people building homes rather than speculating on them.

Renters must not be forgotten. If some investors sell, the homes do not disappear; many will be bought by owner-occupiers who were renting before. But states and the Commonwealth should make sure renters have fair protections on rent rises and evictions while the market adjusts.

PRD chief economist Diaswati Mardiasmo noted that units are typically 25 to 35 per cent cheaper than houses, and told the ABC: "Less debt means a smaller mortgage and more manageable repayments." Better planning rules that allow more good-quality units and townhouses near transport would give more families that choice.

The other side

Those who favour higher rates argue that they are needed because inflation is still too high, and the RBA has said inflation is not yet under control, the ABC reported. Some economists warn of a sharper fall: AMP's Shane Oliver told the ABC that "houses overall are far more vulnerable to a fall in prices" because they look more overvalued than units.

Those concerns deserve a hearing. But a housing market that works for people who want a home to live in, rather than for those treating homes as a tax-advantaged investment, is a goal worth holding on to through a tough patch.

Sources: ABC News business live blog, 11 November 2026; ABC News (Hanan Dervisevic), 11 November 2026; ABC News Story Lab, 9 November 2026.

Image: Downunder Voices editorial illustration.`,
    imageUrl: 'https://www.downundervoices.com/api/editorial-image/australia-record-home-loan-slump-first-buyers-renters-2026?v=2',
    author: 'Downunder Voices Opinion',
  },
]
