import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '../../context/AdminContext'
import {
  getPublicCategories, createCategory, updateCategory, deleteCategory,
  getAdminProducts, uploadImage,
} from '../../lib/adminApi'

const EMPTY = { name: '', slug: '', type: 'shop', description: '', image_url: '', position: 0 }

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

const inputCls = 'w-full border border-gold-dim/30 bg-charcoal-light px-3 py-2.5 font-sans text-sm text-ivory placeholder-ivory-dim/30 outline-none transition-colors focus:border-gold'

function normalize(data) {
  const base = { ...EMPTY, ...data }
  const out = {}
  Object.keys(base).forEach((k) => {
    out[k] = base[k] === null || base[k] === undefined ? '' : base[k]
  })
  return out
}

function CategoryForm({ initial, onSave, onCancel, saving, token }) {
  const [form, setForm] = useState(() => normalize(initial))
  const [autoSlug, setAutoSlug] = useState(!initial?.slug)
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const fileRef = useRef()

  function set(key, val) {
    setForm((f) => {
      const next = { ...f, [key]: val }
      if (key === 'name' && autoSlug) next.slug = slugify(val)
      return next
    })
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadErr('')
    try {
      const data = await uploadImage(token, file, 'categories')
      set('image_url', data.url)
    } catch (err) {
      setUploadErr(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      name: (form.name || '').trim(),
      slug: (form.slug || '').trim(),
      type: form.type,
      description: form.description ? form.description.trim() : null,
      image_url: form.image_url ? form.image_url.trim() : null,
      position: Number(form.position) || 0,
    }
    onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-sans text-[10px] tracked-wide text-gold-dim">NAME *</label>
          <input required className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Bags" />
        </div>
        <div>
          <label className="mb-1.5 block font-sans text-[10px] tracked-wide text-gold-dim">SLUG *</label>
          <input required className={inputCls} value={form.slug}
            onChange={(e) => { setAutoSlug(false); set('slug', e.target.value) }}
            placeholder="bags"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-sans text-[10px] tracked-wide text-gold-dim">TYPE *</label>
          <select required className={inputCls} value={form.type} onChange={(e) => set('type', e.target.value)}>
            <option value="shop">shop</option>
            <option value="collection">collection</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block font-sans text-[10px] tracked-wide text-gold-dim">POSITION</label>
          <input type="number" className={inputCls} value={form.position} onChange={(e) => set('position', Number(e.target.value))} />
        </div>
      </div>

      {/* Category Image */}
      <div>
        <label className="mb-1.5 block font-sans text-[10px] tracked-wide text-gold-dim">COVER IMAGE</label>
        <div className="flex items-center gap-4">
          {form.image_url ? (
            <div className="relative group h-20 w-24 shrink-0 overflow-hidden border border-gold-dim/30 bg-charcoal-light">
              <img src={form.image_url} alt="Cover preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => set('image_url', '')}
                className="absolute inset-0 flex items-center justify-center bg-obsidian/75 text-ember-bright opacity-0 transition-opacity group-hover:opacity-100"
                title="Remove image"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex h-20 w-24 shrink-0 flex-col items-center justify-center gap-1 border border-dashed border-gold-dim/30 bg-charcoal-light text-ivory-dim/50 transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
            >
              {uploading ? (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="font-sans text-[9px] tracked-wide">UPLOAD</span>
                </>
              )}
            </button>
          )}

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Or paste image URL…"
                className={inputCls}
                value={form.image_url || ''}
                onChange={(e) => set('image_url', e.target.value)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="whitespace-nowrap border border-gold-dim/30 px-3 py-2.5 font-sans text-xs text-gold-dim transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Browse'}
              </button>
            </div>
            {uploadErr && <p className="font-sans text-[11px] text-ember-bright">{uploadErr}</p>}
            <p className="font-sans text-[10px] text-ivory-dim/40">JPEG, PNG, WebP · max 10MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block font-sans text-[10px] tracked-wide text-gold-dim">DESCRIPTION</label>
        <textarea className={`${inputCls} resize-y min-h-[72px]`} value={form.description || ''} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-gold-dim/20">
        <button type="button" onClick={onCancel} className="border border-gold-dim/30 px-5 py-2.5 font-sans text-xs tracked text-ivory-dim transition-colors hover:border-gold hover:text-ivory">
          CANCEL
        </button>
        <button type="submit" disabled={saving || uploading} className="border border-gold/40 bg-gold/10 px-5 py-2.5 font-sans text-xs tracked text-gold transition-colors hover:bg-gold/20 disabled:opacity-50">
          {saving ? 'SAVING…' : 'SAVE'}
        </button>
      </div>
    </form>
  )
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg border border-gold-dim/30 bg-charcoal shadow-2xl">
        <div className="flex items-center justify-between border-b border-gold-dim/20 px-6 py-4">
          <h3 className="font-display text-xl text-ivory">{title}</h3>
          <button onClick={onClose} className="text-ivory-dim/60 transition-colors hover:text-ivory">
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

export default function AdminCategories() {
  const { session } = useAdmin()
  const token = session?.token

  const [categories, setCategories] = useState([])
  const [productCounts, setProductCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | { mode: 'create'|'edit', cat? }
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!token) return
    Promise.all([getPublicCategories(token), getAdminProducts(token)])
      .then(([cats, prods]) => {
        setCategories(cats || [])
        // Build count map
        const counts = {}
        ;(prods || []).forEach((p) => {
          if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1
        })
        setProductCounts(counts)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  async function handleSave(payload) {
    setSaving(true)
    try {
      if (modal.mode === 'create') {
        const created = await createCategory(token, payload)
        setCategories((prev) => [...prev, created])
      } else {
        const updated = await updateCategory(token, modal.cat.id, payload)
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      }
      setModal(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(cat) {
    const count = productCounts[cat.id] || 0
    const warning = count > 0
      ? `⚠️ This category contains ${count} product(s). Deleting it will set their category to "None".\n\nDelete "${cat.name}" anyway?`
      : `Delete category "${cat.name}"?`
    if (!window.confirm(warning)) return
    try {
      await deleteCategory(token, cat.id)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-[10px] tracked-wide text-gold-dim">ORGANISATION</p>
          <h2 className="mt-1 font-display text-3xl font-light text-ivory">Categories</h2>
        </div>
        <button
          id="create-category-btn"
          onClick={() => setModal({ mode: 'create' })}
          className="flex items-center gap-2 border border-gold/40 bg-gold/10 px-5 py-2.5 font-sans text-xs tracked text-gold transition-colors hover:bg-gold/20"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          NEW CATEGORY
        </button>
      </div>

      {loading && <p className="font-sans text-sm text-ivory-dim">Loading…</p>}
      {error && <p className="font-sans text-sm text-ember-bright">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gold-dim/20">
                {['Image', 'Name', 'Slug', 'Type', 'Products', 'Position', 'Actions'].map((h) => (
                  <th key={h} className="pb-3 pr-6 text-left font-sans text-[9px] tracked-wide text-gold-dim">{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.sort((a, b) => a.position - b.position).map((cat) => (
                <tr key={cat.id} className="border-b border-gold-dim/10 transition-colors hover:bg-charcoal-light/50">
                  <td className="py-3.5 pr-6">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="h-10 w-12 object-cover border border-gold-dim/20" />
                    ) : (
                      <div className="flex h-10 w-12 items-center justify-center border border-dashed border-gold-dim/20 bg-charcoal-light">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-dim/40">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 pr-6">
                    <p className="font-display text-sm text-ivory">{cat.name}</p>
                    {cat.description && <p className="mt-0.5 font-sans text-[10px] text-ivory-dim/50 max-w-xs truncate">{cat.description}</p>}
                  </td>
                  <td className="py-3.5 pr-6">
                    <span className="font-sans text-[10px] text-gold-dim/70">{cat.slug}</span>
                  </td>
                  <td className="py-3.5 pr-6">
                    <span className={`inline-flex border px-1.5 py-0.5 font-sans text-[9px] tracked-wide ${
                      cat.type === 'collection'
                        ? 'border-gold/20 bg-gold/5 text-gold'
                        : 'border-ivory/10 bg-charcoal-light text-ivory-dim'
                    }`}>
                      {cat.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 pr-6">
                    <span className="font-sans text-sm text-ivory">{productCounts[cat.id] || 0}</span>
                  </td>
                  <td className="py-3.5 pr-6">
                    <span className="font-sans text-sm text-ivory-dim">{cat.position}</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        title="Edit"
                        onClick={() => setModal({ mode: 'edit', cat })}
                        className="border border-gold-dim/20 p-1.5 text-gold-dim transition-colors hover:border-gold hover:text-gold"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
                        </svg>
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(cat)}
                        className="border border-ember/20 p-1.5 text-ember/60 transition-colors hover:border-ember hover:text-ember-bright"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center font-display text-lg text-ivory-dim/30">No categories yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal?.mode === 'create' && (
        <Modal title="New Category" onClose={() => setModal(null)}>
          <CategoryForm onSave={handleSave} onCancel={() => setModal(null)} saving={saving} token={token} />
        </Modal>
      )}
      {modal?.mode === 'edit' && (
        <Modal title={`Edit — ${modal.cat.name}`} onClose={() => setModal(null)}>
          <CategoryForm initial={modal.cat} onSave={handleSave} onCancel={() => setModal(null)} saving={saving} token={token} />
        </Modal>
      )}
    </div>
  )
}
