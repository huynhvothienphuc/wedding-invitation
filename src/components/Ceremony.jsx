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
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold">
        {family.label}
      </p>
      <p className="mt-2 text-sm text-ink-soft">Ông / Bà</p>
      <p className="mt-1 font-serif text-lg font-medium text-ink">
        {family.parents[0].name}
        {family.parents[0].deceased && (
          <span className="ml-1 text-ink-soft" aria-label="đã mất">
            ✝
          </span>
        )}
        {' – '}
        {family.parents[1].name}
        {family.parents[1].deceased && (
          <span className="ml-1 text-ink-soft" aria-label="đã mất">
            ✝
          </span>
        )}
      </p>
      <p className="mt-2 text-sm text-ink-soft">{family.address}</p>
    </div>
  )
}

function Ceremony() {
  return (
    <section className="px-8 py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
        {ceremony.title}
      </p>
      <Divider />

      <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-ink-soft">
        {ceremony.intro}
      </p>

      <div className="mt-8 space-y-8">
        <FamilyBlock family={groomFamily} />
        <FamilyBlock family={brideFamily} />
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <div>
          <p className="font-script text-3xl text-ink">{couple.groom}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft">
            Út Nam
          </p>
        </div>
        <span className="font-serif text-2xl text-gold">&</span>
        <div>
          <p className="font-script text-3xl text-ink">{couple.bride}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft">
            Út Nữ
          </p>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-xs text-sm leading-relaxed text-ink-soft">
        {ceremony.detail}
      </p>
      <p className="mt-2 font-serif text-lg font-medium text-ink">
        Vào lúc {ceremony.time} – {weddingDate.weekday}
      </p>
      <p className="mt-1 font-serif text-xl tracking-widest text-gold">
        {weddingDate.gregorian}
      </p>
    </section>
  )
}

export default Ceremony
