import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

// One-off: 29 November 2026 Editorial of the Day on profitable banks
// cutting thousands of jobs. Written by the owner. Safe to call twice.
const story = {
  slug: 'billions-in-profits-thousands-of-jobs-lost-canberra-must-act-2026',
  title: 'Billions in profits, thousands of jobs lost: Canberra must act before corporate Australia destabilises our economy',
  category: 'australia',
  image_url: 'https://www.downundervoices.com/editorial/bank-profits-job-cuts-2026.jpg',
  source_name: 'Downunder Voices Editorial',
  source_url: 'https://www.anz.com.au/newsroom/media/2026/november/2026-full-year-result---proposed-final-dividend/',
  community_angle:
    'Artificial intelligence should improve human productivity, not destroy human livelihoods. It is time for the Australian Government to introduce meaningful safeguards against mass redundancies by profitable corporations.',
  summary: `How can Australia's largest financial institutions announce billions of dollars in annual profits while thousands of employees face the prospect of unemployment?

National Australia Bank reported cash earnings of $7.09 billion in the 2025 financial year and $6.14 billion in 2026. Despite these substantial earnings, NAB has announced plans to reduce its workforce by up to 2,500 positions during the current financial year.

ANZ reported cash profits of $5.79 billion in 2025 and $7.59 billion in 2026 — an increase of 31 per cent. Its restructuring programme has involved plans for approximately 3,500 redundancies.

These are not businesses on the verge of bankruptcy. They are among Australia's largest and most financially significant institutions.

So where does corporate responsibility begin?

An employee is not simply an expense

Behind every redundancy is a human being. There are mortgages to pay, children to educate, families to feed and commitments that cannot simply be cancelled through a corporate restructuring announcement.

When thousands of people lose their jobs, the consequences extend far beyond the company concerned.

Consumer spending can decline. Small businesses lose customers. Mortgage stress increases. Governments face greater welfare expenditure, while income tax revenue comes under pressure.

Ironically, the very banks that depend on financially stable households and successful businesses risk contributing to the economic instability that could undermine their own future.

AI should empower people, not replace them

Artificial intelligence represents one of the greatest technological opportunities of our generation.

It can reduce administrative burdens, improve customer service, identify financial risks, eliminate repetitive work and allow employees to concentrate on tasks that require human judgement, experience and empathy.

But if the principal objective of introducing AI is to eliminate jobs and increase profit margins, we must question who is actually benefiting from this technological revolution.

Not every redundancy announced by Australia's banks is directly attributable to AI. Mergers, organisational duplication, competition and changing economic conditions also play a role.

Nevertheless, governments must ensure that technological transformation does not become an excuse for corporations to abandon their wider responsibilities to society.

Canberra must introduce a corporate employment responsibility policy

Downunder Voices calls on the Australian Government to consider legislation requiring large corporations that have recorded substantial profits in consecutive financial years, and expect to remain profitable in the current financial year, to justify proposed mass redundancies through an independent economic and social impact assessment.

Such policies should include:

• Mandatory independent review of major redundancy programmes undertaken by financially healthy corporations.
• Genuine employee retraining and redeployment opportunities before compulsory redundancies.
• Transparent reporting of how AI and automation affect employment.
• Financial contributions towards worker retraining and transition programmes where substantial job losses cannot reasonably be avoided.
• Government incentives for businesses that use AI to improve productivity while retaining employees.
• Greater accountability for corporate boards when major restructuring programmes threaten employment and economic stability.

These safeguards should apply not only to banks but also to insurance companies, telecommunications providers, technology corporations and other large employers.

This is not a call to prevent legitimate business restructuring or protect every position indefinitely. Businesses must remain competitive, and governments should not force struggling companies into insolvency.

It is a call for balance, accountability and responsible capitalism.

Who will buy the products when people lose their jobs?

Every corporation depends, directly or indirectly, on people having an income.

A country cannot build a sustainable economy by celebrating corporate profits while ignoring the growing insecurity of its workforce.

Australia must not become a nation where profitability is privatised but the social consequences of unemployment are passed on to taxpayers.

We welcome artificial intelligence. We welcome innovation. We welcome profitable businesses.

But we must also protect the people whose labour, experience and loyalty helped build those businesses.

The success of artificial intelligence should not be measured by how many employees it can eliminate, but by how much it can improve the lives of the people it was created to serve.

Canberra must act before corporate restructuring becomes a national economic problem.

Technology must serve humanity — not the other way around.

Downunder Voices — Community First.

Sources: NAB 2026 Full Year Results (5 November 2026); ANZ 2026 Full Year Result (9 November 2026); AAP reporting on NAB's October 2026 job cuts.`,
}

export async function GET() {
  try {
    const existing = await dbRequest<Array<{ id: string; slug: string }>>('stories', { query: `?select=id,slug&slug=eq.${encodeURIComponent(story.slug)}&limit=1` })
    if (existing[0]) {
      await dbRequest('stories', {
        method: 'PATCH',
        query: `?id=eq.${existing[0].id}`,
        body: { title: story.title, image_url: story.image_url, summary: story.summary, community_angle: story.community_angle },
      })
      return NextResponse.json({ ok: true, existing: true, updated: true, id: existing[0].id, slug: story.slug })
    }
    const rows = await dbRequest<Array<{ id: string; slug: string }>>('stories', {
      method: 'POST',
      body: {
        ...story,
        author: 'From the Editor — Downunder Voices',
        status: 'published',
        published_at: new Date().toISOString(),
        import_method: 'automated-editorial',
      },
      prefer: 'return=representation',
    })
    return NextResponse.json({ ok: true, created: true, id: rows[0]?.id, slug: story.slug })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Seed failed' }, { status: 500 })
  }
}
