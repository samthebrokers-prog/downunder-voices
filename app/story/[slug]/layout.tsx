import type { ReactNode } from 'react'

type StoryLayoutProps = {
  children: ReactNode
}

export default function StoryLayout({ children }: StoryLayoutProps) {
  return (
    <div className="story-format-fix">
      {children}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .story-format-fix p.font-serif.text-xl.font-medium {
              font-size: 1.0625rem !important;
              line-height: 1.8 !important;
              font-weight: 400 !important;
              white-space: pre-line;
            }

            @media (min-width: 640px) {
              .story-format-fix p.font-serif.text-xl.font-medium {
                font-size: 1.125rem !important;
                line-height: 1.85 !important;
              }
            }
          `,
        }}
      />
    </div>
  )
}
