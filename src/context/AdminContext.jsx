import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { adminLogin as apiLogin, setUnauthorizedHandler } from '../lib/adminApi'

const AdminContext = createContext(null)

const STORAGE_KEY = 'anissa_admin_session'

function loadSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    // Expire check: expires_at is Unix seconds
    if (session.expires_at && Date.now() / 1000 > session.expires_at) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function AdminProvider({ children }) {
  const [session, setSession] = useState(() => loadSession())

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  // Register 401 handler so any admin API call auto-logouts
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password) // throws on failure
    const sess = {
      token: data.access_token,
      expires_at: data.expires_at,
      user: data.user,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sess))
    setSession(sess)
    return sess
  }, [])

  return (
    <AdminContext.Provider value={{ session, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
