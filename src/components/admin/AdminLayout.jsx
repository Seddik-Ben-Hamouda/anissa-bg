import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

const navItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    end: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Products',
    to: '/admin/products',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 7H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    to: '/admin/categories',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 5h18M3 12h18M3 19h18" />
      </svg>
    ),
  },
  { divider: true, label: 'INBOX' },
  {
    label: 'Piece Requests',
    to: '/admin/requests',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: 'Custom Creation',
    to: '/admin/custom-requests',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
  },
  {
    label: 'Sessions',
    to: '/admin/session-requests',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: 'Contact',
    to: '/admin/contact-messages',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }) {
  const { session, logout } = useAdmin()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={`flex items-center gap-3 border-b border-gold-dim/20 px-5 py-6 ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-gold/40 bg-charcoal-light">
          <span className="font-display text-xs text-gold">A</span>
        </div>
        {!collapsed && (
          <div>
            <p className="font-display text-sm tracked text-ivory">ANISSA BG</p>
            <p className="font-sans text-[10px] tracked-wide text-gold-dim">ADMIN</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map((item, i) => {
          if (item.divider) {
            return (
              <div key={i} className="mb-2 mt-5 px-2">
                {!collapsed && (
                  <p className="font-sans text-[9px] tracked-wide text-gold-dim">{item.label}</p>
                )}
                {collapsed && <div className="h-px bg-gold-dim/20 my-2" />}
              </div>
            )
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2.5 mb-0.5 transition-all duration-200 group ${
                  isActive
                    ? 'bg-gold/10 text-gold border-l-2 border-gold pl-[10px]'
                    : 'text-ivory-dim hover:bg-charcoal-light hover:text-ivory border-l-2 border-transparent'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="font-sans text-xs tracked">{item.label.toUpperCase()}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gold-dim/20 px-3 py-4">
        {!collapsed && (
          <p className="mb-3 truncate px-3 font-sans text-[10px] text-ivory-dim">
            {session?.user?.email}
          </p>
        )}
        <button
          onClick={handleLogout}
          title="Logout"
          className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-ivory-dim transition-colors hover:bg-ember/20 hover:text-ember-bright ${collapsed ? 'justify-center' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && <span className="font-sans text-xs tracked">LOGOUT</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-obsidian">
      {/* Desktop Sidebar */}
      <aside
        className={`relative hidden flex-shrink-0 border-r border-gold-dim/20 bg-charcoal transition-all duration-300 lg:flex lg:flex-col ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-8 z-10 flex h-6 w-6 items-center justify-center border border-gold-dim/30 bg-charcoal text-gold-dim transition-colors hover:border-gold hover:text-gold"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            {collapsed ? (
              <polyline points="3,2 7,5 3,8" />
            ) : (
              <polyline points="7,2 3,5 7,8" />
            )}
          </svg>
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-obsidian/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-56 border-r border-gold-dim/20 bg-charcoal transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-gold-dim/20 bg-charcoal px-6">
          <button
            className="flex flex-col gap-1 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="h-px w-5 bg-ivory" />
            <span className="h-px w-5 bg-ivory" />
            <span className="h-px w-5 bg-ivory" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 flex items-center justify-center border border-gold/30 bg-charcoal-light">
              <span className="font-display text-xs text-gold">
                {session?.user?.email?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
