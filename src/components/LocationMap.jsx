import Divider from './Divider'
import { map, reception } from '../data/invitation'

function LocationMap() {
  return (
    <section className="px-8 py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
        Đường Đi
      </p>
      <Divider />

      <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-ink-soft">
        {reception.venue}, {reception.address}
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-gold-light/40 shadow-sm">
        <iframe
          title="Bản đồ đến Queen Plaza"
          src={map.embedUrl}
          className="h-72 w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <a
        href={map.directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-full border border-gold px-6 py-2 text-xs font-medium uppercase tracking-widest text-gold transition hover:bg-gold hover:text-cream"
      >
        Chỉ đường
      </a>
    </section>
  )
}

export default LocationMap
