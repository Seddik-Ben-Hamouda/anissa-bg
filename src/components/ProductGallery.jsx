import { useState, useEffect } from 'react'
import EditorialFrame from './EditorialFrame'

export default function ProductGallery({ images = [], title = '', fallbackNumber }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const validImages = Array.isArray(images) ? images.filter((img) => img?.image_url) : []
  const hasImages = validImages.length > 0
  const total = validImages.length

  function prev() {
    setActiveIndex((curr) => (curr === 0 ? total - 1 : curr - 1))
  }

  function next() {
    setActiveIndex((curr) => (curr === total - 1 ? 0 : curr + 1))
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (total <= 1 && !lightboxOpen) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape' && lightboxOpen) setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [total, lightboxOpen])

  if (!hasImages) {
    return <EditorialFrame number={fallbackNumber} aspect="aspect-[4/5] md:h-full" />
  }

  const activeImage = validImages[activeIndex] || validImages[0]

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Frame */}
      <div className="group relative aspect-[4/5] w-full overflow-hidden bg-charcoal border border-gold-dim/20">
        <img
          key={activeImage.image_url}
          src={activeImage.image_url}
          alt={title || `Image ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-all duration-500 ease-out cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        />

        {/* Counter Badge */}
        {total > 1 && (
          <div className="absolute top-4 left-4 bg-obsidian/75 backdrop-blur-sm border border-gold-dim/30 px-2.5 py-1 font-sans text-[10px] tracking-widest text-gold-dim">
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        )}

        {/* Zoom trigger button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 flex items-center justify-center h-8 w-8 rounded-full bg-obsidian/70 backdrop-blur-sm border border-gold-dim/30 text-ivory-dim opacity-0 transition-all duration-300 hover:text-gold hover:border-gold group-hover:opacity-100"
          aria-label="Zoom image"
          title="Click to expand"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>

        {/* Prev / Next navigation arrows */}
        {total > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 bg-obsidian/70 backdrop-blur-sm border border-gold-dim/30 text-ivory opacity-0 transition-all duration-200 hover:border-gold hover:text-gold hover:bg-obsidian/90 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 bg-obsidian/70 backdrop-blur-sm border border-gold-dim/30 text-ivory opacity-0 transition-all duration-200 hover:border-gold hover:text-gold hover:bg-obsidian/90 group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Selector Strip (shown only when > 1 image) */}
      {total > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {validImages.map((img, idx) => (
            <button
              key={img.id || img.image_url}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border transition-all duration-200 ${
                idx === activeIndex
                  ? 'border-gold shadow-sm shadow-gold/20 opacity-100 scale-[1.02]'
                  : 'border-gold-dim/25 opacity-60 hover:opacity-100 hover:border-gold-dim/60'
              }`}
            >
              <img src={img.image_url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-10 flex items-center justify-center h-10 w-10 rounded-full border border-gold-dim/30 bg-charcoal text-ivory transition-colors hover:border-gold hover:text-gold"
            aria-label="Close lightbox"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Lightbox Counter */}
          {total > 1 && (
            <div className="absolute top-6 left-6 font-display text-sm tracking-widest text-gold-dim">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
          )}

          {/* Active high-res photo */}
          <div className="relative max-h-[88vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImage.image_url}
              alt={title}
              className="max-h-[85vh] max-w-[85vw] object-contain border border-gold-dim/20 shadow-2xl"
            />
          </div>

          {/* Lightbox Prev / Next controls */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-12 w-12 rounded-full border border-gold-dim/30 bg-charcoal/80 text-ivory transition-colors hover:border-gold hover:text-gold"
                aria-label="Previous"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-12 w-12 rounded-full border border-gold-dim/30 bg-charcoal/80 text-ivory transition-colors hover:border-gold hover:text-gold"
                aria-label="Next"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
