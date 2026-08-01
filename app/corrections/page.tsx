import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'

export default function Page() {
  return (
    <LegalPage eyebrow="Standards" title="Corrections Policy">
      <>
        <section>
          <h2>Our commitment to accuracy</h2>
          <p>
            Downunder Voices aims to publish information that is accurate,
            fair and properly attributed. When we become aware of a material
            error, we will review it and make an appropriate correction,
            clarification, update or removal.
          </p>
        </section>

        <section>
          <h2>How to report an error</h2>
          <p>
            Please use our Contact page and include the article title, URL,
            the information you believe is incorrect and, where possible,
            reliable evidence supporting the requested correction.
          </p>

          <p>
            <Link href="/contact">Contact Downunder Voices</Link>
          </p>
        </section>

        <section>
          <h2>How we assess correction requests</h2>
          <p>
            We review credible correction requests as promptly as practical.
            We may check the original source, public records, supporting
            documents or seek further information from the person or
            organisation involved.
          </p>

          <p>
            Not every disagreement requires a correction. Differences of
            opinion, interpretation or emphasis may be addressed through a
            clarification, update or right of reply where appropriate.
          </p>
        </section>

        <section>
          <h2>How corrections are published</h2>
          <p>
            Material factual errors will be corrected clearly. Where a change
            is significant, the article may include a correction or update note
            explaining what was changed and when.
          </p>

          <p>
            Minor spelling, grammar, formatting or style changes may be made
            without a correction note when they do not alter the meaning of
            the article.
          </p>
        </section>

        <section>
          <h2>Developing stories and source updates</h2>
          <p>
            News can change as new information becomes available. We may update
            articles to reflect later developments, official statements or
            corrected information from an original source.
          </p>

          <p>
            If an original source materially changes, withdraws or corrects
            information, we may amend or remove our summary and add an
            explanatory note where appropriate.
          </p>
        </section>

        <section>
          <h2>Removal requests</h2>
          <p>
            Articles are not normally removed simply because they are
            unfavourable. However, we may remove or restrict content where it
            is materially inaccurate, unlawfully published, creates an
            unreasonable risk of harm, or where there is another strong
            editorial or legal reason.
          </p>
        </section>

        <section>
          <h2>Right of reply</h2>
          <p>
            A person, business or organisation that is the subject of
            significant criticism may contact us with a response or
            clarification. Relevant responses may be added to the article or
            published separately, subject to editorial review.
          </p>
        </section>

        <section>
          <h2>Record of changes</h2>
          <p>
            Where practical, significant corrections and updates will be
            identified on the relevant article so readers can understand that
            the content has changed.
          </p>
        </section>

        <section>
          <h2>Further information</h2>
          <p>
            For more information about our editorial standards, please review
            our Editorial Policy.
          </p>

          <p>
            <Link href="/editorial-policy">Read our Editorial Policy</Link>
          </p>
        </section>
      </>
    </LegalPage>
  )
}
