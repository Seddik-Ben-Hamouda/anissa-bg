const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  let body = null
  try {
    body = await res.json()
  } catch {
    // no JSON body — leave as null
  }

  if (!res.ok || (body && body.success === false)) {
    const message = body?.error || `Request failed (${res.status})`
    throw new Error(message)
  }

  return body?.data
}

// ---- Public reads ----
export function getCategories(type) {
  const query = type ? `?type=${encodeURIComponent(type)}` : ''
  return request(`/api/categories${query}`)
}

export function getCategory(slug) {
  return request(`/api/categories/${encodeURIComponent(slug)}`)
}

export function getProducts({ category, featured } = {}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (featured !== undefined) params.set('featured', String(featured))
  const query = params.toString() ? `?${params.toString()}` : ''
  return request(`/api/products${query}`)
}

export function getProduct(slug) {
  return request(`/api/products/${encodeURIComponent(slug)}`)
}

// ---- Public writes (customer forms) ----
export function submitPieceRequest(payload) {
  return request('/api/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitCustomRequest(payload) {
  return request('/api/custom-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitSessionRequest(payload) {
  return request('/api/session-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitContactMessage(payload) {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
