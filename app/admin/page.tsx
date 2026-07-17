import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-auth'
import { getAllStoriesForAdmin } from '@/lib/story-service'
import {
  databaseConfigurationSummary,
  dbRequest,
  isDatabaseConfigured,
} from '@/lib/db'
import {
  AdminEditStoryForm,
  AdminNewStoryForm,
  AdminRunImportButton,
  AdminSourceForm,
  AdminStoryActions,
} from '@/components/admin-dashboard'

type Source = {
  id: string
  name: string
  feed_url: string
  source_type: string
  auto_publish: boolean
  active: boolean
}
type Log = {
  id: string
  source_name: string
  imported_count: number
  skipped_count: number
  error_message: string | null
  created_at: string
}

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/admin/login')

  const configured = isDatabaseConfigured()
  const configuration = databaseConfigurationSummary()
  let stories: Awaited<ReturnType<typeof getAllStoriesForAdmin>> = []
  let sources: Source[] = []
  let logs: Log[] = []
  let databaseError = ''

  if (configured) {
    try {
      ;[stories, sources, logs] = await Promise.all([
        getAllStoriesForAdmin(),
        dbRequest<Source[]>('news_sources', {
          query: '?select=*&order=name.asc',
        }),
        dbRequest<Log[]>('import_logs', {
          query: '?select=*&order=created_at.desc&limit=15',
        }),
      ])
    } catch (error) {
      console.error('Admin database connection failed:', error)
      databaseError =
        error instanceof Error ? error.message : 'Unknown database error'
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between border-b-2 border-primary pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Private
          </p>
          <h1 className="font-serif text-3xl font-bold">Editorial dashboard</h1>
        </div>
        <form action="/api/admin/logout" method="post">
          <button className="rounded border px-3 py-2 text-sm">Sign out</button>
        </form>
      </div>

      {!configured && (
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
          <h2 className="font-bold">Database setup required</h2>
          <p className="mt-2 text-sm">
            Run supabase/schema.sql in Supabase, then add SUPABASE_URL (or
            NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY in Vercel.
          </p>
        </div>
      )}

      {databaseError && (
        <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
          <h2 className="font-bold">Database connection needs attention</h2>
          <p className="mt-2 text-sm">
            The admin login is working, but Supabase did not accept the database
            request. The dashboard has stayed open so this can be repaired without
            another blank server-error page.
          </p>
          <p className="mt-3 break-words rounded bg-background p-3 font-mono text-xs">
            {databaseError}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Project: {configuration.projectRef ?? 'not detected'} · Key type:{' '}
            {configuration.keyType}
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-8">
        {configured && !databaseError && <AdminRunImportButton />}
        <AdminNewStoryForm />
        <AdminSourceForm />

        <section>
          <h2 className="font-serif text-2xl font-bold">News sources</h2>
          <div className="mt-3 overflow-x-auto rounded border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Feed</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.id} className="border-t">
                    <td className="p-3 font-medium">{source.name}</td>
                    <td className="p-3">{source.source_type}</td>
                    <td className="p-3">
                      {source.auto_publish ? 'Auto-publish' : 'Draft review'}
                    </td>
                    <td className="max-w-sm truncate p-3">{source.feed_url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold">Stories</h2>
          <div className="mt-3 grid gap-3">
            {stories.map((story) => (
              <article key={story.id} className="rounded border bg-card p-4">
                <p className="text-xs uppercase text-muted-foreground">
                  {story.category} ·{' '}
                  {new Date(story.created_at).toLocaleDateString('en-NZ')}
                </p>
                <h3 className="mt-1 font-serif text-lg font-bold">{story.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {story.summary}
                </p>
                <div className="mt-3">
                  <AdminStoryActions id={story.id} status={story.status} />
                </div>
                <AdminEditStoryForm story={story} />
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold">Recent imports</h2>
          <div className="mt-3 grid gap-2">
            {logs.map((log) => (
              <div key={log.id} className="rounded border p-3 text-sm">
                <strong>{log.source_name}</strong>: {log.imported_count} imported,{' '}
                {log.skipped_count} skipped{' '}
                {log.error_message && (
                  <span className="text-destructive">— {log.error_message}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
