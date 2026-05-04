import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { CHAPTERS, getChapter, getNeighbors, SERIES } from './data/chapters'
import { openExternal } from './lib/openExternal'

export default function ChapterPage() {
  const { number = '' } = useParams()
  const navigate = useNavigate()
  const ch = getChapter(decodeURIComponent(number))
  const { prev, next } = getNeighbors(decodeURIComponent(number))

  // Keyboard arrows for desktop reading: ArrowLeft -> next (RTL), ArrowRight -> prev
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key === 'ArrowLeft' && next) navigate(`/chapter/${encodeURIComponent(next.number)}`)
      if (e.key === 'ArrowRight' && prev) navigate(`/chapter/${encodeURIComponent(prev.number)}`)
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, next, prev])

  if (!ch) {
    return (
      <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="text-xl font-bold">الفصل غير موجود</h1>
        <Link
          to="/"
          className="rounded-xl bg-[var(--color-accent)] px-4 py-2 font-semibold text-black"
        >
          العودة للقائمة
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-full pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_85%,transparent)] backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--color-bg)_70%,transparent)]">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-3 py-2.5">
          <Link
            to="/"
            aria-label="العودة"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] text-[var(--color-fg-muted)] transition hover:text-[var(--color-fg)]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]">
              {SERIES.titleEn}
            </div>
            <div className="truncate text-sm font-bold">
              الفصل {ch.number} — {ch.title}
            </div>
          </div>
          <a
            href={ch.url}
            target="_blank"
            rel="noreferrer noopener"
            onClick={openExternal(ch.url)}
            className="hidden items-center gap-1 rounded-xl bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold text-black shadow-sm transition hover:bg-[var(--color-accent-2)] sm:flex"
          >
            فتح
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.4}>
              <path d="M14 4h6v6M20 4l-8 8M10 4H4v16h16v-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-14 min-w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-lg font-extrabold text-black shadow-md">
              {ch.number}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)]">
                الفصل {ch.number}
              </div>
              <h1 className="text-xl font-black leading-tight">{ch.title}</h1>
              <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-fg-muted)]">
                {ch.views ? (
                  <span>
                    {ch.views >= 1000
                      ? `${(ch.views / 1000).toFixed(ch.views >= 10000 ? 0 : 1)}K`
                      : ch.views}{' '}
                    مشاهدة
                  </span>
                ) : null}
                {ch.age ? <span dir="ltr">{ch.age}</span> : null}
              </div>
            </div>
          </div>

          <a
            href={ch.url}
            target="_blank"
            rel="noreferrer noopener"
            onClick={openExternal(ch.url)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] px-4 py-3.5 text-base font-extrabold text-black shadow-lg transition active:scale-[0.99]"
          >
            افتح الفصل {ch.number} على olympustaff
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M14 4h6v6M20 4l-8 8M10 4H4v16h16v-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="mt-2 text-center text-[11px] text-[var(--color-fg-muted)]">
            يفتح المصدر في تبويب جديد لقراءة صور الفصل.
          </p>
        </div>
      </section>

      {/* How-to / why open externally */}
      <section className="mx-auto w-full max-w-3xl px-4 pt-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          <h2 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-fg)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            ملاحظة
          </h2>
          <p>
            صور الفصل مستضافة على olympustaff.com وراء حماية Cloudflare لا تسمح
            بعرضها داخل التطبيق مباشرة. اضغط زر "افتح" أعلاه لقراءة الفصل في
            تبويب جديد، ثم استخدم أزرار التنقّل في الأسفل للانتقال للفصل
            التالي/السابق.
          </p>
        </div>
      </section>

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_92%,transparent)] backdrop-blur">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-2 px-3 py-2.5 [padding-bottom:max(0.625rem,env(safe-area-inset-bottom))]">
          <NavButton
            to={prev ? `/chapter/${encodeURIComponent(prev.number)}` : undefined}
            label="السابق"
            sub={prev ? `الفصل ${prev.number}` : 'لا يوجد'}
            arrow="prev"
          />
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-0.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elev)] py-1.5 text-[var(--color-fg)] transition active:scale-[0.98]"
            aria-label="قائمة الفصول"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
            <span className="text-[10px] font-bold tracking-wider">القائمة</span>
          </Link>
          <NavButton
            to={next ? `/chapter/${encodeURIComponent(next.number)}` : undefined}
            label="التالي"
            sub={next ? `الفصل ${next.number}` : 'لا يوجد'}
            arrow="next"
          />
        </div>
      </nav>

      {/* Chapter quick picker */}
      <section className="mx-auto w-full max-w-3xl px-4 pt-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-fg-muted)]">
          الانتقال السريع
        </h2>
        <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
          {CHAPTERS.map((c) => {
            const active = c.number === ch.number
            return (
              <Link
                key={c.number}
                to={`/chapter/${encodeURIComponent(c.number)}`}
                className={`snap-start min-w-12 rounded-xl border px-3 py-2 text-center text-sm font-bold transition ${
                  active
                    ? 'border-transparent bg-[var(--color-accent)] text-black'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-elev)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]'
                }`}
              >
                {c.number}
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function NavButton({
  to,
  label,
  sub,
  arrow,
}: {
  to?: string
  label: string
  sub: string
  arrow: 'prev' | 'next'
}) {
  const cls =
    'flex items-center gap-1.5 rounded-2xl border border-[var(--color-border)] px-3 py-1.5 transition active:scale-[0.98]'

  // RTL: "next" visually points to the left (rtl forward).
  const arrowSvg = (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 shrink-0 ${arrow === 'next' ? '' : 'rotate-180'} rtl:rotate-180`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  if (!to) {
    return (
      <div
        className={`${cls} pointer-events-none cursor-not-allowed bg-[var(--color-bg-elev)]/60 text-[var(--color-fg-muted)]/60`}
      >
        {arrow === 'prev' ? arrowSvg : null}
        <div className={`min-w-0 flex-1 ${arrow === 'next' ? 'text-right' : 'text-left'}`}>
          <div className="truncate text-[11px] uppercase tracking-wider">{label}</div>
          <div className="truncate text-xs">{sub}</div>
        </div>
        {arrow === 'next' ? arrowSvg : null}
      </div>
    )
  }
  return (
    <Link
      to={to}
      className={`${cls} bg-[var(--color-bg-elev)] hover:bg-[var(--color-bg-elev-2)]`}
    >
      {arrow === 'prev' ? arrowSvg : null}
      <div className={`min-w-0 flex-1 ${arrow === 'next' ? 'text-right' : 'text-left'}`}>
        <div className="truncate text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)]">
          {label}
        </div>
        <div className="truncate text-xs font-bold">{sub}</div>
      </div>
      {arrow === 'next' ? arrowSvg : null}
    </Link>
  )
}
