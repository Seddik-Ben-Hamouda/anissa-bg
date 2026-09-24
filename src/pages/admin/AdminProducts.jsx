import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '../../context/AdminContext'
import {
  getAdminProducts, createProduct, updateProduct, deleteProduct,
  addProductImage, deleteProductImage, uploadImage,
  getPublicCategories,
} from '../../lib/adminApi'

const EMPTY_FORM = {
  name_fr: '', name_en: '', slug: '', description: '', symbolism: '',
  materials: '', size_info: '', price: '', price_on_request: true,
  available: true, featured: false, position: 0, category_id: '',
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

function Badge({ children, variant = 'gold' }) {
  const classes = {
    gold: 'bg-gold/10 text-gold border-gold/20',
    dim: 'bg-charcoal-light text-ivory-dim border-gold-dim/20',
    green: 'bg-green-900/30 text-green-400 border-green-800/40',
    red: 'bg-ember/10 text-ember-bright border-ember/20',
  }
  return (
    <span className={`inline-flex items-center border px-1.5 py-0.5 font-sans text-[9px] tracked-wide ${classes[variant]}`}>
      {children}
    </span>
  )
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-obsidian/80 backdrop-blur-sm p-4 pt-10">
      <div className="relative w-full max-w-2xl border border-gold-dim/30 bg-charcoal shadow-2xl">
        <div className="flex items-center justify-between border-b border-gold-dim/20 px-6 py-4">
          <h3 className="font-display text-xl text-ivory">{title}</h3>
          <button onClick={onClose} className="text-ivory-dim/60 transition-colors hover:text-ivory" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block font-sans text-[10px] tracked-wide text-gold-dim">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gold-dim/30 bg-charcoal-light px-3 py-2.5 font-sans text-sm text-ivory placeholder-ivory-dim/30 outline-none transition-colors focus:border-gold'
const textareaCls = `${inputCls} resize-y min-h-[80px]`

function normalizeProduct(data) {
  const base = { ...EMPTY_FORM, ...data }
  const out = {}
  Object.keys(base).forEach((k) => {
    out[k] = base[k] === null || base[k] === undefined ? '' : base[k]
  })
  if (out.price_on_request === '') out.price_on_request = true
  if (out.available === '') out.available = true
  if (out.featured === '') out.featured = false
  return out
}

function ProductForm({ initial, categories, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() => normalizeProduct(initial))
  const [autoSlug, setAutoSlug] = useState(!initial?.slug)

  function set(key, val) {
    setForm((f) => {
      const next = { ...f, [key]: val }
      if (key === 'name_fr' && autoSlug) next.slug = slugify(val)
      return next
    })
  }

  function handleSlugChange(v) {
    setAutoSlug(false)
    set('slug', v)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form }
    if (payload.price === '' || payload.price === null) delete payload.price
    else payload.price = Number(payload.price)
    if (!payload.category_id) delete payload.category_id
    onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="NAME (FR) *">
          <input required className={inputCls} value={form.name_fr} onChange={(e) => set('name_fr', e.target.value)} placeholder="La Robe de la Graine" />
        </Field>
        <Field label="NAME (EN)">
          <input className={inputCls} value={form.name_en} onChange={(e) => set('name_en', e.target.value)} placeholder="The Seed" />
        </Field>
      </div>
      <Field label="SLUG *">
        <input required className={inputCls} value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} placeholder="la-robe-de-la-graine" />
      </Field>
      <Field label="CATEGORY">
        <select className={inputCls} value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
          <option value="">— None —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
          ))}
        </select>
      </Field>
      <Field label="DESCRIPTION">
        <textarea className={textareaCls} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </Field>
      <Field label="SYMBOLISM">
        <textarea className={textareaCls} value={form.symbolism} onChange={(e) => set('symbolism', e.target.value)} />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="MATERIALS">
          <input className={inputCls} value={form.materials} onChange={(e) => set('materials', e.target.value)} />
        </Field>
        <Field label="SIZE INFO">
          <input className={inputCls} value={form.size_info} onChange={(e) => set('size_info', e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="PRICE (€)">
          <input type="number" min="0" className={inputCls} value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="450" />
        </Field>
        <Field label="POSITION">
          <input type="number" className={inputCls} value={form.position} onChange={(e) => set('position', Number(e.target.value))} />
        </Field>
        <Field label="PRICE ON REQUEST">
          <div className="flex h-10 items-center">
            <input type="checkbox" id="price-req" checked={form.price_on_request} onChange={(e) => set('price_on_request', e.target.checked)} className="accent-gold" />
            <label htmlFor="price-req" className="ml-2 font-sans text-xs text-ivory-dim">Yes</label>
          </div>
        </Field>
        <Field label="AVAILABLE">
          <div className="flex h-10 items-center">
            <input type="checkbox" id="avail" checked={form.available} onChange={(e) => set('available', e.target.checked)} className="accent-gold" />
            <label htmlFor="avail" className="ml-2 font-sans text-xs text-ivory-dim">Yes</label>
          </div>
        </Field>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="accent-gold" />
        <label htmlFor="featured" className="font-sans text-xs text-ivory-dim">Featured product</label>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-gold-dim/20">
        <button type="button" onClick={onCancel} className="border border-gold-dim/30 px-5 py-2.5 font-sans text-xs tracked text-ivory-dim transition-colors hover:border-gold hover:text-ivory">
          CANCEL
        </button>
        <button type="submit" disabled={saving} className="border border-gold/40 bg-gold/10 px-5 py-2.5 font-sans text-xs tracked text-gold transition-colors hover:bg-gold/20 disabled:opacity-50">
          {saving ? 'SAVING…' : 'SAVE PRODUCT'}
        </button>
      </div>
    </form>
  )
}

function ImageManager({ product, token, onDone }) {
  const [images, setImages] = useState(product.product_images || [])
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const fileRef = useRef()

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadErr('')
    try {
      const data = await uploadImage(token, file)
      const img = await addProductImage(token, product.id, data.url, images.length)
      setImages((prev) => [...prev, img])
    } catch (err) {
      setUploadErr(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleDelete(img) {
    if (!window.confirm('Remove this image?')) return
    try {
      await deleteProductImage(token, product.id, img.id)
      setImages((prev) => prev.filter((i) => i.id !== img.id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <p className="mb-4 font-sans text-[10px] tracked-wide text-gold-dim">IMAGES FOR: {product.name_fr}</p>
      <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative border border-gold-dim/20 bg-charcoal-light">
            <img src={img.image_url} alt="" className="aspect-[3/4] w-full object-cover" />
            <button
              onClick={() => handleDelete(img)}
              className="absolute right-1 top-1 hidden rounded-full bg-ember/80 p-1 text-ivory group-hover:flex items-center justify-center transition-colors hover:bg-ember"
              aria-label="Delete image"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <p className="px-1 py-0.5 font-sans text-[9px] text-ivory-dim/50">pos {img.position}</p>
          </div>
        ))}
        {/* Upload zone */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[3/4] flex-col items-center justify-center gap-2 border border-dashed border-gold-dim/30 bg-charcoal-light text-ivory-dim/50 transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
        >
          {uploading ? (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="font-sans text-[9px] tracked-wide">UPLOAD</span>
            </>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
      </div>
      {uploadErr && <p className="mb-3 font-sans text-xs text-ember-bright">{uploadErr}</p>}
      <p className="font-sans text-[10px] text-ivory-dim/40">JPEG, PNG or WebP · max 10MB</p>
      <div className="mt-4 flex justify-end">
        <button onClick={onDone} className="border border-gold/40 bg-gold/10 px-5 py-2.5 font-sans text-xs tracked text-gold transition-colors hover:bg-gold/20">
          DONE
        </button>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const { session } = useAdmin()
  const token = session?.token

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modal, setModal] = useState(null) // null | { mode: 'create'|'edit'|'images', product?: obj }
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!token) return
    Promise.all([getAdminProducts(token), getPublicCategories(token)])
      .then(([prods, cats]) => {
        setProducts(prods || [])
        setCategories(cats || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  async function handleSave(payload) {
    setSaving(true)
    try {
      if (modal.mode === 'create') {
        const created = await createProduct(token, payload)
        setProducts((prev) => [created, ...prev])
      } else {
        const updated = await updateProduct(token, modal.product.id, payload)
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      }
      setModal(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product) {
    const hasImages = product.product_images?.length > 0
    const msg = `Delete "${product.name_fr}"?${hasImages ? '\n\nNote: images will be unlinked (files remain in storage).' : ''}`
    if (!window.confirm(msg)) return
    try {
      await deleteProduct(token, product.id)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.name_fr?.toLowerCase().includes(q) ||
      p.name_en?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q) ||
      p.categories?.name?.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-[10px] tracked-wide text-gold-dim">CATALOGUE</p>
          <h2 className="mt-1 font-display text-3xl font-light text-ivory">Products</h2>
        </div>
        <button
          id="create-product-btn"
          onClick={() => setModal({ mode: 'create' })}
          className="flex items-center gap-2 border border-gold/40 bg-gold/10 px-5 py-2.5 font-sans text-xs tracked text-gold transition-colors hover:bg-gold/20"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          NEW PRODUCT
        </button>
      </div>

      {/* Search */}
      <div className="mb-5 relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-dim/50" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full border border-gold-dim/20 bg-charcoal py-2.5 pl-9 pr-4 font-sans text-sm text-ivory placeholder-ivory-dim/30 outline-none transition-colors focus:border-gold sm:max-w-xs"
        />
      </div>

      {loading && <p className="font-sans text-sm text-ivory-dim">Loading…</p>}
      {error && <p className="font-sans text-sm text-ember-bright">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gold-dim/20">
                {['Image', 'Name', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="pb-3 pr-4 text-left font-sans text-[9px] tracked-wide text-gold-dim first:pl-0">{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const thumb = p.product_images?.[0]?.image_url
                return (
                  <tr key={p.id} className="group border-b border-gold-dim/10 transition-colors hover:bg-charcoal-light/50">
                    <td className="py-3 pr-4">
                      {thumb ? (
                        <img src={thumb} alt={p.name_fr} className="h-12 w-9 object-cover border border-gold-dim/20" />
                      ) : (
                        <div className="flex h-12 w-9 items-center justify-center border border-dashed border-gold-dim/20 bg-charcoal-light">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-dim/40">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-display text-sm text-ivory">{p.name_fr}</p>
                      {p.name_en && <p className="font-sans text-[10px] text-ivory-dim/50">{p.name_en}</p>}
                      <p className="font-sans text-[9px] text-gold-dim/60">{p.slug}</p>
                    </td>
                    <td className="py-3 pr-4">
                      {p.categories ? (
                        <span className="font-sans text-xs text-ivory-dim">{p.categories.name}</span>
                      ) : (
                        <span className="font-sans text-[10px] text-ivory-dim/30">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {p.price_on_request ? (
                        <Badge variant="dim">ON REQUEST</Badge>
                      ) : p.price != null ? (
                        <span className="font-sans text-sm text-ivory">€{p.price}</span>
                      ) : (
                        <span className="font-sans text-[10px] text-ivory-dim/30">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant={p.available ? 'green' : 'red'}>{p.available ? 'AVAILABLE' : 'HIDDEN'}</Badge>
                        {p.featured && <Badge variant="gold">FEATURED</Badge>}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          title="Manage images"
                          onClick={() => setModal({ mode: 'images', product: p })}
                          className="border border-gold-dim/20 p-1.5 text-gold-dim transition-colors hover:border-gold hover:text-gold"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                          </svg>
                        </button>
                        <button
                          title="Edit"
                          onClick={() => setModal({ mode: 'edit', product: p })}
                          className="border border-gold-dim/20 p-1.5 text-gold-dim transition-colors hover:border-gold hover:text-gold"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
                          </svg>
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(p)}
                          className="border border-ember/20 p-1.5 text-ember/60 transition-colors hover:border-ember hover:text-ember-bright"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center font-display text-lg text-ivory-dim/30">
                    {search ? 'No products match your search.' : 'No products yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {modal?.mode === 'create' && (
        <Modal title="New Product" onClose={() => setModal(null)}>
          <ProductForm categories={categories} onSave={handleSave} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}
      {modal?.mode === 'edit' && (
        <Modal title={`Edit — ${modal.product.name_fr}`} onClose={() => setModal(null)}>
          <ProductForm initial={modal.product} categories={categories} onSave={handleSave} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}
      {modal?.mode === 'images' && (
        <Modal title="Product Images" onClose={() => setModal(null)}>
          <ImageManager product={modal.product} token={token} onDone={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
