import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../lib/api'
import './Footer.css'

export default function Footer() {
  const [collections, setCollections] = useState([])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    getCategories('collection')
      .then((data) => setCollections(data || []))
      .catch(() => { })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer className="site-footer">
      {/* Background Watermark */}
      <div className="footer-watermark" aria-hidden="true">
        <svg viewBox="0 0 1000 250" preserveAspectRatio="xMidYMid meet">
          <text x="50%" y="200" textAnchor="middle">ANISSA</text>
        </svg>
      </div>

      <div className="footer-inner">
        {/* LA GAZETTE / Newsletter */}
        <div className="footer-gazette-section">
          <div className="footer-gazette-content">
            <span className="footer-eyebrow">LA GAZETTE</span>
            <h2 className="footer-title">Join the Maison</h2>
            <form className="footer-subscribe-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder={subscribed ? 'MERCI POUR VOTRE INSCRIPTION' : 'EMAIL ADDRESS'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email Address"
              />
              <button type="submit" className="footer-subscribe-btn">
                S&apos;ABONNER
              </button>
            </form>

            {/* Social Icons for Mobile */}
            <div className="footer-social-icons">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="footer-social-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="footer-social-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="footer-social-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

            </div>
          </div>
        </div>

        {/* 4 Navigation Columns (Desktop) */}
        <div className="footer-nav-grid">
          {/* COLLECTIONS — dynamic from API */}
          <div className="footer-nav-col">
            <h3 className="footer-col-title">COLLECTIONS</h3>
            <ul className="footer-col-links">
              <li>
                <Link to="/shop">Shop All Pieces</Link>
              </li>
              {collections.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/collection/${cat.slug}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* MAISON */}
          <div className="footer-nav-col">
            <h3 className="footer-col-title">MAISON</h3>
            <ul className="footer-col-links">
              <li><Link to="/about">Philosophy</Link></li>
              <li><Link to="/about">The Artisans</Link></li>
              <li><Link to="/services">Threads of Light</Link></li>
              <li><Link to="/custom-creation">Custom Creation</Link></li>
            </ul>
          </div>

          {/* BOUTIQUE */}
          <div className="footer-nav-col">
            <h3 className="footer-col-title">BOUTIQUE</h3>
            <ul className="footer-col-links">
              <li><Link to="/contact">Find a Store</Link></li>
              <li><Link to="/contact">Client Service</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* SUIVEZ-NOUS */}
          <div className="footer-nav-col">
            <h3 className="footer-col-title">SUIVEZ-NOUS</h3>
            <ul className="footer-col-links">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://behance.net" target="_blank" rel="noopener noreferrer">Behance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-copy">
            © {new Date().getFullYear()} ANISSA MAISON. ALL RIGHTS RESERVED.
          </div>
          <div className="footer-bottom-cities">
            <span>PARIS</span>
            <span className="footer-divider">|</span>
            <span>NEW YORK</span>
            <span className="footer-divider">|</span>
            <span>TOKYO</span>
          </div>
          <div className="footer-bottom-legal">
            <Link to="/#privacy">PRIVACY POLICY</Link>
            <Link to="/#terms">TERMS</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

