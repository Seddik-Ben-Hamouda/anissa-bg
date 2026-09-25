import { useState } from 'react'
import { Field, TextInput, TextArea, Select, FormStatus } from '../components/FormFields'
import { Button } from '../components/Button'
import { submitCustomRequest } from '../lib/api'
import { useSEO } from '../lib/useSEO'

const creationTypes = [
  { value: 'dress', label: 'Dress' },
  { value: 'poncho', label: 'Poncho' },
  { value: 'kimono', label: 'Kimono' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'bag', label: 'Bag' },
  { value: 'interior_art', label: 'Interior Art' },
  { value: 'other', label: 'Other' },
]

const initialForm = {
  name: '',
  email: '',
  phone: '',
  creation_type: '',
  idea_description: '',
  preferred_materials: '',
  budget: '',
  deadline: '',
  message: '',
}

export default function CustomCreation() {
  useSEO(
    'Custom Creation',
    'Commission a unique wearable art piece or sacred space textile altar.'
  )
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitCustomRequest({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        creation_type: form.creation_type || undefined,
        idea_description: form.idea_description || undefined,
        preferred_materials: form.preferred_materials || undefined,
        budget: form.budget || undefined,
        deadline: form.deadline || undefined,
        message: form.message || undefined,
      })
      setStatus('success')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative overflow-hidden aspect-square md:aspect-auto md:min-h-[480px]">
          <img
            src="/images/Custom Creation/custom-creation-1.avif"
            alt="Handcrafting custom creation"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent 70%, rgba(11, 9, 6, 0.35))',
            }}
          />
        </div>
        <div className="flex flex-col justify-center gap-6 px-6 py-20 md:px-16">
          <p className="font-sans text-xs tracked-wide text-gold-dim">CUSTOM CREATION</p>
          <h1 className="font-display text-4xl font-light text-ivory md:text-5xl">
            Create Something Unique
          </h1>
          <p className="max-w-md font-sans text-sm leading-relaxed text-ivory-dim">
            Every custom piece begins with intention. Share your idea below, and Anissa will
            respond personally to explore materials, form, and meaning together.
          </p>
        </div>
      </section>

      <section className="border-t border-gold-dim/20 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-xl">
          {status === 'success' ? (
            <FormStatus
              status="success"
              successMessage="Thank you for your request. Your request has been received. We will contact you shortly."
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
              <Field label="Phone">
                <TextInput
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Field>
              <Field label="Creation Type">
                <Select
                  value={form.creation_type}
                  onChange={(e) => setForm({ ...form, creation_type: e.target.value })}
                >
                  <option value="">Select one…</option>
                  {creationTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Describe Your Idea">
                <TextArea
                  value={form.idea_description}
                  onChange={(e) => setForm({ ...form, idea_description: e.target.value })}
                />
              </Field>
              <Field label="Preferred Materials">
                <TextInput
                  value={form.preferred_materials}
                  onChange={(e) => setForm({ ...form, preferred_materials: e.target.value })}
                />
              </Field>
              <Field label="Budget">
                <TextInput
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </Field>
              <Field label="Deadline">
                <TextInput
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </Field>
              <Field label="Additional Message">
                <TextArea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </Field>
              <Button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Request a Custom Creation'}
              </Button>
              {status === 'error' && <FormStatus status="error" />}
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
