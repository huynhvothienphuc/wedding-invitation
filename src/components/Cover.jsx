import FloralCorner from './FloralCorner'
import { couple, weddingDate } from '../data/invitation'

function Cover() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-cream-dark px-6 py-16 text-center sm:px-10 md:px-16">
      <FloralCorner className="absolute left-0 top-0 h-28 w-28 text-gold/70 sm:h-36 sm:w-36 md:h-44 md:w-44" />
      <FloralCorner className="absolute bottom-0 right-0 h-28 w-28 rotate-180 text-gold/70 sm:h-36 sm:w-36 md:h-44 md:w-44" />

      <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold md:text-sm">
        Save Our Date
      </p>

      <h1 className="mt-6 font-script text-6xl leading-none text-ink sm:text-7xl md:text-8xl lg:text-9xl">
        {couple.groomShort}
        <span className="mx-2 align-middle text-4xl text-gold sm:text-5xl md:text-6xl">
          ♡
        </span>
        {couple.brideShort}
      </h1>

      <p className="mt-8 font-serif text-2xl tracking-widest text-ink-soft md:text-3xl">
        {weddingDate.gregorian}
      </p>

      <p className="mt-10 text-sm uppercase tracking-[0.3em] text-ink-soft md:text-base">
        Trân trọng kính mời
      </p>
    </section>
  )
}

export default Cover
