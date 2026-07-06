import { useEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------ */
/* DATA — chỉnh sửa nội dung thiệp tại đây                             */
/* ------------------------------------------------------------------ */

const COUPLE = {
  groomFull: 'Huỳnh Võ Thiên Phúc',
  brideFull: 'Trần Thị Minh Châu',
  groomShort: 'Thiên Phúc',
  brideShort: 'Minh Châu',
}

const WEDDING_DATE = {
  display: '02.08.2026',
  weekday: 'Chủ Nhật',
  day: '02',
  month: '08',
  year: '2026',
  time: '07:15',
  lunar: 'Nhằm ngày 20 tháng 06 năm Bính Ngọ',
}

const GROOM_FAMILY = {
  parents: [
    { name: 'Huỳnh Hồ Thiên Lương', deceased: false },
    { name: 'Võ Thị Minh Hoài', deceased: false },
  ],
  address: '322 Cách Mạng Tháng 8, P. Nhiêu Lộc, TP.HCM',
}

const BRIDE_FAMILY = {
  parents: [
    { name: 'Trần Quang Danh', deceased: true },
    { name: 'Nguyễn Thị Ba', deceased: false },
  ],
  address: '7/2 Bà Lài, P. Bình Tiên, TP.HCM',
}

const RECEPTION = {
  venue: 'Queen Plaza Kỳ Hòa',
  hall: 'Sảnh Luxury CD',
  address: '16A Lê Hồng Phong, P. Hòa Hưng, TP.HCM',
}

// Toạ độ mô phỏng (giả lập) cho Queen Plaza Kỳ Hòa — thay bằng toạ độ thật khi có.
const MAP_COORDINATES = { lat: 10.7756, lng: 106.6819 }

const TIMELINE = [
  { time: '11:00', label: 'Đón khách' },
  { time: '11:45', label: 'Khai tiệc' },
  { time: '12:10', label: 'Rót rượu, cắt bánh' },
  { time: '12:15', label: 'Món chính' },
  { time: '14:00', label: 'Kết thúc tiệc' },
]

/* ------------------------------------------------------------------ */
/* PLACEHOLDER ASSETS — thay các data URI này bằng ảnh thật của bạn     */
/* ------------------------------------------------------------------ */

function makePlaceholderPhoto(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="800" viewBox="0 0 640 800">
    <rect width="100%" height="100%" fill="#f0e9db" />
    <rect x="20" y="20" width="600" height="760" fill="none" stroke="#a67c52" stroke-width="2" />
    <text x="50%" y="50%" font-family="serif" font-size="36" fill="#8b5e34" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function makePlaceholderQr(seedText) {
  const size = 240
  const cells = 12
  const cellSize = size / cells
  let seed = 0
  for (const ch of seedText) seed += ch.charCodeAt(0)
  let rects = ''
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      seed = (seed * 9301 + 49297) % 233280
      if (seed / 233280 > 0.45) {
        rects += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="#5c3a21" />`
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="100%" height="100%" fill="#f9f6f0" />${rects}
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const GALLERY_PHOTOS = [1, 2, 3, 4].map((n) => ({
  id: n,
  src: makePlaceholderPhoto(`Ảnh cưới ${n}`),
  alt: `Ảnh cưới ${n}`,
}))

const GIFT_QR_CODES = [
  {
    id: 'groom',
    label: COUPLE.groomFull,
    bank: 'Ngân hàng • Số tài khoản (placeholder)',
    src: makePlaceholderQr('groom-qr'),
  },
  {
    id: 'bride',
    label: COUPLE.brideFull,
    bank: 'Ngân hàng • Số tài khoản (placeholder)',
    src: makePlaceholderQr('bride-qr'),
  },
]

/* ------------------------------------------------------------------ */
/* SUPABASE PLACEHOLDER — điền config Supabase của bạn ở đây            */
/* ------------------------------------------------------------------ */

// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function submitGuestbookEntry({ name, message }) {
  // TODO: thay đoạn giả lập bên dưới bằng lệnh gọi Supabase thật, ví dụ:
  // const { error } = await supabase.from('guestbook').insert({ name, message })
  // if (error) throw error
  await new Promise((resolve) => setTimeout(resolve, 600))
  return { success: true, name, message }
}

/* ------------------------------------------------------------------ */
/* SMALL REUSABLE UI PIECES                                            */
/* ------------------------------------------------------------------ */

function FloralMotif({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 4 C 40 10, 60 30, 66 60 C 72 90, 90 110, 130 118 C 155 123, 175 132, 190 150"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {[
        [40, 26, 1],
        [84, 92, 0.85],
        [142, 124, 0.7],
      ].map(([cx, cy, scale]) => (
        <g key={cx} transform={`translate(${cx} ${cy}) scale(${scale})`}>
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-7"
              rx="4.2"
              ry="7"
              transform={`rotate(${angle})`}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          <circle r="1.6" fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  )
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 text-gold">
      <span className="h-px w-10 bg-gold-light/60" />
      <span className="text-lg leading-none">❧</span>
      <span className="h-px w-10 bg-gold-light/60" />
    </div>
  )
}

function MusicToggleButton({ isPlaying, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold-light/60 bg-cream text-gold shadow-lg transition hover:bg-gold hover:text-cream"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={`h-6 w-6 ${isPlaying ? 'animate-spin-slow' : ''}`}
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeLinecap="round" />
      </svg>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* SECTION 1 — HERO / SAVE THE DATE                                     */
/* ------------------------------------------------------------------ */

function HeroSection({ showButton = false, onOpen }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-cream-dark px-6 py-16 text-center sm:px-10 md:px-16">
      <FloralMotif className="absolute left-0 top-0 h-28 w-28 text-gold/70 sm:h-36 sm:w-36 md:h-44 md:w-44" />
      <FloralMotif className="absolute bottom-0 right-0 h-28 w-28 rotate-180 text-gold/70 sm:h-36 sm:w-36 md:h-44 md:w-44" />

      <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold md:text-sm">
        Save Our Date
      </p>

      <h1 className="mt-6 font-script text-5xl leading-tight text-ink sm:text-7xl md:text-8xl">
        {COUPLE.groomShort}
        <span className="mx-2 align-middle text-3xl text-gold sm:text-5xl md:text-6xl">
          ♡
        </span>
        {COUPLE.brideShort}
      </h1>

      <p className="mt-8 font-serif text-2xl tracking-widest text-ink-soft md:text-3xl">
        {WEDDING_DATE.display}
      </p>

      <p className="mt-6 text-sm uppercase tracking-[0.3em] text-ink-soft md:text-base">
        Trân trọng kính mời
      </p>

      {showButton && (
        <button
          type="button"
          onClick={onOpen}
          className="mt-12 rounded-full border border-gold px-8 py-3 text-xs font-medium uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-cream md:text-sm"
        >
          Mở Thiệp
        </button>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SECTION 2 — LỄ CƯỚI (GIA TIÊN)                                       */
/* ------------------------------------------------------------------ */

function FamilyBlock({ family }) {
  return (
    <div className="text-center">
      <p className="text-sm text-ink-soft md:text-base">Ông / Bà</p>
      {family.parents.map((parent) => (
        <p key={parent.name} className="font-serif text-lg font-medium text-ink md:text-xl">
          {parent.name}
          {parent.deceased && (
            <span className="ml-1 text-ink-soft" aria-label="đã mất">
              ✝
            </span>
          )}
        </p>
      ))}
      <p className="mx-auto mt-2 max-w-[16rem] text-sm text-ink-soft md:text-base">
        {family.address}
      </p>
    </div>
  )
}

function CeremonySection() {
  return (
    <section className="bg-cream px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Lễ Thành Hôn
        </p>
        <SectionDivider />

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 md:gap-16">
          <FamilyBlock family={GROOM_FAMILY} />
          <FamilyBlock family={BRIDE_FAMILY} />
        </div>

        <p className="mx-auto mt-12 max-w-sm text-sm uppercase leading-relaxed tracking-widest text-ink-soft md:max-w-md md:text-base">
          Trân trọng báo tin lễ thành hôn của con chúng tôi
        </p>

        <p className="mt-6 font-script text-4xl text-ink md:text-5xl">{COUPLE.groomFull}</p>
        <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft md:text-sm">Út Nam</p>

        <span className="mt-4 block font-serif text-2xl text-gold md:text-3xl">&</span>

        <p className="mt-4 font-script text-4xl text-ink md:text-5xl">{COUPLE.brideFull}</p>
        <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft md:text-sm">Út Nữ</p>

        <p className="mx-auto mt-10 max-w-sm text-sm uppercase leading-relaxed tracking-widest text-ink-soft md:max-w-md md:text-base">
          Hôn lễ được cử hành tại tư gia
        </p>

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Vào lúc
        </p>
        <p className="mt-2 font-serif text-5xl text-ink md:text-6xl">{WEDDING_DATE.time}</p>

        <div className="mt-6 flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-ink-soft md:text-sm">
          <span>{WEDDING_DATE.weekday}</span>
          <span className="h-3 w-px bg-gold-light/60" />
          <span>{WEDDING_DATE.day}</span>
          <span className="h-3 w-px bg-gold-light/60" />
          <span>Tháng {WEDDING_DATE.month}</span>
        </div>
        <p className="mt-2 font-serif text-4xl tracking-widest text-gold md:text-5xl">
          {WEDDING_DATE.year}
        </p>
        <p className="mt-2 text-xs text-ink-soft md:text-sm">({WEDDING_DATE.lunar})</p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SECTION 3 — ALBUM ẢNH CƯỚI + LIGHTBOX                                */
/* ------------------------------------------------------------------ */

function Lightbox({ photo, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 px-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onPrev()
        }}
        aria-label="Ảnh trước"
        className="absolute left-3 text-3xl text-cream/80 transition hover:text-cream md:left-10"
      >
        ‹
      </button>

      <img
        src={photo.src}
        alt={photo.alt}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
      />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onNext()
        }}
        aria-label="Ảnh sau"
        className="absolute right-3 text-3xl text-cream/80 transition hover:text-cream md:right-10"
      >
        ›
      </button>

      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="absolute right-4 top-4 text-2xl text-cream/80 transition hover:text-cream"
      >
        ✕
      </button>
    </div>
  )
}

function GallerySection() {
  const [activeIndex, setActiveIndex] = useState(null)

  const showPrev = () =>
    setActiveIndex((index) => (index - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length)
  const showNext = () => setActiveIndex((index) => (index + 1) % GALLERY_PHOTOS.length)

  return (
    <section className="bg-cream-dark px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Album Ảnh Cưới
        </p>
        <SectionDivider />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {GALLERY_PHOTOS.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group overflow-hidden rounded-lg border border-gold-light/40"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <Lightbox
          photo={GALLERY_PHOTOS[activeIndex]}
          onClose={() => setActiveIndex(null)}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SECTION 4 — THÔNG TIN TIỆC CƯỚI                                      */
/* ------------------------------------------------------------------ */

function PartyInviteSection() {
  return (
    <section className="bg-cream px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Tiệc Cưới
        </p>
        <SectionDivider />

        <p className="mt-6 text-sm text-ink-soft md:text-base">Trân trọng kính mời</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft md:max-w-md md:text-base">
          Đến dự bữa tiệc chung vui cùng gia đình chúng tôi
        </p>

        <div className="mt-8 flex items-center justify-center gap-6 font-serif text-lg text-ink md:text-xl">
          <span>Vào lúc {TIMELINE[0].time}</span>
          <span className="h-4 w-px bg-gold-light/60" />
          <span>{WEDDING_DATE.weekday}</span>
        </div>
        <p className="mt-1 font-serif text-xl tracking-widest text-gold md:text-2xl">
          {WEDDING_DATE.display}
        </p>
        <p className="mt-1 text-xs text-ink-soft md:text-sm">{WEDDING_DATE.lunar}</p>

        <p className="mx-auto mt-8 max-w-sm text-sm leading-relaxed text-ink-soft md:max-w-md md:text-base">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SECTION 5 — ĐỊA ĐIỂM TỔ CHỨC                                          */
/* ------------------------------------------------------------------ */

function LocationSection() {
  const mapEmbedSrc = `https://www.google.com/maps?q=${MAP_COORDINATES.lat},${MAP_COORDINATES.lng}&hl=vi&z=16&output=embed`
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${MAP_COORDINATES.lat},${MAP_COORDINATES.lng}`

  return (
    <section className="bg-cream-dark px-6 py-16 sm:px-10 md:px-16 md:py-24">
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-10 text-center md:grid-cols-2 md:gap-16 md:text-left">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
            Địa Điểm
          </p>
          <div className="md:hidden">
            <SectionDivider />
          </div>
          <div className="mt-4 hidden h-px w-16 bg-gold-light/60 md:block" />

          <h2 className="mt-6 font-script text-4xl text-ink md:text-5xl">{RECEPTION.venue}</h2>
          <p className="mt-1 text-sm font-medium uppercase tracking-widest text-gold md:text-base">
            {RECEPTION.hall}
          </p>
          <p className="mt-2 text-sm text-ink-soft md:text-base">{RECEPTION.address}</p>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full border border-gold px-6 py-2 text-xs font-medium uppercase tracking-widest text-gold transition hover:bg-gold hover:text-cream md:text-sm"
          >
            Chỉ đường
          </a>
        </div>

        <div className="overflow-hidden rounded-lg border border-gold-light/40 shadow-sm">
          <iframe
            title={`Bản đồ đến ${RECEPTION.venue}`}
            src={mapEmbedSrc}
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

/* ------------------------------------------------------------------ */
/* SECTION 6 — LỊCH TRÌNH NGÀY CƯỚI                                      */
/* ------------------------------------------------------------------ */

function TimelineSection() {
  return (
    <section className="bg-cream px-6 py-16 sm:px-10 md:px-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Lịch Trình
        </p>
        <SectionDivider />
      </div>

      <ol className="mx-auto mt-12 max-w-md">
        {TIMELINE.map((item, index) => (
          <li key={item.time} className="flex gap-4 pb-10 last:pb-0 sm:gap-6">
            <span className="w-14 shrink-0 text-right font-serif text-lg text-gold sm:w-16 sm:text-xl">
              {item.time}
            </span>
            <span className="flex flex-col items-center">
              <span className="h-3 w-3 shrink-0 rounded-full border-2 border-gold bg-cream" />
              {index < TIMELINE.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-gold-light/50" />
              )}
            </span>
            <span className="pt-0.5 text-left text-sm text-ink md:text-base">{item.label}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SECTION 7 — SỔ LƯU BÚT                                                */
/* ------------------------------------------------------------------ */

function GuestbookSection() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!name.trim() || !message.trim()) return

    setStatus('submitting')
    try {
      await submitGuestbookEntry({ name: name.trim(), message: message.trim() })
      setStatus('success')
      setName('')
      setMessage('')
    } catch (error) {
      console.error('Không thể gửi lời chúc:', error)
      setStatus('error')
    }
  }

  return (
    <section className="bg-cream-dark px-6 py-16 sm:px-10 md:px-16 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Sổ Lưu Bút
        </p>
        <SectionDivider />
        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-ink-soft md:max-w-md md:text-base">
          Gửi lời chúc phúc đến {COUPLE.groomShort} &amp; {COUPLE.brideShort}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          <div>
            <label
              htmlFor="guest-name"
              className="text-xs font-medium uppercase tracking-widest text-ink-soft"
            >
              Tên của bạn
            </label>
            <input
              id="guest-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-2 w-full rounded-md border border-gold-light/50 bg-cream px-4 py-2 text-sm text-ink outline-none focus:border-gold"
            />
          </div>

          <div>
            <label
              htmlFor="guest-message"
              className="text-xs font-medium uppercase tracking-widest text-ink-soft"
            >
              Lời chúc
            </label>
            <textarea
              id="guest-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              rows={4}
              className="mt-2 w-full rounded-md border border-gold-light/50 bg-cream px-4 py-2 text-sm text-ink outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full rounded-full bg-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.3em] text-cream transition hover:bg-gold-dark disabled:opacity-60 md:text-sm"
          >
            {status === 'submitting' ? 'Đang gửi...' : 'Gửi lời chúc'}
          </button>

          {status === 'success' && (
            <p className="text-center text-sm text-gold">Cảm ơn bạn đã gửi lời chúc!</p>
          )}
          {status === 'error' && (
            <p className="text-center text-sm text-red-600">Có lỗi xảy ra, vui lòng thử lại.</p>
          )}
        </form>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SECTION 8 — PHONG BAO MỪNG CƯỚI                                       */
/* ------------------------------------------------------------------ */

function GiftModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg bg-cream p-6 text-center shadow-2xl md:p-8"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">Mừng Cưới</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="text-xl text-ink-soft transition hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {GIFT_QR_CODES.map((qr) => (
            <div key={qr.id}>
              <img
                src={qr.src}
                alt={`Mã QR mừng cưới ${qr.label}`}
                className="mx-auto w-40 rounded-md border border-gold-light/40"
              />
              <p className="mt-3 font-serif text-lg text-ink">{qr.label}</p>
              <p className="mt-1 text-xs text-ink-soft">{qr.bank}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GiftSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="relative overflow-hidden bg-cream px-6 py-16 text-center sm:px-10 md:px-16">
      <FloralMotif className="absolute -top-6 left-1/2 h-24 w-24 -translate-x-1/2 rotate-45 text-gold/60 md:h-28 md:w-28" />

      <p className="mt-16 text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
        Mừng Cưới
      </p>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-soft md:max-w-md md:text-base">
        Sự hiện diện của bạn là món quà quý giá nhất. Nếu muốn gửi lời chúc phúc bằng một phần quà
        nhỏ, chúng tôi xin trân trọng đón nhận qua:
      </p>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="mt-8 inline-block rounded-full border border-gold px-8 py-3 text-xs font-medium uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-cream md:text-sm"
      >
        Gửi Quà Mừng
      </button>

      {isModalOpen && <GiftModal onClose={() => setIsModalOpen(false)} />}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* FOOTER                                                               */
/* ------------------------------------------------------------------ */

function FooterSection() {
  return (
    <section className="relative overflow-hidden bg-cream-dark px-6 py-16 text-center sm:px-10 md:px-16">
      <FloralMotif className="absolute -top-6 left-1/2 h-24 w-24 -translate-x-1/2 rotate-45 text-gold/60 md:h-28 md:w-28" />

      <p className="mt-16 text-sm leading-relaxed text-ink-soft md:text-base">
        Rất hân hạnh được đón tiếp
      </p>
      <p className="mt-4 font-script text-3xl text-ink md:text-4xl">
        {COUPLE.groomShort} &amp; {COUPLE.brideShort}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold md:text-sm">
        {WEDDING_DATE.display}
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* APP — overlay mở thiệp, nhạc nền, auto-scroll                        */
/* ------------------------------------------------------------------ */

function App() {
  const audioRef = useRef(null)
  const userInteractedRef = useRef(false)
  const [isOpened, setIsOpened] = useState(false)
  const [isOverlayClosing, setIsOverlayClosing] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)

  // Khoá cuộn trang khi overlay "Mở Thiệp" còn hiển thị.
  useEffect(() => {
    document.body.style.overflow = isOpened ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpened])

  // Đánh dấu vĩnh viễn ngay khi người dùng chạm/vuốt/cuộn — gắn từ lúc mount
  // (không đợi isOpened) để không bỏ lỡ thao tác xảy ra trong lúc overlay
  // đang đóng, trước khi vòng lặp auto-scroll bên dưới kịp bắt đầu.
  useEffect(() => {
    const markInteracted = () => {
      userInteractedRef.current = true
    }
    window.addEventListener('touchstart', markInteracted, { passive: true })
    window.addEventListener('touchmove', markInteracted, { passive: true })
    window.addEventListener('wheel', markInteracted, { passive: true })
    return () => {
      window.removeEventListener('touchstart', markInteracted)
      window.removeEventListener('touchmove', markInteracted)
      window.removeEventListener('wheel', markInteracted)
    }
  }, [])

  // Auto-scroll bằng requestAnimationFrame sau khi mở thiệp, dừng vĩnh viễn
  // ngay khi userInteractedRef được đánh dấu (xem effect phía trên).
  useEffect(() => {
    if (!isOpened || userInteractedRef.current) return undefined

    let rafId = null

    const step = () => {
      if (userInteractedRef.current) return
      window.scrollBy(0, 1.2)
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (reachedBottom) return
      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [isOpened])

  const playMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    audio
      .play()
      .then(() => setIsMusicPlaying(true))
      .catch(() => setIsMusicPlaying(false))
  }

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isMusicPlaying) {
      audio.pause()
      setIsMusicPlaying(false)
    } else {
      playMusic()
    }
  }

  const handleOpenInvitation = () => {
    setIsOverlayClosing(true)
    playMusic() // gọi trong lúc xử lý click của người dùng để vượt qua autoplay policy
    window.setTimeout(() => setIsOpened(true), 600)
  }

  return (
    <div className="text-ink">
      {/* Đặt file nhạc nền của bạn tại public/audio/wedding-song.mp3 */}
      <audio ref={audioRef} src="/audio/wedding-song.mp3" loop preload="none" />

      <HeroSection />
      <CeremonySection />
      <GallerySection />
      <PartyInviteSection />
      <LocationSection />
      <TimelineSection />
      <GuestbookSection />
      <GiftSection />
      <FooterSection />

      <MusicToggleButton isPlaying={isMusicPlaying} onToggle={toggleMusic} />

      {!isOpened && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-500 ${
            isOverlayClosing ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <HeroSection showButton onOpen={handleOpenInvitation} />
        </div>
      )}
    </div>
  )
}

export default App
