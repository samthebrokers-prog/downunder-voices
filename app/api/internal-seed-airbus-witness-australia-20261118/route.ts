import { NextResponse } from 'next/server'
import { dbRequest } from '@/lib/db'

// One-off: 18 November 2026 article on the Airbus bribery case witness
// living in Australia. Safe to call twice.
const story = {
  slug: 'airbus-bribery-case-key-witness-lives-in-australia-afp-2026',
  title: 'Airbus bribery case: key witness lives in Australia. Should the AFP be looking?',
  category: 'australia',
  image_url:
    'https://commons.wikimedia.org/wiki/Special:FilePath/SriLankan_Airlines_Airbus_A330_at_CDG.jpg?width=1280',
  source_name: 'Downunder Voices',
  source_url: 'https://www.newswire.lk/m7aj',
  community_angle:
    "The case that put Sri Lankan MP Namal Rajapaksa behind bars rests heavily on the sworn word of one businessman, and he lives in Australia. If the bribe he describes is real, is it a matter for Australian law too?",
  summary: `The case that has put Sri Lankan MP Namal Rajapaksa behind bars rests heavily on the word of one man, and that man lives in Australia.

Who is Nimal Perera?

W.D. Nimal (Hemasiri) Perera is a businessman whom Sri Lanka's Bribery Commission (CIABOC) has told the court is living in Australia. He has long been described in the Sri Lankan press as a middleman with close links to the Rajapaksa family, and his name has appeared in money laundering cases involving Namal Rajapaksa since 2016.

In the Airbus case, Sri Lankan investigators travelled to Australia to record a statement from him.

What he is reported to have said

According to evidence presented in a Colombo court in September 2026, Mr Perera stated in an affidavit that money linked to the purchase of Airbus aircraft by SriLankan Airlines passed through a Singapore company, Sabre Vision, and was then split among three accounts, including his own.

He is reported to have said he received US$800,000 in two payments of US$400,000, and then handed about Rs. 100 million to Namal Rajapaksa on several occasions in 2014 and 2015. Namal Rajapaksa, son of then-President Mahinda Rajapaksa, was a sitting MP at the time.

Sri Lankan prosecutors say the investigation received help from authorities in Australia, Singapore, France and the United States. Sri Lankan political figures have also alleged that some of the money passed through an Australian bank account on its way to Sri Lanka.

The other side

Namal Rajapaksa denies any wrongdoing. His lawyers have argued in court that he was arrested mainly on Mr Perera's statement and that there is no solid proof of a bribe beyond it. They have challenged Mr Perera's credibility as a witness. Namal Rajapaksa has since been indicted and remains in custody. None of the allegations has been proven in court.

The Australian question

Here is what many in the Sri Lankan community in Australia are now asking: if a person living in Australia has admitted, in a sworn statement, to receiving and passing on money meant as a bribe to a foreign public official, is that a matter for Australian law?

Australia treats bribing a foreign public official as a serious crime under section 70.2 of the Criminal Code, and it has strict money laundering laws. Whether those laws reach this case depends on facts the public does not yet know, such as whether Mr Perera was an Australian citizen at the time, and whether any of the money really moved through Australia. The Australian Federal Police (AFP) is the agency that can find out, and it accepts reports of suspected foreign bribery through its online "Report a crime" form.

The AFP says not every report leads to an investigation. But a simple principle is at stake: if the bribe is real, the man who says he carried it should face the same scrutiny as the man accused of taking it. And if the bribe is not real, the case against Namal Rajapaksa deserves far closer examination.

Either way, Australians deserve to know whether our country has become a safe home for people at the centre of overseas corruption cases.

This is an opinion piece. Downunder Voices welcomes responses from readers of all views.

Sources: Daily Mirror (Sri Lanka), The Morning, Newswire.lk, Sunday Times (Sri Lanka), The Island, Ada Derana, ch-aviation, ABC Four Corners (May 2022); Attorney-General's Department on foreign bribery offences.

Photo: SriLankan Airlines Airbus A330 at Paris Charles de Gaulle Airport, by DiscoA340, via Wikimedia Commons, licensed CC BY-SA 4.0. Downunder Voices is not affiliated with or endorsed by SriLankan Airlines or Airbus.`,
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
        published_at: '2026-11-18T09:50:00.000Z',
        import_method: 'automated-editorial',
      },
      prefer: 'return=representation',
    })
    return NextResponse.json({ ok: true, created: true, id: rows[0]?.id, slug: story.slug })
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Seed failed' }, { status: 500 })
  }
}
