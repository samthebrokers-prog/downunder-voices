import { dbRequest } from '@/lib/db'

type DraftStory = {
  id: string
  source_id: string | null
  created_at: string
}

type SourceRow = {
  id: string
  source_type: 'official' | 'commercial'
  auto_publish: boolean
  active: boolean
}

export type LiveNewsRecoveryResult = {
  checked: number
  published: number
}

const RECOVERY_WINDOW_HOURS = 72

/**
 * The importer deliberately limits AI rewriting per run. Historically, clean
 * RSS stories from trusted auto-publish sources that arrived after that limit
 * could be left as drafts forever because later imports treated their source
 * URLs as duplicates. This recovery step publishes only recent RSS drafts from
 * active, official sources that are explicitly configured for auto-publish.
 */
export async function recoverFreshAutoPublishDrafts(): Promise<LiveNewsRecoveryResult> {
  const cutoff = new Date(
    Date.now() - RECOVERY_WINDOW_HOURS * 60 * 60 * 1000,
  ).toISOString()

  const drafts = await dbRequest<DraftStory[]>('stories', {
    query:
      '?select=id,source_id,created_at' +
      '&status=eq.draft' +
      '&import_method=eq.rss' +
      `&created_at=gte.${encodeURIComponent(cutoff)}` +
      '&source_id=not.is.null' +
      '&order=created_at.desc' +
      '&limit=250',
  })

  if (!drafts.length) {
    return { checked: 0, published: 0 }
  }

  const sourceIds = [...new Set(
    drafts
      .map((story) => story.source_id)
      .filter((id): id is string => Boolean(id)),
  )]

  const trustedSourceIds = new Set<string>()

  for (const sourceId of sourceIds) {
    const sources = await dbRequest<SourceRow[]>('news_sources', {
      query:
        '?select=id,source_type,auto_publish,active' +
        `&id=eq.${encodeURIComponent(sourceId)}` +
        '&limit=1',
    })

    const source = sources[0]

    if (
      source?.active &&
      source.auto_publish &&
      source.source_type === 'official'
    ) {
      trustedSourceIds.add(source.id)
    }
  }

  let published = 0

  for (const story of drafts) {
    if (!story.source_id || !trustedSourceIds.has(story.source_id)) {
      continue
    }

    await dbRequest('stories', {
      method: 'PATCH',
      query: `?id=eq.${encodeURIComponent(story.id)}`,
      body: {
        status: 'published',
        published_at: story.created_at,
      },
    })

    published += 1
  }

  if (published > 0) {
    console.log(`Live news recovery published ${published} fresh RSS drafts.`)
  }

  return {
    checked: drafts.length,
    published,
  }
}
