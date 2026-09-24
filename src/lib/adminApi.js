const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787'

let _onUnauthorized = null
export function setUnauthorizedHandler(fn) {
  _onUnauthorized = fn
}

async function request(path, options = {}) {
  const headers = { ...options.headers }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    _onUnauthorized?.()
    throw new Error('Unauthorized')
  }

  let body = null
  try { body = await res.json() } catch { /* no JSON */ }

  if (!res.ok || (body && body.success === false)) {
    const details = body?.details?.fieldErrors
      ? Object.entries(body.details.fieldErrors).map(([k, v]) => `${k}: ${v}`).join(', ')
      : ''
    const msg = details ? `${body?.error || 'Validation failed'} (${details})` : (body?.error || `Request failed (${res.status})`)
    throw new Error(msg)
  }

  return body?.data
}

function authed(token, options = {}) {
  return { ...options, headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` } }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export function adminLogin(email, password) {
  return request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// ── Categories ────────────────────────────────────────────────────────────────
export function getPublicCategories(token) {
  return request('/api/categories', authed(token))
}
export function createCategory(token, data) {
  return request('/api/admin/categories', authed(token, { method: 'POST', body: JSON.stringify(data) }))
}
export function updateCategory(token, id, data) {
  return request(`/api/admin/categories/${id}`, authed(token, { method: 'PATCH', body: JSON.stringify(data) }))
}
export function deleteCategory(token, id) {
  return request(`/api/admin/categories/${id}`, authed(token, { method: 'DELETE' }))
}

// ── Products ──────────────────────────────────────────────────────────────────
export function getAdminProducts(token) {
  return request('/api/admin/products', authed(token))
}
export function createProduct(token, data) {
  return request('/api/admin/products', authed(token, { method: 'POST', body: JSON.stringify(data) }))
}
export function updateProduct(token, id, data) {
  return request(`/api/admin/products/${id}`, authed(token, { method: 'PATCH', body: JSON.stringify(data) }))
}
export function deleteProduct(token, id) {
  return request(`/api/admin/products/${id}`, authed(token, { method: 'DELETE' }))
}

// ── Product Images ────────────────────────────────────────────────────────────
export function addProductImage(token, productId, image_url, position = 0) {
  return request(`/api/admin/products/${productId}/images`, authed(token, {
    method: 'POST',
    body: JSON.stringify({ image_url, position }),
  }))
}
export function deleteProductImage(token, productId, imageId) {
  return request(`/api/admin/products/${productId}/images/${imageId}`, authed(token, { method: 'DELETE' }))
}

// ── Upload ────────────────────────────────────────────────────────────────────
export function uploadImage(token, file, folder) {
  const form = new FormData()
  form.append('file', file)
  if (folder) form.append('folder', folder)
  return request('/api/admin/upload', authed(token, { method: 'POST', body: form }))
}

// ── Customer Requests ─────────────────────────────────────────────────────────
export function getRequests(token, status) {
  const q = status ? `?status=${status}` : ''
  return request(`/api/admin/requests${q}`, authed(token))
}
export function updateRequestStatus(token, id, status) {
  return request(`/api/admin/requests/${id}/status`, authed(token, { method: 'PATCH', body: JSON.stringify({ status }) }))
}

export function getCustomRequests(token, status) {
  const q = status ? `?status=${status}` : ''
  return request(`/api/admin/custom-requests${q}`, authed(token))
}
export function updateCustomRequestStatus(token, id, status) {
  return request(`/api/admin/custom-requests/${id}/status`, authed(token, { method: 'PATCH', body: JSON.stringify({ status }) }))
}

export function getSessionRequests(token, status) {
  const q = status ? `?status=${status}` : ''
  return request(`/api/admin/session-requests${q}`, authed(token))
}
export function updateSessionRequestStatus(token, id, status) {
  return request(`/api/admin/session-requests/${id}/status`, authed(token, { method: 'PATCH', body: JSON.stringify({ status }) }))
}

export function getContactMessages(token, status) {
  const q = status ? `?status=${status}` : ''
  return request(`/api/admin/contact-messages${q}`, authed(token))
}
export function updateContactMessageStatus(token, id, status) {
  return request(`/api/admin/contact-messages/${id}/status`, authed(token, { method: 'PATCH', body: JSON.stringify({ status }) }))
}
