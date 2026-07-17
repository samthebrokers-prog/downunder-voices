'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { FormError } from '@/components/form-status'

const inputClasses = 'mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (submitted) return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-border bg-secondary p-8 text-center">
      <CheckCircle2 className="size-10 text-accent" />
      <h2 className="mt-4 font-serif text-2xl font-bold">Message sent</h2>
      <p className="mt-2 max-w-md text-muted-foreground">Thanks for reaching out. Your message has been delivered to the editorial team.</p>
    </div>
  )

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) })
    const result = await response.json().catch(() => ({}))
    setLoading(false)
    if (!response.ok) return setError(result.error || 'The message could not be sent.')
    setSubmitted(true)
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-6"><input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium">Name<input name="name" required maxLength={120} className={inputClasses} /></label>
        <label className="text-sm font-medium">Email<input name="email" type="email" required maxLength={200} className={inputClasses} /></label>
      </div>
      <label className="mt-5 block text-sm font-medium">Subject<input name="subject" required maxLength={180} className={inputClasses} /></label>
      <label className="mt-5 block text-sm font-medium">Message<textarea name="message" rows={6} required maxLength={5000} className={inputClasses} /></label>
      <FormError message={error} />
      <button disabled={loading} className="mt-6 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50">{loading ? 'Sending…' : 'Send message'}</button>
    </form>
  )
}
