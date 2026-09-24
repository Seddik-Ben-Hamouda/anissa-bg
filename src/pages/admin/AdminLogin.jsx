import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

export default function AdminLogin() {
  const { login } = useAdmin()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 bg-ember/5 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 bg-gold/5 blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(198,161,91,1) 1px, transparent 1px), linear-gradient(90deg, rgba(198,161,91,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <div className="relative w-full max-w-sm px-6">
        {/* Logo */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-gold/30 bg-charcoal-light">
            <span className="font-display text-2xl text-gold">A</span>
          </div>
          <h1 className="font-display text-3xl font-light tracked text-ivory">ANISSA BG</h1>
          <p className="mt-1 font-sans text-xs tracked-wide text-gold-dim">ADMIN ACCESS</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block font-sans text-[10px] tracked-wide text-gold-dim">
              EMAIL
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gold-dim/30 bg-charcoal px-4 py-3 font-sans text-sm text-ivory placeholder-ivory-dim/30 outline-none transition-colors focus:border-gold"
              placeholder="admin@anissabg.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-1.5 block font-sans text-[10px] tracked-wide text-gold-dim">
              PASSWORD
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gold-dim/30 bg-charcoal px-4 py-3 pr-11 font-sans text-sm text-ivory placeholder-ivory-dim/30 outline-none transition-colors focus:border-gold"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-dim/50 transition-colors hover:text-gold"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="border border-ember/40 bg-ember/10 px-4 py-3">
              <p className="font-sans text-xs text-ember-bright">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            id="admin-login-submit"
            className="mt-2 flex w-full items-center justify-center gap-2 border border-gold/40 bg-gold/10 px-6 py-3.5 font-sans text-xs tracked-wide text-gold transition-all duration-300 hover:bg-gold/20 hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                SIGNING IN…
              </>
            ) : (
              'ENTER DASHBOARD'
            )}
          </button>
        </form>

        <p className="mt-8 text-center font-sans text-[10px] text-ivory-dim/30">
          Restricted access · Anissa BG
        </p>
      </div>
    </div>
  )
}
