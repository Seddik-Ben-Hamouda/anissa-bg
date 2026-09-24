import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCategories } from '../lib/api'

const primaryLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/services', label: 'Threads of Light' },
  { to: '/custom-creation', label: 'Custom Creation' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [collectionOpen, setCollectionOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data || []))
      .catch(() => {})
  }, [])

  const collectionCategories = categories.filter((c) => c.type === 'collection')

  // Secret admin entry: triple-click on logo within 800ms
  const clickCount = useRef(0)
  const clickTimer = useRef(null)

  function handleLogoClick(e) {
    setOpen(false)
    e.preventDefault()
    clickCount.current += 1
    clearTimeout(clickTimer.current)
    if (clickCount.current >= 3) {
      clickCount.current = 0
      navigate('/admin/login')
      return
    }
    clickTimer.current = setTimeout(() => {
      navigate('/')
      clickCount.current = 0
    }, 800)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        open
          ? 'bg-obsidian'
          : scrolled
          ? 'bg-obsidian/95 backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          to="/"
          className="font-display text-2xl tracked text-ivory"
          onClick={handleLogoClick}
        >
          ANISSA&nbsp;BG
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {collectionCategories.length > 0 && (
            <div
              className="group relative"
              onMouseEnter={() => setCollectionOpen(true)}
              onMouseLeave={() => setCollectionOpen(false)}
            >
              <button className="font-sans text-sm tracked text-ivory-dim transition-colors hover:text-gold">
                COLLECTION
              </button>
              <div
                className={`absolute left-0 top-full pt-3 transition-opacity duration-200 ${
                  collectionOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <div className="w-64 border border-gold-dim/40 bg-charcoal py-2">
                  {collectionCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/collection/${cat.slug}`}
                      className="block px-5 py-3 font-display text-base text-ivory-dim transition-colors hover:bg-charcoal-light hover:text-gold"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-sans text-sm tracked transition-colors hover:text-gold ${
                  isActive ? 'text-gold' : 'text-ivory-dim'
                }`
              }
            >
              {link.label.toUpperCase()}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-px w-6 bg-ivory transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`}
          />
          <span className={`h-px w-6 bg-ivory transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span
            className={`h-px w-6 bg-ivory transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Mobile menu — full screen takeover in solid obsidian */}
      {open && (
        <nav className="fixed inset-x-0 top-[72px] bottom-0 z-50 flex flex-col justify-between overflow-y-auto bg-obsidian px-6 pb-12 pt-6 lg:hidden border-t border-gold-dim/20">
          <div className="flex flex-col">
            {collectionCategories.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 font-sans text-xs tracking-widest text-gold-dim uppercase">COLLECTION</p>
                <div className="flex flex-col gap-1">
                  {collectionCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/collection/${cat.slug}`}
                      className="block py-2 font-display text-xl text-ivory-dim transition-colors hover:text-gold"
                      onClick={() => setOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className="my-4 h-px bg-gold-dim/20" />
              </div>
            )}

            <div className="flex flex-col gap-1">
              {primaryLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-2 font-display text-2xl font-light text-ivory transition-colors hover:text-gold"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-gold-dim/15 pt-6 text-center">
            <p className="font-display text-sm italic text-ivory-dim/70">
              Art · Nature · Healing
            </p>
            <p className="mt-1.5 font-sans text-[10px] tracking-widest text-gold-dim/60 uppercase">
              Paris · New York · Tokyo
            </p>
          </div>
        </nav>
      )}
    </header>
  )
}
