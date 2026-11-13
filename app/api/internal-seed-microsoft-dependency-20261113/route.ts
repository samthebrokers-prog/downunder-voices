import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

// One-off: 13 November 2026 Editorial of the Day on the Australian
// Government's dependence on Microsoft. Safe to call twice.
const story = {
  slug: 'locked-in-canberra-microsoft-dependency-national-risk-2026',
  title: "Locked in: Canberra's Microsoft habit is a national risk",
  category: 'australia',
  image_url:
    'https://commons.wikimedia.org/wiki/Special:FilePath/Microsoft_sign_closeup.jpg?width=1280',
  source_name: 'Downunder Voices Editorial',
  source_url: 'https://www.itnews.com.au/news/dta-signs-sixth-iteration-of-microsoft-licensing-deal-623893',
  community_angle:
    "Australia's government now runs on one American company's software. If Washington ever ordered that company to cut or restrict services, Canberra has no visible Plan B. Here is what it should do about it.",
  summary: `Every working day, Australia's federal public servants log on, and almost every email, briefing note, spreadsheet and Teams call they produce passes through the systems of a single foreign company. This is not a conspiracy theory. It is procurement policy.

In February, the Digital Transformation Agency signed a fresh five-year whole-of-government deal with Microsoft, known as VSA6, which began in July. It gives Commonwealth agencies Microsoft's core office, cloud, security and AI products on common terms. The deal it replaced, in place since 2019, had already run up a bill of more than $1.2 billion as more agencies joined and prices rose.

In April, Microsoft announced a $25 billion investment in Australian digital infrastructure, and Canberra signed a separate AI agreement with the company. Before that came the 2024 Copilot trial, which put Microsoft's AI assistant in front of more than 7,600 staff across 60-plus agencies. The DTA has said that trial did not assess whether the benefits outweighed the cost across government. And a Canberra AI company, Trellis Data, told a Senate committee it was days away from signing a government deal when it was scrapped in favour of Copilot.

Each of these decisions looked reasonable on its own. Together they add up to something no Parliament ever voted for: near-total dependence of the Australian state on one company headquartered in Redmond, Washington.

Risk one: foreign law follows the vendor

The United States CLOUD Act, passed in 2018 after Microsoft fought a US warrant for emails stored in Ireland, lets American authorities compel US companies to hand over data they control, wherever in the world it sits.

Canberra's answer has been that the Australian Government itself is not subject to that law. True, but beside the point. Legal analysis by Norton Rose Fulbright noted that while the Act does not bind Commonwealth agencies, the cloud providers hosting Commonwealth data may be caught by it if they have a US connection. Microsoft is about as American as a company gets.

Microsoft itself has been more candid than our officials. Computer Weekly reported that it advised a Scottish policing body it could not guarantee data sovereignty in its Microsoft 365 cloud. If it cannot promise that to Scotland's police, it cannot promise it to Services Australia, the ATO or Defence.

Risk two: the off switch is in Washington

In 2025, after President Trump sanctioned the International Criminal Court's chief prosecutor, Karim Khan, he lost access to his Microsoft email and moved to Swiss provider Proton Mail, according to court staff quoted by the Associated Press.

Microsoft insists it never cut services to the court itself. But Dutch media reported the company told the ICC that unless the court switched off its own prosecutor, services for the whole organisation were at risk. In February this year, Microsoft had to correct testimony one of its executives gave the UK Parliament about this very episode.

The lesson is simple. When the White House changes its mind, an American company obeys American law, not Australian contracts. Today the target was a prosecutor in The Hague. Imagine a future trade war, a dispute over AUKUS, or a US administration angry at an Australian court ruling. No one in Canberra can say with confidence what happens to our government's email the morning after.

Risk three: who is really looking after the system?

In 2025, ProPublica revealed that Microsoft had for nearly a decade used China-based engineers to help maintain US Defense Department cloud systems. They were supervised by so-called digital escorts, cleared Americans who often lacked the technical skills to understand what the engineers were doing. Top Pentagon officials said they had not known about it. The Pentagon has since banned tech vendors from using China-based staff on its systems.

If the most powerful military on earth did not know who was touching its own cloud, how confident should Australians be that our agencies know who is touching theirs?

Risk four: lock-in, and a market shut to locals

VSA6 promises capped price increases. Ask yourself why a customer needs a cap. It is because once every department's documents, workflows and staff skills are built around one vendor, leaving becomes almost impossible, and the vendor knows it.

Red Hat, in a white paper this year, argued that procurement habits and a risk-averse culture have steered agencies towards closed systems controlled by US giants, partly because of standard insurance and indemnity clauses. Every dollar locked into a foreign licence is a dollar that never builds an Australian IT company, never trains an Australian engineer and never stays in the Australian economy.

The government's case, and why it is not enough

In fairness, Canberra has answers. The DTA says it is strictly technology-neutral, that its insurance rules apply to every supplier, and that it is adding stronger privacy, data portability and exit requirements to its upcoming software and cloud buying panel. VSA6 itself tightens the rules on how government data is handled. Microsoft is a company from our closest ally, much of the data sits in Australian data centres, and switching is not painless: Denmark's digital ministry dropped an open-source office pilot after staff complained about formatting and track-changes problems.

These are fair points. But none of them answers the central question: if Washington ordered Microsoft to restrict services to the Australian Government tomorrow, what is Plan B? As far as the public can tell, there isn't one.

Europe is already moving

Others are not waiting to find out. The German state of Schleswig-Holstein has moved its whole administration's email off Microsoft to open-source systems and says dropping Microsoft licences will save it around 15 million euros a year. Denmark's digital ministry announced its own move away from Microsoft Office. Switzerland's federal government is piloting the move of 3,000 workstations to an open-source suite. These are serious governments treating digital dependence as the strategic risk it is.

What Downunder Voices is calling for

1. Full disclosure. Publish the total cost of every Commonwealth contract with Microsoft and its resellers, in one place, every year.

2. An independent sovereignty test. Ask the Australian Signals Directorate to assess, and report to Parliament, what happens if a foreign government orders a supplier to cut or restrict Australian government services.

3. A tested exit plan. Every critical system, from Centrelink payments to Defence, should have an exit plan that is actually rehearsed, not just written down.

4. A sovereign pilot. Fund one federal department to run on open-source and Australian-hosted systems, as Schleswig-Holstein did, and report honestly on the results.

5. A fair go for Australian firms. Fix the indemnity and insurance rules that quietly lock local companies out of government work.

This is not anti-American. The United States is our closest ally, and Microsoft makes good software. But friendship is not a contract, and good software is not sovereignty. The Albanese Government has argued that Australia should not be merely a customer of overseas AI companies. It is time it applied the same thinking to the software it already runs on.

A nation that cannot open its own email without the permission of a foreign company is not fully in charge of its own affairs. Canberra should fix that before a crisis fixes it for us.

This is an opinion piece. Downunder Voices welcomes responses from readers of all views.

Sources: GovTech Review and iTnews (VSA6, February 2026); TechRepublic (August 2026); Digital Transformation Agency Copilot trial briefing; ACS Information Age (2024); Norton Rose Fulbright on the CLOUD Act; Computer Weekly; Associated Press (May 2025); The Register (18 February 2026); ProPublica and Nextgov (2025); The Canberra Times (Red Hat white paper); Cybernews; It's FOSS.

Photo: Microsoft sign at the company's Redmond campus, via Wikimedia Commons. Microsoft's logo is used here only to identify the company discussed; Downunder Voices is not affiliated with or endorsed by Microsoft.`,
}

export async function GET() {
  try {
    const existing = await dbRequest<Array<{ id: string; slug: string }>>('stories', { query: `?select=id,slug&slug=eq.${encodeURIComponent(story.slug)}&limit=1` })
    if (existing[0]) {
      // Owner request (13 Nov 2026): swap the picture to a Microsoft sign photo.
      await dbRequest('stories', {
        method: 'PATCH',
        query: `?id=eq.${existing[0].id}`,
        body: { image_url: story.image_url, summary: story.summary },
      })
      return NextResponse.json({ ok: true, existing: true, updated: true, id: existing[0].id, slug: story.slug })
    }
    const rows = await dbRequest<Array<{ id: string; slug: string }>>('stories', {
      method: 'POST',
      body: {
        ...story,
        author: 'From the Editor — Downunder Voices',
        status: 'published',
        published_at: '2026-11-13T08:55:00.000Z',
        import_method: 'automated-editorial',
      },
      prefer: 'return=representation',
    })
    return NextResponse.json({ ok: true, created: true, id: rows[0]?.id, slug: story.slug })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Seed failed' }, { status: 500 })
  }
}
