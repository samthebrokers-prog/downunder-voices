'use client'
import { useState } from 'react'
import { categories } from '@/lib/news-data'



type EditableStory = {
  id: string
  title: string
  category: string
  summary: string
  source_name: string
  source_url: string
  image_url: string | null
  community_angle: string | null
  author: string | null
}

export function AdminEditStoryForm({ story }: { story: EditableStory }) {
  const [message, setMessage] = useState('')
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Saving…')
    const form = new FormData(event.currentTarget)
    const response = await fetch(`/api/admin/stories/${story.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(form)),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) return setMessage(result.error || 'Could not save')
    setMessage('Saved')
    setTimeout(() => location.reload(), 600)
  }
  const input = 'mt-1 w-full rounded border border-input px-3 py-2 text-sm'
  return <details className="mt-4 rounded border bg-secondary/40 p-3"><summary className="cursor-pointer text-sm font-semibold">Edit story</summary><form onSubmit={submit} className="mt-4 grid gap-3"><div className="grid gap-3 md:grid-cols-2"><label className="text-sm">Headline<input name="title" required defaultValue={story.title} className={input} /></label><label className="text-sm">Category<select name="category" defaultValue={story.category} className={input}>{categories.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label></div><label className="text-sm">Summary<textarea name="summary" required rows={4} defaultValue={story.summary} className={input} /></label><label className="text-sm">Community angle<textarea name="communityAngle" rows={3} defaultValue={story.community_angle || ''} className={input} /></label><div className="grid gap-3 md:grid-cols-2"><label className="text-sm">Source name<input name="sourceName" required defaultValue={story.source_name} className={input} /></label><label className="text-sm">Source URL<input name="sourceUrl" type="url" defaultValue={story.source_url} className={input} /></label></div><div className="grid gap-3 md:grid-cols-2"><label className="text-sm">Image URL<input name="imageUrl" defaultValue={story.image_url || ''} className={input} /></label><label className="text-sm">Author<input name="author" defaultValue={story.author || ''} className={input} /></label></div><div className="flex items-center gap-3"><button className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save changes</button>{message && <span className="text-sm text-muted-foreground">{message}</span>}</div></form></details>
}

export function AdminRunImportButton() {
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')
  async function run() {
    setWorking(true)
    setMessage('Importing…')
    const response = await fetch('/api/admin/import', { method: 'POST' })
    const result = await response.json().catch(() => ({}))
    setWorking(false)
    if (!response.ok) return setMessage(result.error || 'Import failed')
    const total = (result.results || []).reduce((sum: number, row: { imported?: number }) => sum + (row.imported || 0), 0)
    setMessage(`${total} new stor${total === 1 ? 'y' : 'ies'} imported.`)
    setTimeout(() => location.reload(), 900)
  }
  return <div className="flex items-center gap-3"><button type="button" disabled={working} onClick={run} className="rounded bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50">{working ? 'Importing…' : 'Run news import now'}</button>{message && <span className="text-sm text-muted-foreground">{message}</span>}</div>
}

export function AdminStoryActions({ id, status }: { id: string; status: string }) {
  const [working, setWorking] = useState(false)
  async function update(next: string) { setWorking(true); const r = await fetch(`/api/admin/stories/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) }); setWorking(false); if (r.ok) location.reload(); else alert('Update failed') }
  async function remove() { if (!confirm('Delete this story permanently?')) return; setWorking(true); const r = await fetch(`/api/admin/stories/${id}`, { method: 'DELETE' }); setWorking(false); if (r.ok) location.reload(); else alert('Delete failed') }
  return <div className="flex flex-wrap gap-2"><button disabled={working} onClick={() => update('published')} className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Publish</button><button disabled={working} onClick={() => update('draft')} className="rounded border px-3 py-1.5 text-xs font-semibold">Draft</button><button disabled={working} onClick={() => update('archived')} className="rounded border px-3 py-1.5 text-xs font-semibold">Archive</button><button disabled={working} onClick={remove} className="rounded border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive">Delete</button><span className="self-center text-xs text-muted-foreground">{status}</span></div>
}

export function AdminNewStoryForm() {
  const [message, setMessage] = useState('')
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setMessage('Saving…'); const f = new FormData(e.currentTarget); const r = await fetch('/api/admin/stories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(f)) }); const x = await r.json(); if (r.ok) location.reload(); else setMessage(x.error || 'Could not save') }
  const input='mt-1 w-full rounded border border-input px-3 py-2 text-sm'
  return <form onSubmit={submit} className="grid gap-4 rounded-lg border bg-card p-5"><h2 className="font-serif text-xl font-bold">Add a story</h2><div className="grid gap-4 md:grid-cols-2"><label className="text-sm">Headline<input name="title" required className={input} /></label><label className="text-sm">Category<select name="category" required className={input}>{categories.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label></div><label className="text-sm">Summary<textarea name="summary" required rows={4} className={input} /></label><div className="grid gap-4 md:grid-cols-2"><label className="text-sm">Source name<input name="sourceName" required className={input} /></label><label className="text-sm">Source URL<input name="sourceUrl" type="url" className={input} /></label></div><label className="text-sm">Image URL or /public path<input name="imageUrl" className={input} /></label><label className="text-sm">Community angle<textarea name="communityAngle" rows={3} className={input} /></label><div className="grid gap-4 md:grid-cols-2"><label className="text-sm">Author (optional)<input name="author" className={input} /></label><label className="text-sm">Status<select name="status" className={input}><option value="draft">Draft</option><option value="published">Publish now</option></select></label></div><button className="w-fit rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save story</button>{message && <p className="text-sm">{message}</p>}</form>
}

export function AdminSourceForm() {
  const [message, setMessage] = useState('')
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setMessage('Saving…'); const f = new FormData(e.currentTarget); const r = await fetch('/api/admin/sources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(f)) }); const x = await r.json(); if (r.ok) location.reload(); else setMessage(x.error || 'Could not save') }
  const input='mt-1 w-full rounded border border-input px-3 py-2 text-sm'
  return <form onSubmit={submit} className="grid gap-4 rounded-lg border bg-card p-5"><h2 className="font-serif text-xl font-bold">Add an RSS source</h2><div className="grid gap-4 md:grid-cols-2"><label className="text-sm">Source name<input name="name" required className={input} /></label><label className="text-sm">Feed URL<input name="feedUrl" type="url" required className={input} /></label></div><div className="grid gap-4 md:grid-cols-3"><label className="text-sm">Website URL<input name="siteUrl" type="url" className={input} /></label><label className="text-sm">Default category<select name="defaultCategory" className={input}>{categories.filter(c=>c.slug!=='sams-view').map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label><label className="text-sm">Source type<select name="sourceType" className={input}><option value="commercial">Commercial — import as draft</option><option value="official">Official — auto-publish</option></select></label></div><button className="w-fit rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Add source</button>{message && <p className="text-sm">{message}</p>}</form>
}
