import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import EditorialFrame from '../components/EditorialFrame'
import { ButtonLink } from '../components/Button'
import { getCategory, getProducts } from '../lib/api'
import { useSEO } from '../lib/useSEO'

export default function CollectionPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [category, setCategory] = useState(null)

  useSEO(category?.name || '', category?.description || '')
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | missing

  useEffect(() => {
    setStatus('loading')
    setCategory(null)
    setProducts([])

    Promise.all([
      getCategory(slug).catch(() => null),
      getProducts({ category: slug }).catch(() => []),
    ]).then(([cat, prods]) => {
      if (!cat) {
        setStatus('missing')
        return
      }
      setCategory(cat)
      setProducts(prods || [])
      setStatus('ready')
    })
  }, [slug])

  // ── 404 state ──────────────────────────────────────────────
  if (status === 'missing') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-32 text-center">
        <p className="font-sans text-xs tracked-wide text-gold-dim">COLLECTION</p>
        <h1 className="mt-4 font-display text-4xl font-light text-ivory">Collection not found</h1>
        <p className="mx-auto mt-4 max-w-sm font-sans text-sm text-ivory-dim">
          This collection may have been removed or renamed in the studio.
        </p>
        <div className="mt-8">
          <ButtonLink to="/shop" variant="outline">Explore All Pieces</ButtonLink>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-32 text-center md:px-10">
        {category?.image_url && (
          <div className="absolute inset-0 -z-10">
            <img
              src={category.image_url}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-obsidian/80" />
          </div>
        )}
        {!category?.image_url && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal to-obsidian" />
        )}

        <p className="font-sans text-xs tracked-wide text-gold-dim">THE COLLECTION</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-light text-ivory md:text-6xl">
          {status === 'loading' ? '' : category?.name}
        </h1>
        {category?.description && (
          <p className="mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-ivory-dim">
            {category.description}
          </p>
        )}
      </section>

      {/* ── Loading ─────────────────────────────────────────── */}
      {status === 'loading' && (
        <div className="py-24 text-center font-sans text-sm text-ivory-dim">
          Loading collection pieces…
        </div>
      )}

      {/* ── Products ────────────────────────────────────────── */}
      {status === 'ready' && products.length > 0 && (
        <div className="flex flex-col">
          {products.map((item, i) => {
            const thumb = item.product_images?.[0]?.image_url

            return (
              <Link
                key={item.id}
                to={`/shop/${item.slug}`}
                className="group grid grid-cols-1 border-t border-gold-dim/20 md:grid-cols-2"
              >
                <div className={`overflow-hidden ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={item.name_fr}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <EditorialFrame
                      number={item.position || i + 1}
                      aspect="aspect-[4/5]"
                      tone={i % 2 === 0 ? 'default' : 'ember'}
                    />
                  )}
                </div>
                <div className="flex flex-col items-start justify-center gap-4 px-6 py-16 md:px-16">
                  <span className="font-display text-lg text-gold-dim">
                    {String(item.position || i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display text-3xl font-light text-ivory transition-colors group-hover:text-gold md:text-4xl">
                    {item.name_fr}
                  </h2>
                  {item.name_en && (
                    <p className="font-display text-lg italic text-ivory-dim">{item.name_en}</p>
                  )}
                  {item.description && (
                    <p className="max-w-md font-sans text-sm leading-relaxed text-ivory-dim">
                      {item.description}
                    </p>
                  )}
                  {item.materials && (
                    <p className="font-sans text-xs tracked-wide text-gold-dim">
                      MATERIALS — {item.materials.toUpperCase()}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────── */}
      {status === 'ready' && products.length === 0 && (
        <div className="border-t border-gold-dim/20 px-6 py-28 text-center md:px-10">
          <p className="font-display text-2xl italic text-ivory-dim">
            No pieces currently listed in this collection.
          </p>
          <p className="mx-auto mt-4 max-w-md font-sans text-xs leading-relaxed text-ivory-dim/60">
            New work is added regularly. You can also commission a custom piece.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink to="/custom-creation" variant="outline">
              Request a Custom Piece
            </ButtonLink>
            <ButtonLink to="/shop" variant="ghost">
              Explore All Pieces
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  )
}
