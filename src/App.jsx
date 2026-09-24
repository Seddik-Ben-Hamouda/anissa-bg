import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AmbientAudio from './components/AmbientAudio'

import Home from './pages/Home'
import CollectionPage from './pages/CollectionPage'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Services from './pages/Services'
import CustomCreation from './pages/CustomCreation'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Admin
import { AdminProvider } from './context/AdminContext'
import PrivateRoute from './components/admin/PrivateRoute'
import AdminLayout from './components/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminHome from './pages/admin/AdminHome'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminRequests from './pages/admin/AdminRequests'
import {
  getRequests, updateRequestStatus,
  getCustomRequests, updateCustomRequestStatus,
  getSessionRequests, updateSessionRequestStatus,
  getContactMessages, updateContactMessageStatus,
} from './lib/adminApi'

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-obsidian">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection/:slug" element={<CollectionPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/custom-creation" element={<CustomCreation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <AmbientAudio />
    </div>
  )
}

function AdminShell() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="*"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<AdminHome />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route
                  path="requests"
                  element={
                    <AdminRequests
                      fetchFn={getRequests}
                      updateStatusFn={updateRequestStatus}
                      title="Piece Requests"
                      subtitle="INBOX"
                    />
                  }
                />
                <Route
                  path="custom-requests"
                  element={
                    <AdminRequests
                      fetchFn={getCustomRequests}
                      updateStatusFn={updateCustomRequestStatus}
                      title="Custom Creation"
                      subtitle="INBOX"
                    />
                  }
                />
                <Route
                  path="session-requests"
                  element={
                    <AdminRequests
                      fetchFn={getSessionRequests}
                      updateStatusFn={updateSessionRequestStatus}
                      title="Sessions"
                      subtitle="INBOX"
                    />
                  }
                />
                <Route
                  path="contact-messages"
                  element={
                    <AdminRequests
                      fetchFn={getContactMessages}
                      updateStatusFn={updateContactMessageStatus}
                      title="Contact Messages"
                      subtitle="INBOX"
                    />
                  }
                />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <AdminProvider>
      <ScrollToTop />
      {isAdmin ? (
        <Routes>
          <Route path="/admin/*" element={<AdminShell />} />
        </Routes>
      ) : (
        <PublicLayout />
      )}
    </AdminProvider>
  )
}
