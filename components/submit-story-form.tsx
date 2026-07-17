'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { categories } from '@/lib/news-data'
import { FormError } from '@/components/form-status'

const inputClasses = 'mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export function SubmitStoryForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) })
    const result = await response.json().catch(() => ({}))
    setLoading(false)
    if (!response.ok) return setError(result.error || 'The story could not be submitted.')
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="rounded-lg border border-border bg-secondary p-8 text-center">
      <CheckCircle2 className="mx-auto size-10 text-accent" />
      <h2 className="mt-4 font-serif text-2xl font-bold">Thank you for sharing</h2>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">Your story has been received for editorial review.</p>
      <button type="button" onClick={() => setSubmitted(false)} className="mt-6 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Submit another story</button>
    </div>
  )

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-6 sm:p-8"><input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium">Your name<input name="name" required maxLength={120} className={inputClasses} /></label>
        <label className="text-sm font-medium">Email<input name="email" type="email" required maxLength={200} className={inputClasses} /></label>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium">Location<input name="location" maxLength={160} placeholder="e.g. Auckland, Perth, Suva" className={inputClasses} /></label>
        <label className="text-sm font-medium">Category<select name="category" required className={inputClasses}><option value="">Select a section</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
      </div>
      <label className="mt-5 block text-sm font-medium">Story headline<input name="title" required maxLength={220} className={inputClasses} /></label>
      <label className="mt-5 block text-sm font-medium">Tell us what is happening<textarea name="story" rows={7} required maxLength={10000} className={inputClasses} /></label>
      <label className="mt-5 block text-sm font-medium">Source link (optional)<input name="source" type="url" maxLength={1000} placeholder="https://" className={inputClasses} /></label>
      <FormError message={error} />
      <button disabled={loading} className="mt-7 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">{loading ? 'Submitting…' : 'Submit story'}</button>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Submissions are reviewed before publication and may be edited for accuracy, length and clarity.</p>
    </form>
  )
}
