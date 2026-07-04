import Divider from './Divider'
import { reception, weddingDate } from '../data/invitation'

function Reception() {
  return (
    <section className="bg-cream-dark px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          {reception.title}
        </p>
        <Divider />

        <p className="mt-6 text-sm text-ink-soft md:text-base">
          {reception.invite}
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft md:max-w-md md:text-base">
          {reception.body}
        </p>

        <h2 className="mt-6 font-script text-4xl text-ink md:text-5xl">
          {reception.venue}
        </h2>
        <p className="mt-1 text-sm font-medium uppercase tracking-widest text-gold md:text-base">
          {reception.hall}
        </p>
        <p className="mt-2 text-sm text-ink-soft md:text-base">
          {reception.address}
        </p>

        <div className="mt-8 flex items-center justify-center gap-6 font-serif text-lg text-ink md:text-xl">
          <span>Vào lúc {reception.welcomeTime}</span>
          <span className="h-4 w-px bg-gold-light/60" />
          <span>{weddingDate.weekday}</span>
        </div>
        <p className="mt-1 font-serif text-xl tracking-widest text-gold md:text-2xl">
          {weddingDate.gregorian}
        </p>
        <p className="mt-1 text-xs text-ink-soft md:text-sm">
          {weddingDate.lunar}
        </p>

        <p className="mx-auto mt-8 max-w-sm text-sm leading-relaxed text-ink-soft md:max-w-md md:text-base">
          {reception.thanks}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink-soft md:text-sm">
          Đón khách {reception.welcomeTime} · Khai tiệc {reception.startTime}
        </p>
      </div>
    </section>
  )
}

export default Reception
