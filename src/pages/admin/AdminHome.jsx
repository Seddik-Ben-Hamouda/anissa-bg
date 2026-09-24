import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { getAdminProducts } from '../../lib/adminApi'
import { getPublicCategories } from '../../lib/adminApi'
import {
  getRequests, getCustomRequests, getSessionRequests, getContactMessages,
} from '../../lib/adminApi'

function StatCard({ label, value, icon, accent = 'gold' }) {
  const accentClasses = {
    gold: 'text-gold border-gold/20 bg-gold/5',
    ember: 'text-ember-bright border-ember/20 bg-ember/5',
    ivory: 'text-ivory border-gold-dim/20 bg-charcoal-light',
  }
  return (
    <div className={`border bg-charcoal p-6 ${accentClasses[accent]}`}>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-sans text-[10px] tracked-wide text-gold-dim">{label.toUpperCase()}</p>
        <span className={`${accentClasses[accent]}`}>{icon}</span>
      </div>
      <p className="font-display text-4xl font-light text-ivory">
        {value === null ? (
          <span className="inline-block h-8 w-12 animate-pulse bg-charcoal-light" />
        ) : (
          value
        )}
      </p>
    </div>
  )
}

function InboxRow({ label, count, newCount }) {
  return (
    <div className="flex items-center justify-between border-b border-gold-dim/10 py-3 last:border-0">
      <span className="font-sans text-xs text-ivory-dim">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-sans text-xs text-ivory">{count} total</span>
        {newCount > 0 && (
          <span className="rounded-sm bg-gold/20 px-2 py-0.5 font-sans text-[10px] text-gold">
            {newCount} new
          </span>
        )}
      </div>
    </div>
  )
}

export default function AdminHome() {
  const { session } = useAdmin()
  const token = session?.token

  const [stats, setStats] = useState({
    products: null,
    categories: null,
    requests: null,
    customRequests: null,
    sessionRequests: null,
    contactMessages: null,
  })

  useEffect(() => {
    if (!token) return
    Promise.all([
      getAdminProducts(token),
      getPublicCategories(token),
      getRequests(token),
      getCustomRequests(token),
      getSessionRequests(token),
      getContactMessages(token),
    ]).then(([products, cats, reqs, customReqs, sessReqs, contacts]) => {
      setStats({
        products: products?.length ?? 0,
        categories: cats?.length ?? 0,
        requests: reqs,
        customRequests: customReqs,
        sessionRequests: sessReqs,
        contactMessages: contacts,
      })
    }).catch(console.error)
  }, [token])

  function countNew(arr) {
    if (!arr) return 0
    return arr.filter((r) => r.status === 'new').length
  }

  const totalNew = countNew(stats.requests) + countNew(stats.customRequests) + countNew(stats.sessionRequests) + countNew(stats.contactMessages)
  const totalInbox = (stats.requests?.length ?? 0) + (stats.customRequests?.length ?? 0) + (stats.sessionRequests?.length ?? 0) + (stats.contactMessages?.length ?? 0)

  return (
    <div>
      <div className="mb-8">
        <p className="font-sans text-[10px] tracked-wide text-gold-dim">OVERVIEW</p>
        <h2 className="mt-1 font-display text-3xl font-light text-ivory">Dashboard</h2>
      </div>

      {/* Stat cards */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Products"
          value={stats.products}
          accent="gold"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          }
        />
        <StatCard
          label="Categories"
          value={stats.categories}
          accent="ivory"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 5h18M3 12h18M3 19h18" />
            </svg>
          }
        />
        <StatCard
          label="Total Inbox"
          value={totalInbox || (stats.requests === null ? null : 0)}
          accent="ivory"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />
        <StatCard
          label="New / Unread"
          value={totalNew || (stats.requests === null ? null : 0)}
          accent="ember"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
        />
      </div>

      {/* Inbox breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-gold-dim/20 bg-charcoal p-6">
          <p className="mb-4 font-sans text-[10px] tracked-wide text-gold-dim">INBOX BREAKDOWN</p>
          <InboxRow label="Piece Requests" count={stats.requests?.length ?? '—'} newCount={countNew(stats.requests)} />
          <InboxRow label="Custom Creation" count={stats.customRequests?.length ?? '—'} newCount={countNew(stats.customRequests)} />
          <InboxRow label="Sessions" count={stats.sessionRequests?.length ?? '—'} newCount={countNew(stats.sessionRequests)} />
          <InboxRow label="Contact Messages" count={stats.contactMessages?.length ?? '—'} newCount={countNew(stats.contactMessages)} />
        </div>

        <div className="border border-gold-dim/20 bg-charcoal p-6">
          <p className="mb-4 font-sans text-[10px] tracked-wide text-gold-dim">QUICK LINKS</p>
          {[
            { label: 'Manage Products', to: '/admin/products', desc: 'Add, edit or remove pieces from the shop' },
            { label: 'Manage Categories', to: '/admin/categories', desc: 'Organise shop and collection categories' },
            { label: 'View New Requests', to: '/admin/requests', desc: 'Respond to incoming piece requests' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block border-b border-gold-dim/10 py-3 last:border-0 group"
            >
              <p className="font-sans text-xs text-ivory transition-colors group-hover:text-gold">{link.label}</p>
              <p className="mt-0.5 font-sans text-[10px] text-ivory-dim/60">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
