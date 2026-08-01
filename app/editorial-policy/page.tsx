import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'

export default function Page() {
  return (
    <LegalPage eyebrow="Standards" title="Editorial Policy">
      <>
        <section>
          <h2>Our editorial purpose</h2>
          <p>
            Downunder Voices publishes news summaries, original commentary,
            community contributions, public-interest information and stories
            relevant to readers across New Zealand, Australia and the Pacific.
            We aim to make regional news clear, accessible and useful.
          </p>
        </section>

        <section>
          <h2>News, opinion and promotional content</h2>
          <p>
            We distinguish factual news coverage from opinion and commentary.
            Opinion articles represent the views of the identified writer and
            are labelled accordingly.
          </p>

          <p>
            Advertising, sponsored material and promotional content will be
            clearly identified. Commercial relationships do not determine our
            editorial conclusions.
          </p>
        </section>

        <section>
          <h2>Sources and verification</h2>
          <p>
            Material should be supported by reliable and relevant sources,
            including official statements, public records, direct interviews,
            community organisations and established news publishers.
          </p>

          <p>
            Automated imports from official or government sources may be
            published directly where appropriate. Material obtained from
            commercial publishers may be held for editorial review before
            publication.
          </p>

          <p>
            Where information is incomplete, developing or not independently
            confirmed, we aim to make that limitation clear to readers.
          </p>
        </section>

        <section>
          <h2>Attribution and copyright</h2>
          <p>
            Original publishers, organisations and authors are named wherever
            relevant, with links to the original source when available.
          </p>

          <p>
            Downunder Voices does not knowingly republish full copyrighted
            articles, photographs or other protected material without
            permission. Summaries are written in our own words and direct
            quotations are kept limited and properly attributed.
          </p>
        </section>

        <section>
          <h2>Fairness and right of reply</h2>
          <p>
            We aim to report fairly and in context. People, businesses and
            organisations facing significant criticism should be given a
            reasonable opportunity to respond where practical.
          </p>

          <p>
            Relevant responses, corrections or clarifications may be added to
            an article when they become available.
          </p>
        </section>

        <section>
          <h2>Community submissions</h2>
          <p>
            Community submissions may be edited for clarity, length, accuracy,
            legal risk and consistency with our editorial standards.
            Submission does not guarantee publication.
          </p>

          <p>
            Contributors are responsible for ensuring they have the right to
            provide any text, photographs or other material submitted for
            publication.
          </p>
        </section>

        <section>
          <h2>Corrections and updates</h2>
          <p>
            Accuracy matters to us. Where a material error is confirmed, we
            will review the content and publish an appropriate correction,
            clarification or update.
          </p>

          <p>
            Readers can report a possible error through our contact page or
            review our corrections policy.
          </p>

          <p>
            <Link href="/corrections">Read our Corrections Policy</Link>
          </p>
        </section>

        <section>
          <h2>Editorial independence</h2>
          <p>
            Editorial decisions are made independently. Advertisers, sponsors,
            commercial partners and external organisations do not receive the
            right to approve or control independent editorial coverage.
          </p>
        </section>

        <section>
          <h2>Contact us</h2>
          <p>
            Questions about this policy, an article or a request for correction
            can be submitted through our contact page.
          </p>

          <p>
            <Link href="/contact">Contact Downunder Voices</Link>
          </p>
        </section>
      </>
    </LegalPage>
  )
}
