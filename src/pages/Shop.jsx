import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EditorialFrame from '../components/EditorialFrame'
import { getCategories, getProducts } from '../lib/api'
import { useSEO } from '../lib/useSEO'

export default function Shop() {
  useSEO(
    'Shop All Pieces',
    'Explore wearable healing art, sacred textile creations, and unique fashion pieces.'
  )
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    getCategories('shop')
      .then(setCategories)
      .catch(() => {})
  }, [])

  useEffect(() => {
    setStatus('loading')
    getProducts(activeCategory ? { category: activeCategory } : {})
      .then((data) => {
        setProducts(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [activeCategory])

  return (
    <div className="px-6 py-32 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-sans text-xs tracked-wide text-gold-dim">SHOP</p>
          <h1 className="mt-4 font-display text-5xl font-light text-ivory md:text-6xl">
            All Pieces
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-sans text-sm text-ivory-dim">
            Every piece is made to order. There is no cart — request the piece that speaks to you,
            and we'll be in touch.
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory(null)}
            className={`border px-5 py-2 font-sans text-xs tracked transition-colors ${
              activeCategory === null
                ? 'border-gold bg-gold text-obsidian'
                : 'border-ivory/20 text-ivory-dim hover:border-gold/60'
            }`}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`border px-5 py-2 font-sans text-xs tracked transition-colors ${
                activeCategory === cat.slug
                  ? 'border-gold bg-gold text-obsidian'
                  : 'border-ivory/20 text-ivory-dim hover:border-gold/60'
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Category Visual Cards (when viewing all) */}
        {activeCategory === null && categories.some((c) => c.image_url) && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {categories.filter((c) => c.image_url).map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.slug)}
                className="group relative aspect-[16/10] overflow-hidden border border-gold-dim/20 bg-charcoal text-left"
              >
                <img src={c.image_url} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <p className="font-display text-sm text-ivory group-hover:text-gold transition-colors">{c.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Active Category Banner */}
        {activeCategory && (() => {
          const activeCat = categories.find((c) => c.slug === activeCategory)
          if (!activeCat) return null
          return (
            <div className="relative mt-8 overflow-hidden border border-gold-dim/20 bg-charcoal">
              {activeCat.image_url && (
                <div className="absolute inset-0 opacity-20">
                  <img src={activeCat.image_url} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="relative z-10 px-6 py-8 text-center">
                <h2 className="font-display text-2xl text-ivory">{activeCat.name}</h2>
                {activeCat.description && (
                  <p className="mx-auto mt-2 max-w-lg font-sans text-xs text-ivory-dim">{activeCat.description}</p>
                )}
              </div>
            </div>
          )
        })()}

        {/* Product grid */}
        <div className="mt-16">
          {status === 'loading' && (
            <p className="text-center font-sans text-sm text-ivory-dim">Loading pieces…</p>
          )}
          {status === 'error' && (
            <p className="text-center font-sans text-sm text-ivory-dim">
              We couldn't reach the studio just now. Please try again shortly.
            </p>
          )}
          {status === 'ready' && products.length === 0 && (
            <p className="text-center font-sans text-sm text-ivory-dim">
              No pieces in this category yet — new work is added regularly.
            </p>
          )}
          {status === 'ready' && products.length > 0 && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Link key={product.id} to={`/shop/${product.slug}`} className="group block">
                  {product.product_images?.[0] ? (
                    <img
                      src={product.product_images[0].image_url}
                      alt={product.name_fr}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  ) : (
                    <EditorialFrame aspect="aspect-[3/4]" />
                  )}
                  <p className="mt-4 font-display text-lg text-ivory transition-colors group-hover:text-gold">
                    {product.name_fr}
                  </p>
                  {product.categories?.name && (
                    <p className="font-sans text-xs tracked text-gold-dim">
                      {product.categories.name.toUpperCase()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
