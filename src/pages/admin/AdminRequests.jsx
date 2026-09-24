import { useState, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'

const STATUSES = ['new', 'contacted', 'completed', 'archived']

const STATUS_STYLES = {
  new:       'bg-gold/10 text-gold border-gold/30',
  contacted: 'bg-amber-900/30 text-amber-400 border-amber-700/30',
  completed: 'bg-green-900/30 text-green-400 border-green-700/30',
  archived:  'bg-charcoal-light text-ivory-dim border-gold-dim/20',
}

const STATUS_COL_STYLES = {
  new:       'border-gold/30',
  contacted: 'border-amber-700/30',
  completed: 'border-green-700/30',
  archived:  'border-gold-dim/20',
}

const STATUS_HEADER_STYLES = {
  new:       'text-gold',
  contacted: 'text-amber-400',
  completed: 'text-green-400',
  archived:  'text-ivory-dim',
}

// Detail drawer
function RequestDrawer({ request, onClose, onStatusChange, type }) {
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleStatus(s) {
    setUpdating(true)
    try {
      await onStatusChange(request.id, s)
    } finally {
      setUpdating(false)
    }
  }

  const fields = Object.entries(request).filter(
    ([k]) => !['id', 'status', 'created_at', 'updated_at', 'product_id', 'product'].includes(k)
  )

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-obsidian/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="h-full w-full max-w-md overflow-y-auto border-l border-gold-dim/30 bg-charcoal">
        <div className="sticky top-0 flex items-center justify-between border-b border-gold-dim/20 bg-charcoal px-6 py-4 z-10">
          <div>
            <p className="font-sans text-[10px] tracked-wide text-gold-dim">REQUEST DETAIL</p>
            <p className="mt-1 font-display text-lg text-ivory">{request.name || request.email}</p>
          </div>
          <button onClick={onClose} className="text-ivory-dim/60 transition-colors hover:text-ivory">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">
          {/* Requested Piece Details */}
          {request.product && (
            <div className="mb-6 border border-gold/40 bg-gold/5 p-4">
              <p className="font-sans text-[9px] tracked-wide text-gold-dim">REQUESTED PIECE</p>
              <p className="mt-1 font-display text-xl font-light text-ivory">
                {request.product.name_fr}
              </p>
              {request.product.name_en && (
                <p className="font-display text-sm italic text-ivory-dim">
                  {request.product.name_en}
                </p>
              )}
              {request.product.slug && (
                <a
                  href={`/shop/${request.product.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-sans text-xs text-gold hover:underline"
                >
                  View Piece in Shop ↗
                </a>
              )}
            </div>
          )}

          {/* Status selector */}
          <div className="mb-6">
            <p className="mb-2 font-sans text-[10px] tracked-wide text-gold-dim">STATUS</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={updating || request.status === s}
                  onClick={() => handleStatus(s)}
                  className={`border px-3 py-1.5 font-sans text-[10px] tracked-wide transition-all ${
                    request.status === s
                      ? `${STATUS_STYLES[s]} opacity-100`
                      : 'border-gold-dim/20 text-ivory-dim/60 hover:border-gold-dim/50 hover:text-ivory-dim'
                  } disabled:cursor-not-allowed`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {fields.map(([key, value]) => (
              <div key={key}>
                <p className="mb-1 font-sans text-[9px] tracked-wide text-gold-dim">{key.replace(/_/g, ' ').toUpperCase()}</p>
                <p className="font-sans text-sm text-ivory whitespace-pre-wrap break-words">
                  {value == null || value === '' ? <span className="text-ivory-dim/30">—</span> : String(value)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gold-dim/10 pt-4">
            <p className="font-sans text-[9px] text-ivory-dim/30">
              Received {request.created_at ? new Date(request.created_at).toLocaleString() : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function RequestCard({ request, onClick }) {
  const pieceName = request.product
    ? (request.product.name_en ? `${request.product.name_fr} (${request.product.name_en})` : request.product.name_fr)
    : null

  return (
    <button
      onClick={onClick}
      className="w-full border border-gold-dim/15 bg-charcoal-light p-4 text-left transition-all hover:border-gold-dim/40 hover:bg-charcoal group"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="font-display text-sm text-ivory group-hover:text-gold transition-colors line-clamp-1">
          {request.name || '(no name)'}
        </p>
      </div>
      {pieceName && (
        <div className="mb-2.5 inline-flex max-w-full items-center gap-1.5 border border-gold/30 bg-gold/10 px-2 py-1">
          <span className="shrink-0 font-sans text-[9px] tracking-wider text-gold-dim">PIECE:</span>
          <span className="truncate font-display text-xs text-gold">{pieceName}</span>
        </div>
      )}
      {request.email && (
        <p className="font-sans text-[10px] text-ivory-dim/60 truncate">{request.email}</p>
      )}
      {request.country && (
        <p className="mt-1 font-sans text-[10px] text-ivory-dim/40">{request.country}</p>
      )}
      {(request.message || request.preferences) && (
        <p className="mt-2 font-sans text-[10px] text-ivory-dim/50 line-clamp-2">
          {request.message || request.preferences}
        </p>
      )}
      <p className="mt-3 font-sans text-[9px] text-ivory-dim/30">
        {request.created_at ? new Date(request.created_at).toLocaleDateString() : ''}
      </p>
    </button>
  )
}

export default function AdminRequests({ fetchFn, updateStatusFn, title, subtitle }) {
  const { session } = useAdmin()
  const token = session?.token

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetchFn(token)
      .then((data) => setItems(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token, fetchFn])

  async function handleStatusChange(id, status) {
    try {
      const updated = await updateStatusFn(token, id, status)
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated, status } : r)))
      setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev))
    } catch (err) {
      alert(err.message)
    }
  }

  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = items.filter((r) => r.status === s)
    return acc
  }, {})

  return (
    <div>
      <div className="mb-8">
        <p className="font-sans text-[10px] tracked-wide text-gold-dim">{subtitle}</p>
        <h2 className="mt-1 font-display text-3xl font-light text-ivory">{title}</h2>
      </div>

      {loading && <p className="font-sans text-sm text-ivory-dim">Loading…</p>}
      {error && <p className="font-sans text-sm text-ember-bright">{error}</p>}

      {!loading && !error && (
        <>
          {/* Total count */}
          <p className="mb-5 font-sans text-xs text-ivory-dim/50">{items.length} total</p>

          {/* Kanban */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {STATUSES.map((status) => {
              const col = byStatus[status]
              return (
                <div key={status}>
                  {/* Column header */}
                  <div className={`mb-3 flex items-center justify-between border-b pb-2 ${STATUS_COL_STYLES[status]}`}>
                    <span className={`font-sans text-[10px] tracked-wide ${STATUS_HEADER_STYLES[status]}`}>
                      {status.toUpperCase()}
                    </span>
                    <span className={`flex h-5 w-5 items-center justify-center font-sans text-[10px] border ${STATUS_STYLES[status]}`}>
                      {col.length}
                    </span>
                  </div>
                  {/* Cards */}
                  <div className="space-y-2">
                    {col.map((r) => (
                      <RequestCard key={r.id} request={r} onClick={() => setSelected(r)} />
                    ))}
                    {col.length === 0 && (
                      <div className="border border-dashed border-gold-dim/10 py-8 text-center">
                        <p className="font-sans text-[10px] text-ivory-dim/25">Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {selected && (
        <RequestDrawer
          request={selected}
          type={title}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
