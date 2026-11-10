// NZ General Election 2026 — data for the /nz-election-live page.
// Preliminary count (7 November 2026) from the NZ Electoral Commission.
// These figures do not change until the official result (with special votes)
// is declared on 27 November 2026. To post a new update, add an item to the
// TOP of `updates` and change `lastUpdated`.

export type PartyResult = {
  name: string
  short: string
  bloc: 'right' | 'left' | 'other'
  color: string
  votePct: string
  electorate: number
  list: number
}

export const electionInfo = {
  title: 'NZ Election 2026 Live',
  status: 'Too close to call — waiting for special votes',
  electionDate: '7 November 2026',
  officialResultIso: '2026-11-27T14:00:00+13:00',
  officialResultLabel: 'Friday 27 November 2026',
  lastUpdated: '11 November 2026, 1:45am NZT',
  totalSeats: 131,
  majority: 66,
  overhang: 11,
  specialVotesExpected: 'about 400,000',
  sourceUrl: 'https://electionresults.govt.nz/ge2026/',
}

export const parties: PartyResult[] = [
  { name: 'National', short: 'NAT', bloc: 'right', color: '#1f4e9c', votePct: '29.21%', electorate: 42, list: 0 },
  { name: 'ACT', short: 'ACT', bloc: 'right', color: '#f5c400', votePct: '10.92%', electorate: 1, list: 12 },
  { name: 'NZ First', short: 'NZF', bloc: 'right', color: '#222222', votePct: '9.78%', electorate: 0, list: 12 },
  { name: 'Labour', short: 'LAB', bloc: 'left', color: '#d82a20', votePct: '29.36%', electorate: 21, list: 15 },
  { name: 'Greens', short: 'GRN', bloc: 'left', color: '#2e9e44', votePct: '13.30%', electorate: 2, list: 14 },
  { name: 'Te Pāti Māori', short: 'TPM', bloc: 'left', color: '#7a1f2b', votePct: '0.56%', electorate: 5, list: 0 },
  { name: 'Opportunity', short: 'TOP', bloc: 'other', color: '#0fa3a3', votePct: '5.96%', electorate: 0, list: 7 },
]

export const closeSeats = [
  { seat: 'Wairarapa', leader: 'Mike Butterick (National)', chaser: 'Kieran McAnulty (Labour)', margin: 139 },
  { seat: 'Mt Roskill', leader: 'Michael Wood (Labour)', chaser: 'Carlos Cheung (National)', margin: 252 },
  { seat: 'Hamilton East', leader: 'Ryan Hamilton (National)', chaser: 'Georgie Dansey (Labour)', margin: 456 },
  { seat: 'Hutt South', leader: 'Ginny Andersen (Labour)', chaser: 'Chris Bishop (National)', margin: 889 },
  { seat: 'Whangārei', leader: 'Lloyd Budd (National)', chaser: 'Gary Payinda (Labour)', margin: 1061 },
  { seat: 'Nelson', leader: 'Blair Cameron (National)', chaser: 'Rachel Boyack (Labour)', margin: 1210 },
  { seat: 'Takanini', leader: 'Rima Nakhle (National)', chaser: 'Kharag Singh (Labour)', margin: 1484 },
]

export const updates = [
  {
    time: '10 Nov',
    headline: 'Luxon confirms talks with Opportunity\'s Qiulae Wong',
    body: 'The Prime Minister confirmed he has spoken with the Opportunity leader. He said New Zealanders would not thank the parties for going back to the polls if no government can be formed, but repeated that National can govern with its current partners and that everyone must wait for the special votes.',
  },
  {
    time: '10 Nov',
    headline: 'Hipkins: National "manipulated" the electoral system',
    body: 'The Labour leader pointed out that National lost the party vote but still won the most seats because of the overhang. Labour is waiting for the final count before deciding its next steps.',
  },
  {
    time: '10 Nov',
    headline: 'Chris Bishop says he is out of Parliament',
    body: 'The senior National minister lost Hutt South to Labour\'s Ginny Andersen by fewer than 900 votes and does not expect special votes to change it. He called the vote-splitting overhang campaign "terribly confusing for voters" and wants the electoral system reviewed.',
  },
  {
    time: '9–10 Nov',
    headline: '35 new MPs arrive at Parliament',
    body: 'Inductions for the new MPs began at Parliament while about 400,000 special votes are still being counted. National says any decision on replacing deputy leader Nicola Willis, who is out on preliminary figures, will wait for the final result.',
  },
  {
    time: '9 Nov, 1:45am NZT',
    headline: 'Live page opened: the wait for special votes begins',
    body: 'Neither Christopher Luxon nor Chris Hipkins has claimed victory. The Electoral Commission is now counting special votes, including votes from New Zealanders overseas. Nothing official changes until 27 November.',
  },
  {
    time: '8 Nov',
    headline: 'Luxon: "We have a pathway… but it is too close to call"',
    body: 'The Prime Minister said National is again the largest party and that ministers stay on under caretaker rules until the official result. He had ruled out working with Opportunity during the campaign; that question is now being asked again.',
  },
  {
    time: '7 Nov, late',
    headline: 'Hipkins does not concede',
    body: 'Speaking in Upper Hutt, the Labour leader told supporters that every vote matters and every vote must now be counted.',
  },
  {
    time: '7 Nov, late',
    headline: 'Big names at risk for National',
    body: 'National won no list seats on the night because its electorate wins already exceed its share of the party vote. That leaves list-only candidates such as deputy leader Nicola Willis outside Parliament on preliminary figures, and Chris Bishop trails in Hutt South.',
  },
  {
    time: '7 Nov, 11:30pm',
    headline: 'Preliminary count complete: coalition 67 of 131 seats',
    body: 'National, ACT and NZ First have 67 seats, one more than the 66 needed. Labour, the Greens and Te Pāti Māori have 57, and Opportunity enters Parliament with 7. Labour is narrowly ahead on the party vote.',
  },
]
