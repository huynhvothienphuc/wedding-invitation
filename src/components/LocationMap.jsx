import Divider from './Divider'
import { map, reception } from '../data/invitation'

function LocationMap() {
  return (
    <section className="bg-cream px-6 py-16 sm:px-10 md:px-16 md:py-24">
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
        <div className="text-center md:text-left">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
            Đường Đi
          </p>
          <div className="md:hidden">
            <Divider />
          </div>
          <div className="mt-4 hidden h-px w-16 bg-gold-light/60 md:block" />

          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-ink-soft md:mx-0 md:mt-6 md:text-base">
            {reception.venue}, {reception.address}
          </p>

          <a
            href={map.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full border border-gold px-6 py-2 text-xs font-medium uppercase tracking-widest text-gold transition hover:bg-gold hover:text-cream md:text-sm"
          >
            Chỉ đường
          </a>
        </div>

        <div className="overflow-hidden rounded-lg border border-gold-light/40 shadow-sm">
          <iframe
            title="Bản đồ đến Queen Plaza"
            src={map.embedUrl}
            className="h-72 w-full md:h-96"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

export default LocationMap
