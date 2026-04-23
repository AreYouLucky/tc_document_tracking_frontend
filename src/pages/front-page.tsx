import { Link } from 'react-router-dom'
import { FiArrowRight, FiCalendar, FiList } from 'react-icons/fi'

const portalLinks = [
  {
    title: 'Booking Page',
    description:
      'Create and review document bookings before visitors proceed to processing.',
    to: '/booking-page',
    icon: FiCalendar,
    accent: 'from-amber-300 via-orange-300 to-yellow-100',
    buttonClass:
      'bg-slate-950 text-amber-100 hover:bg-slate-900 focus-visible:ring-amber-200',
  },
  {
    title: 'Queue Page',
    description:
      'Open the live queueing view for releasing, monitoring, and processing requests.',
    to: '/queue-page',
    icon: FiList,
    accent: 'from-sky-300 via-cyan-200 to-white',
    buttonClass:
      'bg-teal-700 text-white hover:bg-teal-600 focus-visible:ring-teal-200',
  },
]

function FrontPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/assets/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,244,196,0.32),_transparent_40%),linear-gradient(135deg,rgba(120,53,15,0.95),rgba(245,158,11,0.82),rgba(15,23,42,0.9))]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="space-y-6 text-white">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-100 backdrop-blur-sm">
              Tangub City Document Tracking
            </div>

            <div className="space-y-4">
              <img
                src="/assets/tc-logo.png"
                alt="Tangub City logo"
                className="h-18 w-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)] sm:h-24"
              />
              <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Choose where this station should go next.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-amber-50/90 sm:text-lg">
                Start at booking to register requests, or continue to the queue
                page for active document processing and releasing.
              </p>
            </div>
          </section>

          <section className="grid gap-5">
            {portalLinks.map(({ title, description, to, icon: Icon, accent, buttonClass }) => (
              <article
                key={to}
                className="group rounded-[2rem] border border-white/15 bg-white/12 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.38)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
              >
                <div
                  className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${accent} p-4 text-slate-950 shadow-lg`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-white">{title}</h2>
                  <p className="text-sm leading-6 text-white/80">{description}</p>
                </div>

                <Link
                  to={to}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${buttonClass}`}
                >
                  Open {title}
                  <FiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}

export default FrontPage
