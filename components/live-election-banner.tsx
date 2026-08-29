import Link from 'next/link'

export function LiveElectionBanner() {
  return (
    <div className="border-b border-red-800 bg-red-700 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href="/secret-harbour-live"
          className="flex items-center gap-2 text-center text-sm font-black tracking-wide hover:underline"
        >
          <span className="size-2 animate-pulse rounded-full bg-white" />
          LIVE — Secret Harbour By-election Results
        </Link>
      </div>
    </div>
  )
}
