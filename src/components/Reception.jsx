import Divider from './Divider'
import { reception, weddingDate } from '../data/invitation'

function Reception() {
  return (
    <section className="bg-cream px-8 py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
        {reception.title}
      </p>
      <Divider />

      <p className="mt-6 text-sm text-ink-soft">{reception.invite}</p>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
        {reception.body}
      </p>

      <h2 className="mt-6 font-script text-4xl text-ink">
        {reception.venue}
      </h2>
      <p className="mt-1 text-sm font-medium uppercase tracking-widest text-gold">
        {reception.hall}
      </p>
      <p className="mt-2 text-sm text-ink-soft">{reception.address}</p>

      <div className="mt-8 flex items-center justify-center gap-6 font-serif text-lg text-ink">
        <span>Vào lúc {reception.welcomeTime}</span>
        <span className="h-4 w-px bg-gold-light/60" />
        <span>{weddingDate.weekday}</span>
      </div>
      <p className="mt-1 font-serif text-xl tracking-widest text-gold">
        {weddingDate.gregorian}
      </p>
      <p className="mt-1 text-xs text-ink-soft">{weddingDate.lunar}</p>

      <p className="mx-auto mt-8 max-w-xs text-sm leading-relaxed text-ink-soft">
        {reception.thanks}
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink-soft">
        Đón khách {reception.welcomeTime} · Khai tiệc {reception.startTime}
      </p>
    </section>
  )
}

export default Reception
