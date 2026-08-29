import Link from 'next/link'

export function LiveElectionBanner() {
  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-[60] sm:bottom-6 sm:right-6">
      <Link
        href="/secret-harbour-live"
        className="pointer-events-auto flex max-w-[280px] items-center gap-3 rounded-full border border-red-800 bg-red-700 px-5 py-3 text-sm font-black text-white shadow-2xl transition hover:-translate-y-0.5 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 sm:max-w-none"
        aria-label="Live Secret Harbour by-election results"
      >
        <span className="relative flex size-3 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-white" />
        </span>
        <span>LIVE — Secret Harbour By-election Results</span>
      </Link>
    </div>
  )
}
