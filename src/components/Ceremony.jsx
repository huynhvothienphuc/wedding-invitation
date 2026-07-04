import Divider from './Divider'
import {
  ceremony,
  couple,
  groomFamily,
  brideFamily,
  weddingDate,
} from '../data/invitation'

function FamilyBlock({ family }) {
  return (
    <div className="text-center">
      <p className="text-sm text-ink-soft md:text-base">Ông / Bà</p>
      <p className="mt-1 font-serif text-lg font-medium text-ink md:text-xl">
        {family.parents[0].name}
        {family.parents[0].deceased && (
          <span className="ml-1 text-ink-soft" aria-label="đã mất">
            ✝
          </span>
        )}
      </p>
      <p className="font-serif text-lg font-medium text-ink md:text-xl">
        {family.parents[1].name}
        {family.parents[1].deceased && (
          <span className="ml-1 text-ink-soft" aria-label="đã mất">
            ✝
          </span>
        )}
      </p>
      <p className="mx-auto mt-2 max-w-[16rem] text-sm text-ink-soft md:text-base">
        {family.address}
      </p>
    </div>
  )
}

function Ceremony() {
  const [day, month, year] = weddingDate.gregorian.split('.')
  const time24 = ceremony.time.replace(' giờ ', ':')

  return (
    <section className="bg-cream px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          {ceremony.title}
        </p>
        <Divider />

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 md:gap-16">
          <FamilyBlock family={groomFamily} />
          <FamilyBlock family={brideFamily} />
        </div>

        <p className="mx-auto mt-12 max-w-sm text-sm uppercase leading-relaxed tracking-widest text-ink-soft md:max-w-md md:text-base">
          {ceremony.intro}
        </p>

        <p className="mt-6 font-script text-4xl text-ink md:text-5xl">
          {couple.groom}
        </p>
        <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft md:text-sm">
          Út Nam
        </p>

        <span className="mt-4 block font-serif text-2xl text-gold md:text-3xl">
          &
        </span>

        <p className="mt-4 font-script text-4xl text-ink md:text-5xl">
          {couple.bride}
        </p>
        <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft md:text-sm">
          Út Nữ
        </p>

        <p className="mx-auto mt-10 max-w-sm text-sm uppercase leading-relaxed tracking-widest text-ink-soft md:max-w-md md:text-base">
          {ceremony.detail}
        </p>

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Vào lúc
        </p>
        <p className="mt-2 font-serif text-5xl text-ink md:text-6xl">
          {time24}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-ink-soft md:text-sm">
          <span>{weddingDate.weekday}</span>
          <span className="h-3 w-px bg-gold-light/60" />
          <span>{day}</span>
          <span className="h-3 w-px bg-gold-light/60" />
          <span>Tháng {month}</span>
        </div>
        <p className="mt-2 font-serif text-4xl tracking-widest text-gold md:text-5xl">
          {year}
        </p>
        <p className="mt-2 text-xs text-ink-soft md:text-sm">
          ({weddingDate.lunar})
        </p>
      </div>
    </section>
  )
}

export default Ceremony
