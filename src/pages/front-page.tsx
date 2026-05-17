import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiList,
  FiShield,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'

type PortalLink = {
  title: string
  eyebrow: string
  description: string
  to: string
  icon: IconType
  buttonClass: string
  surfaceClass: string
}

type StatusItem = {
  label: string
  value: string
  icon: IconType
}

const portalLinks: PortalLink[] = [
  {
    title: 'Booking Page',
    eyebrow: 'Start here',
    description:
      'Register document requests, review booking details, and prepare visitors for the next step.',
    to: '/booking-page',
    icon: FiCalendar,
    surfaceClass: 'border-amber-200/80 bg-amber-50/95',
    buttonClass:
      'bg-orange-600 text-white shadow-[0_14px_28px_rgba(234,88,12,0.22)] hover:bg-orange-700 focus-visible:ring-orange-200',
  },
  {
    title: 'Queue Page',
    eyebrow: 'Live station',
    description:
      'Monitor pending requests, releasing activity, and active document processing in real time.',
    to: '/queue-page',
    icon: FiList,
    surfaceClass: 'border-sky-200/80 bg-sky-50/95',
    buttonClass:
      'bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)] hover:bg-slate-800 focus-visible:ring-slate-300',
  },
]

const statusItems: StatusItem[] = [
  {
    label: 'Document flow',
    value: 'Booking to release',
    icon: FiCheckCircle,
  },
  {
    label: 'Station mode',
    value: 'Touch friendly',
    icon: FiShield,
  },
  {
    label: 'Daily use',
    value: 'Fast routing',
    icon: FiClock,
  },
]

function FrontPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-950"
      style={{
        backgroundImage: "url('/assets/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.92),rgba(120,53,15,0.72),rgba(245,158,11,0.64))]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <main className="flex flex-1 items-center py-8 sm:py-10 lg:py-12 px-10">
          <div className="grid w-full gap-8 lg:items-center">
            <section className="space-y-7 text-white">
              <div className="space-y-5">
                <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-amber-100 backdrop-blur-md">
                  City Hall service station
                </span>
                <div className="space-y-4">
                  <h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                    Route every document to the right counter.
                  </h2>
                  <p className="max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
                    Open booking for new requests, or switch to the live queue
                    when the counter is ready to process and release documents.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {statusItems.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/16 bg-white/12 p-4 backdrop-blur-md"
                  >
                    <Icon className="mb-3 h-5 w-5 text-amber-100" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/58">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="">
              <div className="grid gap-6 md:grid-cols-2">
                {portalLinks.map(
                  ({
                    title,
                    eyebrow,
                    description,
                    to,
                    icon: Icon,
                    buttonClass,
                    surfaceClass,
                  }) => (
                    <article
                      key={to}
                      className={`group flex min-h-[360px] flex-col justify-between rounded-3xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.16)] sm:p-6 ${surfaceClass}`}
                    >
                      <div className="space-y-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-700 shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
                            <Icon className="h-7 w-7" />
                          </div>
                          <span className="rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
                            {eyebrow}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-3xl font-black leading-tight text-slate-950">
                            {title}
                          </h3>
                          <p className="text-sm leading-6 text-slate-600">
                            {description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Link
                          to={to}
                          aria-label={`Open ${title}`}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 ${buttonClass}`}
                        >
                          Open {title}
                          <FiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default FrontPage
