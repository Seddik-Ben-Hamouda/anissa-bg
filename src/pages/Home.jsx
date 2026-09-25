import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/Button'
import EditorialFrame from '../components/EditorialFrame'
import { getCategories, getProducts } from '../lib/api'
import { useSEO } from '../lib/useSEO'

export default function Home() {
  useSEO('', 'Wearable healing art, sacred textiles, and one-of-one creations by Anissa BG.')
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => { })

    getProducts({ featured: true })
      .then((prods) => setFeaturedProducts(prods || []))
      .catch(() => { })
  }, [])

  const primaryCollection = categories.find((c) => c.type === 'collection') || categories[0]
  const secondaryCategories = categories.filter((c) => c.id !== primaryCollection?.id)

  return (
    <div>

      {/* Hero & Introduction — Continuous video covering both */}
      <section className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-obsidian">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover object-center scale-[1.02]"
            src="/images/hero-video.mp4"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-obsidian/40 to-obsidian" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-36 pb-20 text-center flex-1 flex flex-col justify-center items-center">
          <p className="font-sans text-xs tracked-wide text-gold-dim">SACRED ART OF HEALING</p>
          <h1 className="mt-6 font-display text-5xl font-light leading-tight text-ivory md:text-7xl">
            Anissa&nbsp;BG
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-display text-xl italic text-ivory-dim md:text-2xl">
            Art · Nature · Healing
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <ButtonLink
              to={primaryCollection ? `/collection/${primaryCollection.slug}` : '/shop'}
              variant="outline"
            >
              Discover the Collection
            </ButtonLink>
          </div>
        </div>

        {/* Introduction Quote seamlessly over the video */}
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center md:px-10">
          <p className="font-display text-2xl italic leading-relaxed text-ivory-dim md:text-3xl">
            Every piece is a meeting point between the body, the earth, and the sacred — created by
            hand, worn as ceremony, lived as art.
          </p>
        </div>
      </section>

      {/* Primary Featured Collection */}
      <section className="grid grid-cols-1 gap-0 border-t border-gold-dim/20 md:grid-cols-2">
        <div className="order-2 flex flex-col items-start justify-center gap-6 px-6 py-20 md:order-1 md:px-16">
          <p className="font-sans text-xs tracked-wide text-gold-dim">THE COLLECTION</p>
          <h2 className="font-display text-4xl font-light text-ivory md:text-5xl">
            {primaryCollection?.name || 'Ceremonial Collection'}
          </h2>
          <p className="max-w-md font-sans text-sm leading-relaxed text-ivory-dim">
            {primaryCollection?.description ||
              'A journey through unique works of ceremonial art, each one a stage in the awakening of spirit and form.'}
          </p>
          <ButtonLink
            to={primaryCollection ? `/collection/${primaryCollection.slug}` : '/shop'}
            variant="ghost"
          >
            Explore the Collection
          </ButtonLink>
        </div>
        <div className="order-1 md:order-2 overflow-hidden bg-charcoal">
          {primaryCollection?.image_url ? (
            <img
              src={primaryCollection.image_url}
              alt={primaryCollection.name}
              loading="lazy"
              decoding="async"
              className="aspect-square md:h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <EditorialFrame label={primaryCollection?.name || 'Collection'} aspect="aspect-square md:h-full" />
          )}
        </div>
      </section>

      {/* Featured Pieces (if any exist) */}
      {featuredProducts.length > 0 && (
        <section className="border-t border-gold-dim/20 px-6 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="font-sans text-xs tracked-wide text-gold-dim">SELECTION</p>
                <h2 className="mt-3 font-display text-4xl font-light text-ivory">
                  Featured Pieces
                </h2>
              </div>
              <ButtonLink to="/shop" variant="ghost">
                View all shop pieces
              </ButtonLink>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((p) => {
                const thumb = p.product_images?.[0]?.image_url
                return (
                  <Link key={p.id} to={`/shop/${p.slug}`} className="group block">
                    <div className="overflow-hidden aspect-[3/4] bg-charcoal border border-gold-dim/20">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={p.name_fr}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <EditorialFrame aspect="aspect-[3/4]" />
                      )}
                    </div>
                    <p className="mt-4 font-display text-lg text-ivory transition-colors group-hover:text-gold">
                      {p.name_fr}
                    </p>
                    {p.categories?.name && (
                      <p className="font-sans text-xs tracked text-gold-dim">
                        {p.categories.name.toUpperCase()}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Explore Categories */}
      {secondaryCategories.length > 0 && (
        <section className="px-6 py-24 md:px-10 border-t border-gold-dim/20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="font-sans text-xs tracked-wide text-gold-dim">EXPLORE</p>
                <h2 className="mt-3 font-display text-4xl font-light text-ivory">
                  Studio Categories
                </h2>
              </div>
              <ButtonLink to="/shop" variant="ghost">
                See all
              </ButtonLink>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {secondaryCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.type === 'collection' ? `/collection/${cat.slug}` : `/shop`}
                  className="group block"
                >
                  <div className="overflow-hidden aspect-[3/4] bg-charcoal border border-gold-dim/20">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <EditorialFrame aspect="aspect-[3/4]" />
                    )}
                  </div>
                  <p className="mt-4 font-display text-lg text-ivory group-hover:text-gold transition-colors">
                    {cat.name}
                  </p>
                  <p className="font-sans text-[10px] tracking-wider text-gold-dim/70 uppercase">
                    {cat.type}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Threads of Light service */}
      <section className="border-t border-gold-dim/20 px-6 py-28 text-center md:px-10">
        <p className="font-sans text-xs tracked-wide text-gold-dim">THREADS OF LIGHT</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-light text-ivory md:text-5xl">
          Personal Alchemy Session
        </h2>
        <p className="mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-ivory-dim">
          A one-on-one space for self-discovery, reflection, and inner alignment — where a healing
          session becomes a creative ritual, and art takes form as a living extension of your soul.
        </p>
        <div className="mt-10">
          <ButtonLink to="/services" variant="outline">
            Request Your Session
          </ButtonLink>
        </div>
      </section>

      {/* About teaser */}
      <section className="grid grid-cols-1 border-t border-gold-dim/20 md:grid-cols-2">
        <div className="relative overflow-hidden aspect-square md:aspect-auto md:min-h-[500px]">
          <img
            src="/images/About Page/about.webp"
            alt="Anissa BG — The Artist"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent 70%, rgba(11, 9, 6, 0.35))',
            }}
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-6 px-6 py-20 md:px-16">
          <p className="font-sans text-xs tracked-wide text-gold-dim">THE ARTIST</p>
          <h2 className="font-display text-4xl font-light text-ivory">About Anissa</h2>
          <p className="max-w-md font-sans text-sm leading-relaxed text-ivory-dim">
            Mystic artist, textile alchemist, and Reiki master — Anissa's work is guided by the
            laws of nature: the moon, the sea, and the quiet act of purification.
          </p>
          <ButtonLink to="/about" variant="ghost">
            Discover the Story
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
