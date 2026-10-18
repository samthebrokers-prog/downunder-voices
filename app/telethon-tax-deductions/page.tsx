import type { Metadata } from 'next'

const title = 'Big Cheques, Tax Deductions and Telethon: Who Really Pays?'
const description = 'Downunder Voices examines the tax benefit behind major charitable donations — and asks whether corporate philanthropy should ever substitute for fair tax, fair wages and properly funded public services.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'article' },
}

export default function TelethonTaxEditorial() {
  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
    <header className="border-b-4 border-red-700 pb-6">
      <p className="text-xs font-black uppercase tracking-[.18em] text-red-700">Downunder Voices Editorial · 18 October 2026</p>
      <h1 className="mt-3 font-serif text-4xl font-black leading-tight text-slate-950 sm:text-6xl">{title}</h1>
      <p className="mt-5 text-xl leading-8 text-slate-600">Ordinary Australians give because they care. Big donors can care too — but the tax system gives high-income donors a much larger financial benefit. That deserves scrutiny, not mythology.</p>
    </header>

    <figure className="mt-8 overflow-hidden rounded-xl border bg-slate-950 shadow-sm">
      <svg viewBox="0 0 1200 675" role="img" aria-label="Editorial illustration contrasting a televised five million dollar charity cheque with tax deductions and hospital care" className="block h-auto w-full">
        <rect width="1200" height="675" fill="#081a38"/><rect x="0" y="0" width="1200" height="335" fill="#103b78"/>
        <circle cx="930" cy="145" r="115" fill="#2459a5"/><path d="M885 120 C885 75 955 70 960 120 C965 70 1035 75 1035 120 C1035 175 960 220 960 220 C960 220 885 175 885 120" fill="none" stroke="#ff5570" strokeWidth="14"/>
        <text x="55" y="80" fill="white" fontSize="46" fontWeight="900">TELETHON</text><text x="55" y="128" fill="#ffd43b" fontSize="30" fontWeight="800">BIG CHEQUES. BIG TAX DEDUCTIONS.</text>
        <rect x="120" y="190" width="720" height="220" rx="18" fill="white"/><text x="165" y="255" fill="#173f79" fontSize="38" fontWeight="800">CHARITY DONATION</text><text x="165" y="340" fill="#111827" fontSize="78" fontWeight="900">$5,000,000</text><text x="630" y="385" fill="#b4232d" fontSize="28" fontWeight="700">FOR SICK KIDS</text>
        <rect x="65" y="465" width="480" height="145" rx="18" fill="#f8fafc"/><text x="100" y="520" fill="#111827" fontSize="31" fontWeight="900">TAX DEDUCTION</text><text x="100" y="565" fill="#475569" fontSize="23">A deduction reduces taxable income.</text><text x="100" y="595" fill="#475569" fontSize="23">It does not reimburse the donation.</text>
        <rect x="650" y="455" width="470" height="165" rx="18" fill="#fff7ed"/><text x="690" y="510" fill="#9a3412" fontSize="29" fontWeight="900">THE REAL QUESTION</text><text x="690" y="552" fill="#292524" fontSize="22">Should philanthropy ever replace</text><text x="690" y="584" fill="#292524" fontSize="22">fair tax, fair wages and properly</text><text x="690" y="616" fill="#292524" fontSize="22">funded public services?</text>
      </svg>
      <figcaption className="bg-white px-4 py-3 text-xs text-slate-500">Downunder Voices editorial illustration.</figcaption>
    </figure>

    <article className="prose prose-lg mt-10 max-w-none prose-headings:font-serif prose-headings:font-black">
      <p>Every year Australians give to Telethon and other charities because they genuinely want to help children and families. A $20 or $50 donation can be a meaningful sacrifice for a household already dealing with rent, mortgages, groceries and power bills.</p>
      <p>When a wealthy individual or major company announces a multimillion-dollar gift on television, the applause is understandable. The money can do real good. But we should still be clear about the tax treatment behind the cheque.</p>

      <h2>The tax maths — without the myth</h2>
      <p>For an eligible gift to a Deductible Gift Recipient, the donor can generally deduct the gift from taxable income. That does <strong>not</strong> mean the ATO pays the donation back, and it does not mean a $100,000 donation cuts a tax bill by $100,000.</p>
      <p>Take an Australian resident earning $1 million. The top marginal income-tax rate is 45% on taxable income above $190,000. Ignoring other complications, a deductible $100,000 cash gift could therefore reduce income tax by about $45,000. The donor is still roughly $55,000 out of pocket before considering the Medicare levy and any other circumstances.</p>
      <p>Someone earning $95,000 is in the 30% marginal bracket. Their eligible $50 donation may produce roughly a $15 income-tax benefit. Both donors receive a tax concession, but the value of the deduction rises with the donor's marginal tax rate.</p>

      <h2>That still leaves a legitimate public-policy question</h2>
      <p>The argument should not be that every large charitable gift is fake. We cannot know a donor's motive simply from the size of a cheque. The stronger question is whether Australia is comfortable giving private donors both a tax concession and enormous public influence over which causes receive money.</p>
      <p>Philanthropy can fund valuable work. It can also deliver branding, reputation and access. Those benefits deserve scrutiny when a corporate donation becomes a televised marketing moment.</p>

      <h2>Corporate tax is more complicated than revenue versus tax paid</h2>
      <p>Australia's general company tax rate is 30%, while eligible base-rate entities can be taxed at 25%. It is also true that some large corporate entities report no income tax payable in particular years. But revenue is not the same thing as taxable profit, and zero tax payable can arise from losses, deductions, offsets and credits as well as structures that attract legitimate public concern.</p>
      <p>That distinction matters. Criticism of aggressive tax avoidance is stronger when it is based on the actual tax rules rather than assuming that every company with large revenue and no tax payable has illegally evaded tax.</p>

      <h2>Charity should complement a fair system — not replace it</h2>
      <p>Australians should keep supporting causes they believe in. A nurse's $20 and a billionaire's $5 million can both help a sick child. But charitable generosity should never become an excuse for weak public services, unfair wages or an unfair tax system.</p>
      <p>We can applaud money that genuinely helps children while still asking hard questions about tax concessions, corporate responsibility and why essential health services need televised fundraising in the first place.</p>
      <p><strong>That is the debate worth having: not whether generosity is bad, but whether generosity is being asked to do work that a fair economy and a properly funded public system should already be doing.</strong></p>
    </article>

    <section className="mt-10 rounded-xl border-l-4 border-red-700 bg-slate-50 p-6 text-sm leading-7 text-slate-700">
      <strong>Fact-check note:</strong> This editorial was revised before publication to accurately describe Australian donation deductions. A deductible gift reduces taxable income; it is not a dollar-for-dollar refund of the donation. Individual tax rates used are the legislated 2026–27 resident rates. Company rates are 25% for eligible base-rate entities and 30% for other companies.
    </section>
  </main>
}
