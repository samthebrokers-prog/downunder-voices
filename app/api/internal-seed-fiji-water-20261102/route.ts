import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

// One-off: the 2 November 2026 Editorial of the Day on Fiji Water.
// Dated just after midnight Sydney time on 2 November so it takes the
// homepage banner for that day. Safe to call twice.
const story = {
  slug: 'whose-water-is-it-fijis-treasure-bottled-for-the-world',
  title: "Whose water is it? Fiji's treasure, bottled for the world",
  category: 'social-issues',
  image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Village_-_Viti_Levu_%2829434447553%29.jpg/960px-Village_-_Viti_Levu_%2829434447553%29.jpg',
  source_name: 'Downunder Voices Editorial',
  source_url: 'https://en.wikipedia.org/wiki/Fiji_Water',
  community_angle:
    'Fiji Water has made Fiji famous worldwide, yet many rural Fijians still lack safe drinking water. Fiji deserves a fair price for its water, clean water at home first, and full transparency.',
  summary: `In a Los Angeles hotel room, a square bottle of Fiji Water sells for several dollars. In a village a few hours' drive from the plant that filled it, families still drink from a well, a river or a rain tank. That contrast is the whole story, and Fiji deserves better than to be the label on someone else's luxury.

Fiji Water has made the country's name famous on tables from New York to Dubai. But the people whose land holds that water, and whose future depends on it, have to ask a simple question: whose water is it, and who really benefits?

A national treasure under foreign ownership

Every bottle comes from a single underground aquifer in the Yaqara Valley, on the northern side of Viti Levu. It is rainwater filtered through volcanic rock over many years, a natural gift of Fijian land.

Yet the brand is not Fijian. It is owned by The Wonderful Company, the US conglomerate of billionaires Stewart and Lynda Resnick, who bought it in 2004 for a reported US$50 million. Its headquarters are in Los Angeles, and around 90 per cent of its sales have historically been in the United States.

The company holds sole rights to draw from that aquifer, at a time when roughly half of Fijians were reported to lack reliable access to clean water. Even today UNICEF says safe drinking water remains a real gap in rural Fiji, and Fijian newspapers keep reporting villages drinking from dirty wells, rivers and rain tanks. When a foreign company can pipe out pristine water for export while Fijian children drink from a well "teeming with frogs", as one Nadroga villager put it in 2023, something is badly out of balance.

What does Fiji get back?

For years Fiji Water paid an extraction tax of about one-third of a Fiji cent per litre. On roughly F$150 million of exports a year, that came to around F$500,000 for the government.

When Fiji tried to raise its share, the company pushed back hard. In 2008 a proposed 20-cent-per-litre tax led to impounded shipments and an industry shutdown, and the government backed down. In 2010 the government set a 15-cent-per-litre tax, which would have lifted Fiji Water's payment to about F$22.6 million. The company responded by closing its plant and laying off around 400 Fijian workers, then reopened just two days later after the government threatened to give the well to another company.

That same year Fiji deported a Fiji Water executive, David Roth, accusing him of interfering in domestic affairs. The government also accused the company of manipulating how the value of its exports was calculated to keep its taxes down, and researchers have noted that both the parent company and its subsidiary were registered in tax havens.

The lesson is plain. When a small Pacific nation asks a billion-dollar brand to pay a fairer price for its most precious resource, the answer has been closing the doors and putting Fijian jobs on the line.

The real cost to the environment

The journey of a Fiji Water bottle tells its own story. Empty plastic bottles have been shipped around 8,000 km from China to Fiji, filled at a plant critics say ran on diesel around the clock, then shipped another 8,700 km or more to buyers in the United States. All of that to move water to countries where clean tap water already flows.

The plastic rarely comes home. Much of it ends up in landfill or the ocean, the same ocean that is rising around Fiji and other Pacific islands because of climate change. For a nation on the front line of the climate crisis, being the face of a single-use plastic export is a bitter irony.

The company's answer was to call its product "carbon negative". Critics called it greenwashing, because the claim leaned on tree planting and offsets that would not happen for decades. By current reports, that goal will not be met until at least 2037.

And questions about the water itself keep coming. In 2024 US authorities recalled nearly two million bottles over manganese and bacteria. In January 2025 an environmental group, The Plastic Coalition, filed a lawsuit claiming the "natural artesian water" marketing is misleading. That case has not been decided, but it adds to the doubts.

Credit where it is due

To be fair, Fiji Water employs hundreds of Fijians, and its foundation has paid for water filters and supply projects in rural villages. In 2019, for example, it helped bring clean water to Natolevu settlement near Nadarivatu for the first time in 91 years. The share of rural communities without clean water has also fallen over the years.

But charity is not the same as a fair deal. Small handouts with the company's name on them cost far less than paying a proper price for the water. Fiji should not have to say thank you for a share of its own resource.

What must change

Fiji's water belongs first to Fijians and to the generations still to come. We call on the Fijian government and Fiji Water to commit to:

1. A fair price for the water. An extraction royalty set openly and reviewed regularly, so Fiji earns a real share of what its water sells for.
2. Clean water at home first. A share of every litre exported should go straight into piped, safe water for rural villages, until every Fijian has it.
3. Full transparency. Publish how much water is taken from the Yaqara aquifer each year, the aquifer's health, and how much tax is paid in Fiji.
4. Real action on plastic. Recyclable or refillable packaging and honest climate claims, not offsets decades away.
5. A voice for landowners. The iTaukei landowners of Yaqara and nearby communities should have a seat at the table on how their water is used.

Fiji gave the world its name on a bottle. The least the world's richest water brand can do is make sure Fijians can drink the same clean water they ship overseas.

Downunder Voices welcomes responses from readers and from Fiji Water.

Sources: Wikipedia (Fiji Water); Trellis; Circle of Blue; IRC WASH; AP via Manufacturing.net; FBC News (August 2023 and November 2025); Fiji Sun.

Photo: Village, Viti Levu, by Michael Coghlan via Wikimedia Commons (CC BY-SA 2.0).`,
}

export async function GET() {
  try {
    const existing = await dbRequest<Array<{ id: string; slug: string }>>('stories', { query: `?select=id,slug&slug=eq.${encodeURIComponent(story.slug)}&limit=1` })
    if (existing[0]) return NextResponse.json({ ok: true, existing: true, id: existing[0].id, slug: story.slug })
    const rows = await dbRequest<Array<{ id: string; slug: string }>>('stories', {
      method: 'POST',
      body: {
        ...story,
        author: 'From the Editor — Downunder Voices',
        status: 'published',
        published_at: '2026-11-01T13:01:00.000Z',
        import_method: 'automated-editorial',
      },
      prefer: 'return=representation',
    })
    return NextResponse.json({ ok: true, created: true, id: rows[0]?.id, slug: story.slug })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Seed failed' }, { status: 500 })
  }
}
