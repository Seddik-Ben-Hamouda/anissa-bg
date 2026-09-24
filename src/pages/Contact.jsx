import { useState } from 'react'
import { Field, TextInput, TextArea, FormStatus } from '../components/FormFields'
import { Button } from '../components/Button'
import { submitContactMessage } from '../lib/api'
import { useSEO } from '../lib/useSEO'

const initialForm = { name: '', email: '', message: '' }

export default function Contact() {
  useSEO(
    'Contact Studio',
    'Connect with the studio of Anissa BG for inquiries, sessions, and commissions.'
  )
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitContactMessage(form)
      setStatus('success')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] px-6 py-32 md:px-10 overflow-hidden">
      {/* Background Logo */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <img
          src="/images/logo.webp"
          alt=""
          className="h-full w-full object-cover object-center opacity-10 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-obsidian/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-xl text-center">
        <p className="font-sans text-xs tracked-wide text-gold-dim">GET IN TOUCH</p>
        <h1 className="mt-4 font-display text-5xl font-light text-ivory md:text-6xl">Contact</h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-sm text-ivory-dim">
          Questions about a piece, a session, or a collaboration — we'd love to hear from you.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-xl">
        {status === 'success' ? (
          <FormStatus
            status="success"
            successMessage="Thank you for your message. We will be in touch soon."
          />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
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
            <Field label="Message" required>
              <TextArea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </Field>
            <Button type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </Button>
            {status === 'error' && <FormStatus status="error" />}
          </form>
        )}
      </div>
    </div>
  )
}
