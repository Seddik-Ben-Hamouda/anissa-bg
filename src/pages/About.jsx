import { ButtonLink } from '../components/Button'
import { useSEO } from '../lib/useSEO'

export default function About() {
  useSEO(
    'About the Artist',
    'Discover the story of Anissa BG — mystic artist, textile alchemist, and Reiki master.'
  )
  return (
    <div>
      {/* ── Hero: full-bleed split — photo left, text right ── */}
      <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: '90vh' }}>
        <div className="relative overflow-hidden" style={{ minHeight: '60vw', maxHeight: '90vh' }}>
          <img
            src="/images/About Page/about-1.avif"
            alt="Anissa BG — artist and textile alchemist"
            fetchPriority="high"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
          {/* subtle gold vignette on right edge to blend into text panel */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, transparent 60%, rgba(11,9,6,0.55))',
            pointerEvents: 'none',
          }} />
        </div>

        <div className="flex flex-col justify-center gap-6 px-6 py-20 md:px-16"
          style={{ background: 'var(--color-obsidian)' }}>
          <p className="font-sans text-xs tracked-wide text-gold-dim">THE ARTIST</p>
          <h1 className="font-display text-4xl font-light text-ivory md:text-5xl">
            Anissa BG
          </h1>
          <p className="font-display text-xl italic text-ivory-dim">
            Mystic Artist · Textile Alchemist · Reiki Master
          </p>
          <p className="font-sans text-sm leading-relaxed text-ivory-dim" style={{ maxWidth: '38ch' }}>
            Anissa's work lives at the intersection of art, nature, and healing. Each piece
            begins not as a garment or object, but as a ritual — a conversation between fiber,
            intention, and the natural laws that shape it.
          </p>
        </div>
      </section>

      {/* ── Photo mosaic: 3-up ── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '3px',
        height: 'clamp(420px, 65vh, 720px)',
      }}>
        {/* Large left photo — spans 2 rows */}
        <div style={{ gridRow: '1 / 3', overflow: 'hidden', position: 'relative' }}>
          <img
            src="/images/About Page/about-2.avif"
            alt="Anissa at work — textile ritual"
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </div>
        {/* Top right */}
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <img
            src="/images/About Page/about-3.avif"
            alt="Sacred materials — wool and crystal"
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </div>
        {/* Bottom right */}
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <img
            src="/images/About Page/about-4.avif"
            alt="Healing through form — textile alchemy"
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </div>
      </section>

      {/* ── Full-width cinematic photo ── */}
      <section style={{ height: 'clamp(320px, 50vh, 600px)', overflow: 'hidden', position: 'relative' }}>
        <img
          src="/images/About Page/about-5.avif"
          alt="The sacred art of healing — Anissa BG"
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            display: 'block',
          }}
        />
        {/* gradient overlay for legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(11,9,6,0.15) 0%, rgba(11,9,6,0.55) 100%)',
          pointerEvents: 'none',
        }} />
        <blockquote style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '640px',
          textAlign: 'center',
          color: 'var(--color-ivory)',
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          letterSpacing: '0.02em',
          lineHeight: 1.4,
          margin: 0,
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}>
          "Art as a living, healing form."
        </blockquote>
      </section>

      {/* ── Philosophy text ── */}
      <section className="mx-auto max-w-2xl px-6 py-24 md:px-10">
        <p className="font-sans text-sm leading-relaxed text-ivory-dim">
          Her practice draws on felting and Hijama alike as expressions of the same
          principle: purification, and the quiet rhythm of the moon and sea guiding what is
          released and what is formed. Wool, silk, and crystal are chosen not for their
          appearance alone, but for what they carry.
        </p>
        <p className="mt-6 font-sans text-sm leading-relaxed text-ivory-dim">
          Every collection, from Le Féminin Sacré to Threads of Light, is an extension of this
          same philosophy — art as a living, healing form.
        </p>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-gold-dim/20 px-6 py-20 text-center md:px-10">
        <p className="font-display text-2xl italic text-ivory-dim">
          Threads of Light — Personal Alchemy Sessions
        </p>
        <div className="mt-8">
          <ButtonLink to="/services" variant="outline">
            Learn About Sessions
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}

