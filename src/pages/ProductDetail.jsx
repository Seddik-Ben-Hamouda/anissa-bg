import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import EditorialFrame from '../components/EditorialFrame'
import ProductGallery from '../components/ProductGallery'
import { getProduct, submitPieceRequest } from '../lib/api'
import { Field, TextInput, TextArea, FormStatus } from '../components/FormFields'
import { Button } from '../components/Button'
import { useSEO } from '../lib/useSEO'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | notfound | error

  useSEO(product?.name_fr || '', product?.description || '')

  useEffect(() => {
    let active = true
    setStatus('loading')
    getProduct(slug)
      .then((data) => {
        if (active) {
          setProduct(data)
          setStatus('ready')
        }
      })
      .catch((err) => {
        if (active) setStatus(err.message === 'Product not found' ? 'notfound' : 'error')
      })
    return () => {
      active = false
    }
  }, [slug])

  const [form, setForm] = useState({ name: '', email: '', phone: '', size: '', message: '' })
  const [formStatus, setFormStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setFormStatus('sending')
    try {
      await submitPieceRequest({
        product_id: product.id,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        size: form.size || undefined,
        message: form.message || undefined,
      })
      setFormStatus('success')
      setForm({ name: '', email: '', phone: '', size: '', message: '' })
    } catch {
      setFormStatus('error')
    }
  }

  if (status === 'loading') {
    return <div className="px-6 py-32 text-center font-sans text-sm text-ivory-dim">Loading…</div>
  }

  if (status === 'notfound' || status === 'error') {
    return (
      <div className="px-6 py-32 text-center">
        <p className="font-display text-2xl text-ivory">
          {status === 'notfound' ? 'This piece could not be found.' : 'Something went wrong.'}
        </p>
        <Link to="/shop" className="mt-4 inline-block text-gold">
          Back to shop
        </Link>
      </div>
    )
  }

  const images = product.product_images?.length ? product.product_images : null

  return (
    <div>
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-4 md:p-8">
          <ProductGallery
            images={product.product_images}
            title={product.name_fr}
          />
        </div>
        <div className="flex flex-col justify-center gap-6 px-6 py-16 md:px-16">
          <Link to="/shop" className="font-sans text-xs tracked-wide text-gold-dim hover:text-gold">
            ← SHOP
          </Link>
          {product.categories?.name && (
            <p className="font-sans text-xs tracked-wide text-gold-dim">
              {product.categories.name.toUpperCase()}
            </p>
          )}
          <h1 className="font-display text-4xl font-light text-ivory md:text-5xl">
            {product.name_fr}
          </h1>
          {product.name_en && (
            <p className="font-display text-xl italic text-ivory-dim">{product.name_en}</p>
          )}
          {product.description && (
            <p className="max-w-md font-sans text-sm leading-relaxed text-ivory-dim">
              {product.description}
            </p>
          )}
          {product.materials && (
            <p className="font-sans text-xs tracked-wide text-gold-dim">
              MATERIALS — {product.materials.toUpperCase()}
            </p>
          )}
          <p className="font-sans text-xs tracked-wide text-gold-dim">
            {product.available === false
              ? 'CURRENTLY UNAVAILABLE'
              : product.price_on_request
                ? 'PRICE ON REQUEST'
                : `${product.price} TND`}
          </p>
        </div>
      </section>

      <section className="border-t border-gold-dim/20 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-light text-ivory">Request This Piece</h2>
          {formStatus === 'success' ? (
            <div className="mt-8">
              <FormStatus
                status="success"
                successMessage="Thank you for your request. We will contact you shortly."
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
              <Field label="Full Name" required>
                <TextInput
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </Field>
              <Field label="Email" required>
                <TextInput
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field label="Phone">
                <TextInput
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>
              <Field label="Size / Preferences">
                <TextInput
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                />
              </Field>
              <Field label="Message">
                <TextArea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </Field>
              <Button type="submit" disabled={formStatus === 'sending'}>
                {formStatus === 'sending' ? 'Sending…' : 'Send Request'}
              </Button>
              {formStatus === 'error' && <FormStatus status="error" />}
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
