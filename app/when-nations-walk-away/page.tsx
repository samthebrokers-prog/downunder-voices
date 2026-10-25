import Link from 'next/link'

export const metadata = {
  title: 'When Nations Walk Away: Is the Global System Starting to Fracture? | Downunder Voices',
  description: 'A Downunder Voices editorial on national sovereignty, the WHO, the UN and the future of international cooperation.',
}

export default function NationsWalkAwayPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">From the Editor</p>
      <h1 className="mt-3 font-serif text-4xl font-black leading-tight text-slate-950 sm:text-5xl">When Nations Walk Away: Is the Global System Starting to Fracture?</h1>
      <p className="mt-5 text-xl leading-8 text-slate-600">The United States has moved to withdraw from the World Health Organization while governments are again questioning the value, cost and influence of international institutions. What happens when powerful nations decide the global system no longer serves their interests — and could others follow?</p>
      <img src="/editorial/global-system-fracture.svg" alt="Editorial illustration of people, nations and the global institutions debate" className="mt-8 w-full rounded-xl border border-slate-200" />
      <article className="prose prose-lg mt-10 max-w-none prose-headings:font-serif prose-headings:font-black">
        <p>For decades, the post-war international system has rested on a simple bargain: nations give up a small part of their freedom of action in return for cooperation, stability and a stronger collective response to problems that do not stop at national borders.</p>
        <p>That bargain is being tested. The United States notified its withdrawal from the World Health Organization, a move the WHO says raises questions for its governing bodies. The dispute is not merely about public health. It goes to a much larger question: how much authority, money and political trust should sovereign countries place in international organisations?</p>
        <h2>Sovereignty versus cooperation</h2>
        <p>Supporters of institutions such as the United Nations and WHO argue that pandemics, wars, migration, climate risks and humanitarian emergencies cannot be managed effectively by countries acting alone. Critics answer that international bodies can become bureaucratic, expensive and too distant from the voters who ultimately pay for them.</p>
        <p>Both arguments deserve scrutiny. International cooperation can be valuable without every international institution being beyond criticism. Equally, demanding reform is not the same thing as rejecting cooperation altogether.</p>
        <h2>What happens when a major nation leaves?</h2>
        <p>When a powerful contributor steps away, the immediate impact can be financial and operational. The longer-term effect may be political: other governments begin asking whether membership still delivers enough value, whether rules are applied fairly and whether national interests are adequately protected.</p>
        <p>That does not mean the UN system is about to collapse. The United Nations still has 193 member states, and its General Assembly remains a forum in which every member state has representation. But institutions survive on more than membership numbers. They depend on confidence.</p>
        <h2>The question Australia and New Zealand should ask</h2>
        <p>Australia and New Zealand are deeply connected to multilateral institutions, particularly across health, security, trade and the Pacific. Our governments should support useful international cooperation while also asking hard questions about effectiveness, transparency, accountability and value for taxpayers.</p>
        <p>The choice should not be blind loyalty or wholesale withdrawal. The better question is whether these institutions are still doing the jobs nations created them to do — and whether they are willing to reform when public confidence begins to fall.</p>
        <p><strong>That is the real risk:</strong> not one country walking away, but enough countries deciding that the system no longer listens to them.</p>
      </article>
      <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
        <p className="font-bold text-slate-900">Sources and further reading</p>
        <p className="mt-2">World Health Organization: statement on notification of withdrawal of the United States, 24 January 2026.</p>
        <p>United Nations: General Assembly — 193 member states and the principle of equal representation.</p>
      </div>
      <Link href="/" className="mt-8 inline-block font-bold text-red-700 hover:underline">← Back to Downunder Voices</Link>
    </main>
  )
}
