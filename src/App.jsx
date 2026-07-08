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

// Phần họ + tên đệm đứng trước tên gọi (Thiên Phúc / Minh Châu) — tách riêng
// để khi xuống dòng không bao giờ làm rời "Thiên Phúc" hay "Minh Châu".
const GROOM_NAME_PREFIX = COUPLE.groomFull.replace(COUPLE.groomShort, '').trim()
const BRIDE_NAME_PREFIX = COUPLE.brideFull.replace(COUPLE.brideShort, '').trim()

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
  address: 'Cách Mạng Tháng 8, P. Nhiêu Lộc, TP.HCM',
}

const BRIDE_FAMILY = {
  parents: [
    { name: 'Trần Quang Danh', deceased: true },
    { name: 'Nguyễn Thị Ba', deceased: false },
  ],
  address: 'Bà Lài, P. Bình Tiên, TP.HCM',
}

const RECEPTION = {
  venue: 'Queen Plaza Kỳ Hòa',
  hall: 'Sảnh Luxury CD',
  address: '16A Lê Hồng Phong, P. Hòa Hưng, TP.HCM',
}

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

// 4 ảnh đầu tiên trong public/gallery — nếu đổi/thêm ảnh, cập nhật tên file
// tại đây. Ảnh nào chưa có sẽ tự rơi về placeholder (xem onError bên dưới).
const GALLERY_FILENAMES = ['NBH_5935.JPG', 'NBH_5986.JPG', 'NBH_6027.JPG', 'NBH_6080.JPG']

const GALLERY_PHOTOS = GALLERY_FILENAMES.map((filename, index) => ({
  id: index + 1,
  src: `/gallery/${filename}`,
  fallback: makePlaceholderPhoto(`Ảnh cưới ${index + 1}`),
  alt: `Ảnh cưới ${index + 1}`,
}))

// Dùng cho onError của <img> ảnh gallery: nếu ảnh thật chưa có trong
// public/gallery, tự động rơi về ảnh placeholder thay vì hiện icon vỡ ảnh.
function fallbackToPlaceholder(fallbackSrc) {
  return (event) => {
    event.currentTarget.onerror = null
    event.currentTarget.src = fallbackSrc
  }
}

// Ảnh QR thật đọc từ public/CR.jpeg (chú rể) và public/CD.png (cô dâu) —
// nếu chưa có, tự động rơi về QR placeholder (xem onError trong GiftModal).
const GIFT_QR_CODES = [
  {
    id: 'groom',
    role: 'Út Nam',
    name: COUPLE.groomFull,
    bank: 'TP Bank',
    account: '9168 6816 868',
    src: '/CR.jpeg',
    fallback: makePlaceholderQr('groom-qr'),
  },
  {
    id: 'bride',
    role: 'Út Nữ',
    name: COUPLE.brideFull,
    bank: 'Techcombank',
    account: '1903 7868 5180 16',
    src: '/CD.png',
    fallback: makePlaceholderQr('bride-qr'),
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

// Hoạ tiết hoa mộc lan thật (đã tách từ public/floral/floral.png, xem
// scripts xử lý), dùng làm CSS mask nên có thể tô lại màu bằng bg-* như
// SVG currentColor — dùng đúng 2 mức: bg-rose (hoa chính) và bg-rose/60 (phụ/bướm/nền mờ).
// Truyền fadeDirection ('left' | 'right' | 'top' | 'bottom') để hoa mờ dần
// hoà vào nền thay vì có viền vuông rõ nét.
function FloralImage({ motif, className = '', fadeDirection }) {
  const maskUrl = `url(/floral/motifs/${motif}.png)`
  const fadeGradient = {
    left: 'to left',
    right: 'to right',
    top: 'to top',
    bottom: 'to bottom',
  }[fadeDirection]

  const style = fadeGradient
    ? {
      WebkitMaskImage: `${maskUrl}, linear-gradient(${fadeGradient}, black, rgba(0,0,0,0.5))`,
      maskImage: `${maskUrl}, linear-gradient(${fadeGradient}, black, rgba(0,0,0,0.5))`,
      WebkitMaskSize: 'contain, 100% 100%',
      maskSize: 'contain, 100% 100%',
      WebkitMaskRepeat: 'no-repeat, no-repeat',
      maskRepeat: 'no-repeat, no-repeat',
      WebkitMaskPosition: 'center, center',
      maskPosition: 'center, center',
      WebkitMaskComposite: 'source-in',
      maskComposite: 'intersect',
    }
    : {
      WebkitMaskImage: maskUrl,
      maskImage: maskUrl,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
    }

  return <div aria-hidden="true" className={className} style={style} ></div>
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

function HeroSection({ showButton = false, onOpen, isClosing = false }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-16 text-center sm:px-10 md:px-16">

      <FloralImage
        motif="branch-4"
        className="absolute -bottom-0 -right-4 h-32 w-32 rotate-240 bg-rose sm:h-44 sm:w-44 md:h-56 md:w-56"
      />
      <FloralImage
        motif="branch-1"
        className="absolute -right-4 -top-0 h-32 w-32 -scale-x-100 bg-rose sm:h-44 sm:w-44 md:h-56 md:w-56"
      />
      <FloralImage
        motif="branch-2"
        className="absolute -left-6 -top-0 h-20 w-20  bg-rose sm:h-28 sm:w-28 md:h-32 md:w-32"
      />
      <FloralImage
        motif="branch-1"
        className="absolute -left-6  h-20 w-20  bg-rose sm:h-28 sm:w-28 md:h-32 md:w-32"
      />
      <FloralImage
        motif="branch-2"
        className="absolute -bottom-6 -left-6 h-20 w-20 bg-rose sm:h-28 sm:w-28 md:h-32 md:w-32"
      />
      <FloralImage
        motif="butterfly"
        className="absolute animate-butterfly-flutter-flipped left-[23%] top-50 h-8 w-8 bg-rose sm:h-10 sm:w-10"
      />
      {/* <FloralImage
        motif="butterfly"
        className="absolute animate-butterfly-flutter-flipped bottom-28 left-[12%] h-8 w-8 bg-rose sm:h-11 sm:w-11"
      /> */}
      {/* <FloralImage
        motif="butterfly"
        className="absolute animate-butterfly-flutter-flipped bottom-18 left-[20%] h-8 w-8 bg-rose sm:h-11 sm:w-11"
      /> */}
      {/* <FloralImage
        motif="butterfly"
        className="absolute animate-butterfly-flutter bottom-16 right-[16%] h-8 w-8 bg-rose/60 sm:h-10 sm:w-10"
      /> */}
      {/* DONE */}



      <h1 className="mt-6 flex flex-col items-center gap-3 font-script leading-snug text-name sm:gap-4 md:gap-5">
        <span className="text-4xl sm:text-6xl md:text-7xl">{COUPLE.groomShort}</span>
        <span className="text-2xl text-gold sm:text-4xl md:text-5xl">♡</span>
        <span className="relative text-4xl sm:text-6xl md:text-7xl">
          {COUPLE.brideShort}
          <FloralImage
            motif="butterfly"
            className="absolute animate-butterfly-flutter-centered -right-10 top-1/2 h-8 w-8 bg-rose/60 sm:-right-13 sm:h-10 sm:w-10 md:-right-17 md:h-11 md:w-11"
          />
        </span>
      </h1>

      <p className="mt-8 text-2xl tracking-widest text-ink-soft md:text-3xl">
        {WEDDING_DATE.display}
      </p>

      <p className="mt-6 text-sm uppercase tracking-[0.3em] text-ink-soft md:text-base">
        Trân trọng kính mời
      </p>

      {showButton && (
        <button
          type="button"
          onClick={onOpen}
          onTouchStart={(event) => event.stopPropagation()}
          className={`mt-12 rounded-full border border-gold px-8 py-3 text-xs font-medium uppercase tracking-[0.3em] text-gold transition-all duration-500 hover:bg-gold hover:text-cream md:text-sm ${isClosing ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
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
      <p className="text-xs text-ink-soft sm:text-sm md:text-base">Ba & Mẹ</p>
      {family.parents.map((parent) => (
        <p key={parent.name} className="font-serif text-sm font-medium leading-snug text-ink sm:text-lg md:text-xl">
          {parent.name}
        </p>
      ))}
      <p className="mx-auto mt-2 max-w-[9rem] text-xs leading-snug text-ink-soft sm:max-w-[16rem] sm:text-sm md:text-base">
        {family.address}
      </p>
    </div>
  )
}

function CeremonySection() {
  return (
    <section className="relative px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
      {/* <FloralImage
        motif="branch-1"
        fadeDirection="left"
        className="absolute -left-10 top-10 h-full w-2/3 bg-rose/60 sm:w-1/2 md:w-2/5"
      /> */}
      <FloralImage
        motif="branch-2"
        className="absolute -left-6 -top-6 h-24 w-24 rotate-60 bg-rose sm:h-32 sm:w-32 md:h-40 md:w-40"
      />
      <FloralImage
        motif="branch-5"
        className="absolute -bottom-6 -left-6 h-24 w-24 rotate-120 bg-rose sm:h-32 sm:w-32 md:h-40 md:w-40"
      />
      <FloralImage
        motif="branch-1"
        className="absolute -bottom-7 left-30 h-24 w-24  bg-rose sm:h-32 sm:w-32 md:h-40 md:w-40"
      />
      <FloralImage
        motif="branch-3"
        className="absolute bottom-30 -right-6 h-24 w-24 bg-rose sm:h-32 sm:w-32 md:h-40 md:w-40"
      />
      <FloralImage
        motif="butterfly"
        className="absolute animate-butterfly-flutter left-[12%] top-16 h-7 w-7 bg-rose sm:h-9 sm:w-9"
      />
      <FloralImage
        motif="butterfly"
        className="absolute animate-butterfly-flutter-flipped right-[15%] top-32 h-6 w-6 bg-rose sm:h-8 sm:w-8"
      />
      <FloralImage
        motif="butterfly"
        className="absolute animate-butterfly-flutter bottom-16 left-[20%] h-5 w-5 bg-rose sm:h-7 sm:w-7"
      />
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Lễ Thành Hôn
        </p>
        <SectionDivider />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-8 md:gap-16">
          <FamilyBlock family={GROOM_FAMILY} />
          <FamilyBlock family={BRIDE_FAMILY} />
        </div>

        <p className="mx-auto mt-12 max-w-sm text-sm uppercase leading-relaxed tracking-widest text-ink-soft md:max-w-md md:text-base">
          Trân trọng báo tin
          <br />
          Lễ thành hôn của con chúng tôi
        </p>

        <h2 className="mt-6 whitespace-nowrap font-script text-3xl leading-snug text-name sm:text-4xl md:text-5xl">
          {GROOM_NAME_PREFIX} {COUPLE.groomShort}
        </h2>
        <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft md:text-sm">Út Nam</p>

        <span className="mt-4 block font-serif text-2xl text-gold md:text-3xl">&</span>

        <h2 className="mt-4 whitespace-nowrap font-script text-3xl leading-snug text-name sm:text-4xl md:text-5xl">
          {BRIDE_NAME_PREFIX} {COUPLE.brideShort}
        </h2>
        <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft md:text-sm">Út Nữ</p>

        <p className="mx-auto mt-10 max-w-sm text-sm uppercase leading-relaxed tracking-widest text-ink-soft md:max-w-md md:text-base">
          Hôn lễ được cử hành tại tư gia
        </p>

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Vào lúc
        </p>
        <p className="mt-2 text-ink uppercase text-xl ">{WEDDING_DATE.time}</p>

        <div className="mt-6 flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-ink-soft md:text-sm">
          <span>{WEDDING_DATE.weekday}</span>
          <span className="h-3 w-px bg-gold-light/60" />
          <span className='text-xl  md:text-5xl'>{WEDDING_DATE.day}</span>
          <span className="h-3 w-px bg-gold-light/60" />
          <span>Tháng {WEDDING_DATE.month}</span>
        </div>
        <p className="mt-2 font-light tracking-widest text-gold ">
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
        onError={fallbackToPlaceholder(photo.fallback)}
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
    <section className="relative px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
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
              className="group mx-auto w-full max-w-[270px] overflow-hidden rounded-lg border border-gold-light/40"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                onError={fallbackToPlaceholder(photo.fallback)}
                className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
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

const CALENDAR_WEEKDAY_HEADERS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

// Vietnamese calendars start the week on Thứ Hai (Mon); JS getDay() is 0=Sun.
function buildCalendarWeeks(year, month1Indexed) {
  const monthIndex0 = month1Indexed - 1
  const daysInMonth = new Date(year, monthIndex0 + 1, 0).getDate()
  const firstWeekdayJs = new Date(year, monthIndex0, 1).getDay()
  const firstWeekdayMonStart = (firstWeekdayJs + 6) % 7

  const cells = Array(firstWeekdayMonStart).fill(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function WeddingCalendar() {
  const year = Number(WEDDING_DATE.year)
  const month = Number(WEDDING_DATE.month)
  const highlightDay = Number(WEDDING_DATE.day)
  const weeks = buildCalendarWeeks(year, month)

  return (
    <div className="mx-auto mt-8 max-w-xs rounded-lg border border-gold-light/40 bg-cream p-4 shadow-sm">
      <p className="text-center font-light text-base text-ink md:text-lg">
        Tháng {month} / {year}
      </p>

      <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-medium uppercase tracking-wide text-gold md:text-xs">
        {CALENDAR_WEEKDAY_HEADERS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-2 space-y-2 border-t border-gold-light/40 pt-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 text-center text-xs md:text-sm">
            {week.map((day, dayIndex) => (
              <span key={dayIndex} className="flex h-9 items-center justify-center">
                {day === null ? null : day === highlightDay ? (
                  <span className="relative flex h-9 w-9 items-center justify-center text-red-600">
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute inset-0 h-full w-full"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 21s-7.5-4.6-10-9.1C.5 8.6 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.6 18 11.9 15.5 16.4 12 21 12 21z" />
                    </svg>
                    <span className="relative text-sm font-bold text-cream">{day}</span>
                  </span>
                ) : (
                  <span className="text-ink-soft">{day}</span>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function PartyInviteSection() {
  return (
    <section className="relative px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
      <FloralImage
        motif="branch-1"
        className="absolute -left-6 -top-6 h-48 w-24 bg-rose sm:h-32 sm:w-32 md:h-36 md:w-36 "
      />
      <FloralImage
        motif="branch-3"
        className="absolute -bottom-6 -right-6 h-24 w-24 bg-rose sm:h-32 sm:w-32 md:h-36 md:w-36"
      />
      <FloralImage
        motif="branch-1"
        className="absolute -right-4 -top-0 h-32 w-32 -scale-x-100 bg-rose sm:h-44 sm:w-44 md:h-56 md:w-56"
      />

      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Thông tin tiệc cưới
        </p>
        <SectionDivider />
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Tiệc cưới sẽ diễn ra vào lúc
        </p>
        <p className="mt-2 font-light text-ink text-xl">{TIMELINE[1].time}</p>

        <div className="mt-6 flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-ink-soft md:text-sm">
          <span>{WEDDING_DATE.weekday}</span>
          <span className="h-3 w-px bg-gold-light/60" />
          <span className='text-xl  md:text-5xl'>{WEDDING_DATE.day}</span>
          <span className="h-3 w-px bg-gold-light/60" />
          <span>Tháng {WEDDING_DATE.month}</span>
        </div>
        <p className="mt-2 font-light tracking-widest text-gold">
          {WEDDING_DATE.year}
        </p>
        <p className="mt-2 text-xs text-ink-soft md:text-sm">({WEDDING_DATE.lunar})</p>

        <div className="mt-8 flex items-center justify-center gap-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gold md:text-sm">
              {TIMELINE[0].label}
            </p>
            <p className="mt-1 text-lg font-light text-ink md:text-xl">{TIMELINE[0].time}</p>
          </div>
          <span className="h-8 w-px bg-gold-light/60" />
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gold md:text-sm">
              {TIMELINE[1].label}
            </p>
            <p className="mt-1 text-lg font-light text-ink md:text-xl">{TIMELINE[1].time}</p>
          </div>
        </div>
        <WeddingCalendar />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* SECTION 5 — ĐỊA ĐIỂM TỔ CHỨC                                          */
/* ------------------------------------------------------------------ */

function LocationSection() {
  const mapQuery = encodeURIComponent(`${RECEPTION.venue}, ${RECEPTION.address}`)
  const mapEmbedSrc = `https://www.google.com/maps?q=${mapQuery}&hl=vi&z=16&output=embed`
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

  return (
    <section className="relative px-6 py-16 sm:px-10 md:px-16 md:py-24">
      <FloralImage
        motif="branch-7"
        className="absolute top-6 -right-6 h-24 w-24 bg-rose sm:h-32 sm:w-32 md:h-40 md:w-40 rotate-280"
      />
      <div className="mx-auto max-w-2xl text-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
            Địa Điểm
          </p>
          <SectionDivider />

          <h2 className="mt-6 font-serif text-4xl text-ink md:text-5xl">{RECEPTION.venue}</h2>
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
            Bản đồ &amp; Chỉ đường
          </a>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-gold-light/40 shadow-sm">
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
    <section className="relative px-6 py-16 sm:px-10 md:px-16 md:py-24">
      <FloralImage
        motif="branch-1"
        className="absolute -left-8 top-1/2 h-40 w-32 -translate-y-1/2 bg-rose sm:h-56 sm:w-40 md:h-64 md:w-48"
      />
      <FloralImage
        motif="branch-6"
        className="absolute -right-8 top-1/2 h-40 w-32 -translate-y-1/2 rotate-330 bg-rose sm:h-56 sm:w-40 md:h-64 md:w-48"
      />
      <FloralImage
        motif="butterfly"
        className="absolute animate-butterfly-flutter right-[18%] top-8 h-8 w-8 bg-rose sm:h-10 sm:w-10"
      />
      <FloralImage
        motif="butterfly"
        className="absolute animate-butterfly-flutter-flipped bottom-10 left-[15%] h-6 w-6 bg-rose sm:h-8 sm:w-8"
      />
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Lịch Trình
        </p>
        <SectionDivider />
      </div>

      <ol className="mx-auto mt-12 max-w-md">
        {TIMELINE.map((item, index) => (
          <li key={item.time} className="flex gap-4 sm:gap-6">
            <span className="w-14 shrink-0 text-right font-light text-lg text-gold sm:w-16 md:text-xl">
              {item.time}
            </span>
            <span className="flex flex-col items-center">
              <span className="h-3 w-3 shrink-0 rounded-full bg-gold" />
              {index < TIMELINE.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-gold-light/50" />
              )}
            </span>
            <span
              className={`pt-0.5 text-left text-sm text-ink md:text-base ${index < TIMELINE.length - 1 ? 'pb-16 md:pb-20' : ''
                }`}
            >
              {item.label}
            </span>
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
    <section className="relative px-6 py-16 sm:px-10 md:px-16 md:py-24">
      <FloralImage
        motif="branch-3"
        className="absolute -bottom-6 -left-6 h-24 w-24 bg-rose sm:h-32 sm:w-32 md:h-40 md:w-40"
      />
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
          Sổ Lưu Bút
        </p>
        <SectionDivider />
        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-ink-soft md:max-w-md md:text-base">
          Gửi lời chúc phúc đến <span className="whitespace-nowrap">{COUPLE.groomShort} &amp;</span>{' '}
          <span className="whitespace-nowrap">{COUPLE.brideShort}</span>
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
/* SECTION 8 —  Gửi lời chúc yêu thương dành tặng                                  */
/* Phong bao đỏ-vàng kim truyền thống, tách biệt màu với phần còn lại     */
/* của thiệp — theo đúng phong tục lì xì/mừng cưới.                      */
/* ------------------------------------------------------------------ */

const ENVELOPE_RED = '#b91c1c'
const ENVELOPE_RED_DARK_1 = '#5c1612'
const ENVELOPE_RED_DARK_2 = '#6b1d18'
const ENVELOPE_RED_TEXTURE = '#7f1d1d'
const ENVELOPE_GOLD = '#fbbf24'
const ENVELOPE_GOLD_LIGHT = '#fde047'
const ENVELOPE_GOLD_DARK = '#d97706'
const ENVELOPE_GOLD_PALE = '#fef3c7'

function EnvelopeCoin({ size, style }) {
  return (
    <div
      className="animate-coin-float absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: ENVELOPE_GOLD,
        border: `2px solid ${ENVELOPE_GOLD_DARK}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        ...style,
      }}
    >
      <div
        className="absolute rounded-full"
        style={{ inset: 2, border: `2px solid ${ENVELOPE_GOLD_LIGHT}` }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: size * 0.28,
          height: size * 0.28,
          border: `2px solid ${ENVELOPE_GOLD_DARK}`,
          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  )
}

function EnvelopeCornerBracket({ className = '', rotate = 0 }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={ENVELOPE_GOLD}
      strokeWidth="2"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M2 2 L2 16 L6 16 L6 6 L16 6 L16 2 Z"
        opacity="0.85"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M6 10 L10 10 L10 6" opacity="0.85" strokeLinecap="square" />
    </svg>
  )
}

function GiftEnvelopeButton({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false)

  const handleClick = () => {
    if (isOpening) return
    setIsOpening(true)
    // Để hiệu ứng rung + bung mở (envelope-shake-open, ~0.6s) chạy xong
    // rồi mới thực sự hiện modal.
    window.setTimeout(() => {
      onOpen()
      setIsOpening(false)
    }, 600)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isOpening}
      aria-label="Mở phong bao mừng cưới"
      className="group relative mx-auto flex flex-col items-center outline-none disabled:cursor-default"
      style={{ width: 200, height: 256 }}
    >
      <div
        className={`relative flex h-full w-full items-center justify-center ${isOpening ? '' : 'animate-envelope-float'
          }`}
      >
        <div className="animate-glow-pulse absolute inset-0 rounded-full bg-amber-300/25 blur-2xl" />

        <EnvelopeCoin size={31} style={{ top: '5%', right: '5%', animationDelay: '0s' }} />
        <EnvelopeCoin size={25} style={{ top: '20%', left: '0%', animationDelay: '0.4s' }} />
        <EnvelopeCoin size={28} style={{ bottom: '20%', right: '0%', animationDelay: '0.8s' }} />
        <EnvelopeCoin size={22} style={{ bottom: '8%', left: '8%', animationDelay: '1.2s' }} />
        <EnvelopeCoin size={21} style={{ top: '45%', right: '-5%', animationDelay: '1.6s' }} />

        <span
          className="animate-sparkle absolute text-white"
          style={{ top: '8%', left: '20%', fontSize: 14, animationDelay: '0s' }}
        >
          ✦
        </span>
        <span
          className="animate-sparkle absolute text-white"
          style={{ bottom: '35%', right: '8%', fontSize: 11, animationDelay: '0.6s' }}
        >
          ✦
        </span>
        <span
          className="animate-sparkle absolute text-white"
          style={{ top: '40%', left: '3%', fontSize: 8, animationDelay: '1.2s' }}
        >
          ✦
        </span>

        <div
          className={`relative ${isOpening ? 'animate-envelope-open' : 'group-hover:animate-envelope-wobble'}`}
          style={{ width: 140, height: 196 }}>
          <div
            className="absolute rounded-b-lg"
            style={{
              left: 2,
              right: -2,
              bottom: -3,
              height: 196,
              backgroundColor: ENVELOPE_RED_DARK_1,
            }}
          />
          <div
            className="absolute rounded-r-lg"
            style={{ top: 2, bottom: -2, right: -3, width: 140, backgroundColor: ENVELOPE_RED_DARK_2 }}
          />

          <div
            className="absolute inset-0 overflow-hidden rounded-lg"
            style={{ backgroundColor: ENVELOPE_RED, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, transparent 11.2px, ${ENVELOPE_RED_TEXTURE} 11.2px, ${ENVELOPE_RED_TEXTURE} 11.9px)`,
                backgroundSize: '21px 21px',
                backgroundPosition: '10.5px 10.5px',
              }}
            />
            <div
              className="absolute inset-x-0 top-0"
              style={{ height: 4, backgroundColor: ENVELOPE_GOLD }}
            />

            <div
              className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-full shadow-lg"
              style={{
                width: 63,
                height: 63,
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, ${ENVELOPE_GOLD} 0%, ${ENVELOPE_GOLD_DARK} 100%)`,
                border: `3px solid ${ENVELOPE_GOLD_PALE}`,
              }}
            >
              <span
                className="font-bold"
                style={{
                  fontSize: 31,
                  color: ENVELOPE_RED,
                  lineHeight: 1,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                囍
              </span>
            </div>

            <EnvelopeCornerBracket className="absolute left-2 top-2" rotate={0} />
            <EnvelopeCornerBracket className="absolute right-2 top-2" rotate={90} />
            <EnvelopeCornerBracket className="absolute bottom-2 left-2" rotate={-90} />
            <EnvelopeCornerBracket className="absolute bottom-2 right-2" rotate={180} />
          </div>
        </div>
      </div>

      <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-ink-soft transition group-hover:text-ink">
        {isOpening ? 'Đang mở...' : 'Nhấn để mở'}
      </p>
    </button>
  )
}

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
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-cream sm:max-w-xl"
      >
        <div className="relative px-6 py-4" style={{ backgroundColor: ENVELOPE_RED }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-3 top-3 text-xl text-white/80 transition hover:text-white"
          >
            ✕
          </button>
          <h2
            className="font-serif text-2xl font-bold uppercase tracking-wide text-white"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
          >
            <span className="text-xl text-white md:text-2xl">♡</span>
          </h2>
        </div>

        <div className="flex flex-col items-center gap-6 p-6 text-center sm:flex-row sm:flex-wrap sm:items-start sm:justify-center">
          {GIFT_QR_CODES.map((qr) => (
            <div key={qr.id} className="flex max-w-[220px] flex-1 flex-col items-center">
              <p className="mb-2 min-h-[2rem] text-xs font-medium text-ink">
                {qr.role} - {qr.name}
              </p>
              <div className="flex h-44 w-44 items-center justify-center rounded-xl border-2 border-gold-light/40 bg-white p-2 shadow-lg sm:h-52 sm:w-52">
                <img
                  src={qr.src}
                  alt={`QR - ${qr.role} - ${qr.name}`}
                  onError={fallbackToPlaceholder(qr.fallback)}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-2 space-y-0.5 text-center">
                <p className="text-[10px] text-ink-soft">{qr.bank}</p>
                <p className="font-mono text-[10px] text-ink-soft">{qr.account}</p>
                <p className="text-[10px] font-semibold text-ink">{qr.name}</p>
              </div>
              <a
                href={qr.src}
                download={`qr-${qr.id}.png`}
                className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium text-gold-dark transition hover:bg-gold/10"
              >
                Lưu QR
              </a>
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
    <section className="relative px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
      <FloralImage
        motif="branch-5"
        className="absolute -right-6 -top-6 h-24 w-24 bg-rose/60 sm:h-28 sm:w-28"
      />
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold md:text-sm">
        Gửi lời chúc yêu thương dành tặng{' '}
        <span className="whitespace-nowrap">{COUPLE.groomShort} &amp;</span>{' '}
        <span className="whitespace-nowrap">{COUPLE.brideShort}</span>
      </p>
      <SectionDivider />
      <div className="mt-10">
        <GiftEnvelopeButton onOpen={() => setIsModalOpen(true)} />
      </div>

      <p className="mx-auto mt-10 max-w-sm text-sm leading-relaxed text-ink-soft md:max-w-md md:text-base">
        Sự hiện diện của quý quan khách <br />
        là niềm vinh hạnh của gia đình chúng tôi
      </p>

      {isModalOpen && <GiftModal onClose={() => setIsModalOpen(false)} />}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* FOOTER                                                               */
/* ------------------------------------------------------------------ */

function FooterSection() {
  return (
    <section className="relative px-6 py-16 text-center sm:px-10 md:px-16">
      <FloralImage
        motif="branch-6"
        className="absolute -top-6 left-1/2 h-24 w-24 -translate-x-1/2 bg-rose md:h-28 md:w-28"
      />

      <p className="mt-16 text-sm leading-relaxed text-ink-soft md:text-base">
        Rất hân hạnh được đón tiếp
      </p>
      <div className="mt-4 flex flex-col items-center gap-2 font-script text-3xl leading-snug text-name sm:flex-row sm:justify-center sm:gap-4 md:text-4xl">
        <span className="whitespace-nowrap">{COUPLE.groomShort}</span>
        <span className="text-xl text-gold md:text-2xl">♡</span>
        <span className="whitespace-nowrap">{COUPLE.brideShort}</span>
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold md:text-sm">
        {WEDDING_DATE.display}
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* APP — overlay mở thiệp, nhạc nền, auto-scroll                        */
/* ------------------------------------------------------------------ */

// Tạm thời ẩn màn hình khoá "Mở Thiệp" — đổi lại thành true để bật lại.
const ENABLE_OPENING_SCREEN = false
// Tạm thời ẩn section "Sổ Lưu Bút" — đổi lại thành true để bật lại.
const ENABLE_GUESTBOOK_SECTION = false

function App() {
  const audioRef = useRef(null)
  const userInteractedRef = useRef(false)
  const [isOpened, setIsOpened] = useState(!ENABLE_OPENING_SCREEN)
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
    if (!ENABLE_OPENING_SCREEN || !isOpened || userInteractedRef.current) return undefined

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
    <div className="min-h-screen w-full overflow-x-hidden bg-cream-dark">
      <div className="relative mx-auto max-w-3xl overflow-hidden bg-cream text-ink md:shadow-2xl">
        <audio ref={audioRef} src="/audio/my-love.mp3" loop preload="none" />

        <HeroSection
          showButton={ENABLE_OPENING_SCREEN && !isOpened}
          isClosing={isOverlayClosing}
          onOpen={handleOpenInvitation}
        />
        <CeremonySection />
        <GallerySection />
        <PartyInviteSection />
        <LocationSection />
        <TimelineSection />
        {ENABLE_GUESTBOOK_SECTION && <GuestbookSection />}
        <GiftSection />
        <FooterSection />
      </div>

      <MusicToggleButton isPlaying={isMusicPlaying} onToggle={toggleMusic} />
    </div>
  )
}

export default App
