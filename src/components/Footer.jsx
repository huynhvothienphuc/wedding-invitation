import FloralCorner from './FloralCorner'
import { couple, weddingDate } from '../data/invitation'

function Footer() {
  return (
    <section className="relative overflow-hidden bg-cream-dark px-6 py-16 text-center sm:px-10 md:px-16">
      <FloralCorner className="absolute -top-6 left-1/2 h-24 w-24 -translate-x-1/2 rotate-45 text-gold/60 md:h-28 md:w-28" />

      <p className="mt-16 text-sm leading-relaxed text-ink-soft md:text-base">
        Rất hân hạnh được đón tiếp
      </p>
      <p className="mt-4 font-script text-3xl text-ink md:text-4xl">
        {couple.groomShort} &amp; {couple.brideShort}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold md:text-sm">
        {weddingDate.gregorian}
      </p>
    </section>
  )
}

export default Footer
