import { Link } from 'react-router-dom'
import { CHAPTERS, SERIES, type Chapter } from './data/chapters'
import { useMemo, useState } from 'react'

function formatViews(n?: number) {
  if (!n) return ''
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K مشاهدة`
  return `${n} مشاهدة`
}

function ChapterRow({ ch }: { ch: Chapter }) {
  return (
    <Link
      to={`/chapter/${encodeURIComponent(ch.number)}`}
      className="group flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-3 py-3 active:scale-[0.99] transition hover:bg-[var(--color-bg-elev-2)]"
    >
      <div className="flex h-12 min-w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-base font-extrabold text-black shadow-md">
        {ch.number}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
            الفصل
          </span>
          <span className="font-bold">{ch.number}</span>
        </div>
        <div className="truncate text-base">{ch.title}</div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-[var(--color-fg-muted)]">
          {ch.views ? <span>{formatViews(ch.views)}</span> : null}
          {ch.age ? <span dir="ltr">{ch.age}</span> : null}
        </div>
      </div>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-[var(--color-fg-muted)] transition group-hover:text-[var(--color-fg)] rtl:rotate-180"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}

export default function App() {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const base = [...CHAPTERS]
    if (order === 'desc') base.reverse()
    if (!query.trim()) return base
    const q = query.trim().toLowerCase()
    return base.filter(
      (c) =>
        c.title.toLowerCase().includes(q) || c.number.toLowerCase().includes(q),
    )
  }, [order, query])

  return (
    <div className="min-h-full pb-16">
      {/* Hero / header */}
      <header className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1a0b14] via-[#0b0b10] to-[var(--color-bg)]" />
        <div className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(circle_at_30%_-10%,#e63946_0,transparent_45%),radial-gradient(circle_at_85%_10%,#ffb703_0,transparent_50%)]" />
        <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent-2)]">
            مانها صيني • {SERIES.status}
          </div>
          <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
            {SERIES.titleEn}
          </h1>
          <h2 className="mt-1 text-base text-[var(--color-fg-muted)]">
            {SERIES.titleAr}
          </h2>
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {SERIES.synopsisAr}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SERIES.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-2 py-0.5 text-[11px] text-[var(--color-fg-muted)]"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--color-fg-muted)]">
            <span>الرسام: {SERIES.artist}</span>
            <span>•</span>
            <a
              href={SERIES.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="underline decoration-dotted underline-offset-2 hover:text-[var(--color-fg)]"
            >
              المصدر: olympustaff.com
            </a>
          </div>
        </div>
      </header>

      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_80%,transparent)] backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--color-bg)_70%,transparent)]">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-4 py-2.5">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في الفصول…"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-3.5 py-2 text-sm placeholder:text-[var(--color-fg-muted)] focus:border-[var(--color-accent)] focus:outline-none"
              dir="rtl"
            />
          </div>
          <button
            type="button"
            onClick={() => setOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-3 py-2 text-xs font-semibold text-[var(--color-fg-muted)] transition hover:text-[var(--color-fg)]"
            aria-label="ترتيب الفصول"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 6h13M3 12h9M3 18h5" strokeLinecap="round" />
              <path
                d={order === 'asc' ? 'M17 14l3 3 3-3' : 'M17 10l3-3 3 3'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {order === 'asc' ? 'الأقدم أولًا' : 'الأحدث أولًا'}
          </button>
        </div>
      </div>

      {/* Chapter list */}
      <main className="mx-auto w-full max-w-3xl px-4 pt-3">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-fg-muted)]">
            قائمة الفصول
          </h3>
          <span className="text-xs text-[var(--color-fg-muted)]">
            {list.length} / {CHAPTERS.length}
          </span>
        </div>
        <ul className="flex flex-col gap-2">
          {list.map((ch, i) => (
            <li
              key={ch.number}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i * 25, 400)}ms` }}
            >
              <ChapterRow ch={ch} />
            </li>
          ))}
        </ul>

        {list.length === 0 ? (
          <p className="mt-8 text-center text-sm text-[var(--color-fg-muted)]">
            لا توجد فصول مطابقة.
          </p>
        ) : null}

        <p className="mt-8 text-center text-[11px] leading-relaxed text-[var(--color-fg-muted)]">
          المحتوى يُعرَض من المصدر الأصلي{' '}
          <a
            href={SERIES.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="underline decoration-dotted underline-offset-2"
          >
            olympustaff.com
          </a>
          . هذا التطبيق ينظّم قائمة الفصول ويسهّل التنقل بينها على الجوال.
        </p>
      </main>
    </div>
  )
}
