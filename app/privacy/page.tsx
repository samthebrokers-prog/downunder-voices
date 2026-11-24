import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy | Downunder Voices',
  description: 'How Downunder Voices collects, uses, stores and protects personal information, including cookies and advertising.',
}

export default function Page() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="25 November 2026">
      <>
        <section>
          <h2>About this policy</h2>
          <p>
            Downunder Voices is an independent news and opinion publisher based in Perth, Western Australia,
            serving readers in Australia, New Zealand and the Pacific. This policy explains what personal
            information we collect, why we collect it, how we look after it and the choices you have.
          </p>
          <p>
            We handle personal information in line with the Australian Privacy Principles in the
            <em> Privacy Act 1988</em> (Cth) and, for readers in New Zealand, the Information Privacy
            Principles in the <em>Privacy Act 2020</em> (NZ).
          </p>
        </section>

        <section>
          <h2>Information we collect</h2>
          <p><strong>Information you give us.</strong> When you use our contact form, submit a story, tip, letter,
            photograph or comment, apply to sponsor or advertise, or email us, we collect the details you choose to
            provide. This usually includes your name, email address, location and the content of your message, and
            may include phone numbers or files you attach.</p>
          <p><strong>Information collected automatically.</strong> Like most websites, our site and service providers
            record basic technical information when you visit, such as your device and browser type, the pages you
            view, the website that referred you and an approximate location based on your IP address. We use this in
            aggregate to understand readership and keep the site secure.</p>
          <p><strong>Radio listeners.</strong> When you listen to Downunder Voices Radio, our streaming server records
            standard connection data (IP address, player type and listening time) to count listeners and run the stream.</p>
          <p>We do not ask for sensitive information. Please do not send us sensitive information about yourself or
            others unless it is necessary for a story you want us to consider.</p>
        </section>

        <section>
          <h2>How we use your information</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>to reply to enquiries, complaints and correction requests;</li>
            <li>to assess, verify, edit and, where agreed, publish submissions;</li>
            <li>to deal with advertisers and sponsors;</li>
            <li>to run, secure and improve the website and radio stream, and to prevent spam and abuse;</li>
            <li>to show advertising that helps keep Downunder Voices free to read (see below); and</li>
            <li>to meet our legal obligations.</li>
          </ul>
          <p>We do not sell, rent or trade personal information.</p>
        </section>

        <section>
          <h2>Sources and submissions</h2>
          <p>
            If you send us information in confidence, we will not publish your name or identifying details without
            your agreement, unless the law requires it. If you send material clearly intended for publication, such as
            a letter or opinion piece, we may publish your name and general location with it. We will tell you if
            your submission is likely to be published.
          </p>
        </section>

        <section id="cookies">
          <h2>Cookies and advertising</h2>
          <p>
            Downunder Voices uses Google AdSense to display advertisements. Google and its partners, as third-party
            vendors, use cookies and similar technologies to serve ads based on your previous visits to this website
            and other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to
            you based on your visits to this and other sites on the internet.
          </p>
          <p>
            You can opt out of personalised advertising from Google by visiting{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>,
            and you can opt out of some other third-party vendors&apos; use of cookies for personalised advertising at{' '}
            <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">aboutads.info</a>.
            Learn more about{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              how Google uses information from sites that use its services
            </a>.
          </p>
          <p>
            We also use Vercel Web Analytics to count page views. It does not use cookies and does not identify
            individual visitors. Embedded YouTube videos use YouTube&apos;s privacy-enhanced mode, which does not set
            tracking cookies until you play a video. Our admin area uses a cookie only to keep editors signed in.
          </p>
          <p>
            You can block or delete cookies through your browser settings. The site will still work, but ads may be
            less relevant to you.
          </p>
        </section>

        <section>
          <h2>Who we share information with</h2>
          <p>
            We share personal information only with service providers who help us run Downunder Voices, and only as
            needed for that purpose. These include our website hosting, database and analytics providers, our email
            provider, our radio streaming server provider and Google (for advertising). We may also disclose
            information where the law requires it, or to protect the safety of a person.
          </p>
          <p>
            Some of these providers store or process information outside Australia and New Zealand, including in the
            United States. We choose reputable providers that apply recognised security standards.
          </p>
        </section>

        <section>
          <h2>Security and how long we keep information</h2>
          <p>
            We take reasonable steps to protect personal information from misuse, loss and unauthorised access,
            including password-protected admin access and encrypted (HTTPS) connections. No internet service is
            completely secure, so please think carefully before sending highly confidential material by email.
          </p>
          <p>
            We keep personal information only for as long as we need it for the purposes above or as the law requires,
            and then delete or de-identify it. Unpublished submissions are normally deleted within 12 months.
          </p>
        </section>

        <section>
          <h2>Children</h2>
          <p>
            Downunder Voices is a general news service and is not directed at children. We do not knowingly collect
            personal information from children under 16 without the consent of a parent or guardian.
          </p>
        </section>

        <section>
          <h2>Access, correction and deletion</h2>
          <p>
            You can ask to see the personal information we hold about you, or ask us to correct or delete it, by
            emailing <a href="mailto:admin@downundervoices.com">admin@downundervoices.com</a> or using our{' '}
            <Link href="/contact">Contact page</Link>. We will respond within 30 days. We may need to confirm your
            identity first. Requests to remove published journalism are considered under our{' '}
            <Link href="/editorial-policy">Editorial Policy</Link> and <Link href="/corrections">Corrections Policy</Link>.
          </p>
        </section>

        <section>
          <h2>Complaints</h2>
          <p>
            If you have a concern about how we have handled your personal information, please contact us first at{' '}
            <a href="mailto:admin@downundervoices.com">admin@downundervoices.com</a> and we will try to resolve it within
            30 days. If you are not satisfied, you can complain to the{' '}
            <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
              Office of the Australian Information Commissioner
            </a>{' '}
            or, in New Zealand, the{' '}
            <a href="https://www.privacy.org.nz" target="_blank" rel="noopener noreferrer">Office of the Privacy Commissioner</a>.
          </p>
        </section>

        <section>
          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The date at the top of this page shows when it was last changed.
          </p>
        </section>
      </>
    </LegalPage>
  )
}
