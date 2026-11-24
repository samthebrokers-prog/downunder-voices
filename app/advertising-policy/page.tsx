import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Advertising Policy | Downunder Voices',
  description: 'How Downunder Voices accepts, labels and separates advertising and sponsorship from its journalism.',
}

export default function Page() {
  return (
    <LegalPage eyebrow="Standards" title="Advertising Policy" updated="25 November 2026">
      <>
        <section>
          <h2>Why we carry advertising</h2>
          <p>
            Downunder Voices is free to read and listen to. Advertising and sponsorship help pay for our journalism,
            website and radio station. This policy sets out how we make sure commercial material never compromises
            our independence or misleads our audience.
          </p>
        </section>

        <section>
          <h2>Editorial independence</h2>
          <p>
            Advertisers and sponsors have no say over what we report, how we report it or what our opinion pieces
            say. They do not see or approve stories before publication, and buying advertising does not buy
            coverage, favourable or otherwise. We will report on advertisers and sponsors in the same way as anyone
            else when it is in the public interest.
          </p>
          <p>
            Decisions about news and opinion are made by the editor alone, under our{' '}
            <Link href="/editorial-policy">Editorial Policy</Link>.
          </p>
        </section>

        <section>
          <h2>Clear labelling</h2>
          <p>Readers and listeners should always be able to tell the difference between our journalism and paid material.</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Display and automated ads are shown in ad spaces marked &quot;Advertisement&quot; or &quot;Ads by Google&quot;.</li>
            <li>Any article, video or feature paid for by an advertiser is labelled &quot;Sponsored&quot; or &quot;Paid partnership&quot; and names the sponsor.</li>
            <li>Radio sponsorship is announced on air, for example &quot;brought to you by …&quot;.</li>
            <li>Paid material will not be designed to look like our own news reporting.</li>
          </ul>
        </section>

        <section>
          <h2>Google AdSense</h2>
          <p>
            Some ads on this site are placed automatically by Google AdSense. We do not choose individual Google ads in
            advance. If you see a Google ad that is misleading or inappropriate, please tell us so we can block it. See
            our <Link href="/privacy#cookies">Privacy Policy</Link> for how advertising cookies work and how to opt out.
          </p>
        </section>

        <section>
          <h2>What we will not accept</h2>
          <p>We may refuse or remove any advertisement at our discretion. We will not accept advertising that:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>is false, misleading or deceptive, or makes claims that cannot be backed up;</li>
            <li>breaks Australian or New Zealand law, including consumer, privacy and spam laws;</li>
            <li>promotes hatred or discrimination, or contains sexually explicit, violent or offensive material;</li>
            <li>promotes tobacco, vaping products, illegal drugs or weapons;</li>
            <li>promotes scams, &quot;get rich quick&quot; schemes, unlicensed financial products or unproven health cures;</li>
            <li>is aimed at children for products unsuitable for them; or</li>
            <li>is designed to look like Downunder Voices journalism.</li>
          </ul>
        </section>

        <section>
          <h2>Restricted categories</h2>
          <p>
            <strong>Alcohol, lotteries and gambling.</strong> Accepted only from licensed operators, only where lawful,
            with any required responsible-gambling or responsible-drinking messages, and never aimed at people under 18.
          </p>
          <p>
            <strong>Political and issue advertising.</strong> Accepted from registered parties, candidates and lawful
            campaigners on equal terms, provided it carries the authorisation statement required by Australian or New
            Zealand electoral law and is clearly labelled as paid political advertising. Accepting a political
            advertisement does not mean Downunder Voices endorses it.
          </p>
          <p>
            <strong>Government and community notices.</strong> Paid government and agency campaigns are labelled as
            advertising. Free public-service information we choose to show is not advertising and is not paid for.
          </p>
        </section>

        <section>
          <h2>Complaints about advertising</h2>
          <p>
            Please tell us about any advertisement you think is misleading or inappropriate through our{' '}
            <Link href="/contact">Contact page</Link> or at{' '}
            <a href="mailto:admin@downundervoices.com">admin@downundervoices.com</a>. You can also complain to{' '}
            <a href="https://adstandards.com.au" target="_blank" rel="noopener noreferrer">Ad Standards</a> in Australia or the{' '}
            <a href="https://www.asa.co.nz" target="_blank" rel="noopener noreferrer">Advertising Standards Authority</a> in New Zealand.
          </p>
        </section>

        <section>
          <h2>Advertise or sponsor with us</h2>
          <p>
            To advertise on the website or sponsor a programme on Downunder Voices Radio, see our{' '}
            <Link href="/advertise">Advertise</Link> and <Link href="/sponsor">Sponsor</Link> pages or email{' '}
            <a href="mailto:admin@downundervoices.com">admin@downundervoices.com</a>.
          </p>
        </section>
      </>
    </LegalPage>
  )
}
