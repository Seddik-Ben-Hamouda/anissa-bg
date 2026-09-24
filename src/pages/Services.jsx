import { useState } from 'react'
import {
  Field,
  TextInput,
  TextArea,
  CheckboxGroup,
  RadioPills,
  FormStatus,
} from '../components/FormFields'
import { Button } from '../components/Button'
import { submitSessionRequest } from '../lib/api'
import { useSEO } from '../lib/useSEO'

const experienceOptions = [
  { value: 'healing_session', label: 'Healing session' },
  { value: 'hijama', label: 'Hijama' },
  { value: 'energy_work', label: 'Energy work' },
  { value: 'intuitive_guidance', label: 'Intuitive guidance' },
  { value: 'not_sure', label: 'Not sure yet' },
]

const artOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'maybe', label: 'Maybe' },
]

const locationOptions = [
  { value: 'elysian_space', label: 'Elysian space' },
  { value: 'retreat_setting', label: 'Retreat setting' },
  { value: 'open', label: 'Open' },
]

const initialForm = {
  name: '',
  email: '',
  phone: '',
  seeking_support: '',
  experience_interests: [],
  interested_in_art: '',
  preferred_location: '',
  message: '',
}

export default function Services() {
  useSEO(
    'Threads of Light — Sessions',
    'Personal alchemy sessions, energy alignment, and bespoke ritual guidance by Anissa BG.'
  )
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitSessionRequest({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        seeking_support: form.seeking_support || undefined,
        experience_interests: form.experience_interests.length
          ? form.experience_interests
          : undefined,
        interested_in_art: form.interested_in_art || undefined,
        preferred_location: form.preferred_location || undefined,
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
        <div className="relative overflow-hidden aspect-square md:aspect-auto md:min-h-[560px]">
          <img
            src="/images/Threads of Light/healing-session.webp"
            alt="Threads of Light — Healing Session"
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
          <p className="font-sans text-xs tracked-wide text-gold-dim">THREADS OF LIGHT</p>
          <h1 className="font-display text-4xl font-light text-ivory md:text-5xl">
            Personal Alchemy Session
          </h1>
          <p className="max-w-md font-sans text-sm leading-relaxed text-ivory-dim">
            A deeply personal one-on-one session designed as a space for self-discovery,
            reflection, and inner alignment. We begin by exploring your current state —
            emotionally, energetically, and intuitively — allowing what needs to be seen,
            released, or understood to gently surface.
          </p>
          <p className="max-w-md font-sans text-sm leading-relaxed text-ivory-dim">
            From this space of clarity, we move into creation. Using natural fibers, textures,
            and sacred elements, we co-create a customized healing art piece or talisman that
            reflects your journey, your intention, and your energy.
          </p>
          <p className="max-w-md font-sans text-sm leading-relaxed text-ivory-dim">
            This experience is both a healing session and a creative ritual — a moment where
            inner work takes form, and where art becomes a living extension of your soul.
          </p>
        </div>
      </section>

      <section className="border-t border-gold-dim/20 px-6 py-24 text-center md:px-10">
        <p className="mx-auto max-w-xl font-display text-xl italic text-ivory-dim">
          Each session is a sacred meeting — intuitively guided and uniquely tailored to support
          your body, energy, and inner journey. Sessions are available in my Elysian space or in
          retreat settings.
        </p>
        <p className="mx-auto mt-4 max-w-xl font-sans text-xs tracked-wide text-gold-dim">
          PRICING IS SHARED UPON INQUIRY, TO HONOR THE DEPTH OF EACH EXPERIENCE.
        </p>
      </section>

      {/* Booking form */}
      <section className="border-t border-gold-dim/20 px-6 py-24 md:px-16">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-light text-ivory">Session Inquiry</h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ivory-dim">
            Please take a moment to share what is calling you. This allows me to prepare a space
            that truly meets you.
          </p>

          {status === 'success' ? (
            <div className="mt-8">
              <FormStatus
                status="success"
                successMessage="Thank you for your message. Your request has been received with care. I will personally connect with you to explore your needs, share session details, and guide you toward the most aligned offering."
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-7">
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
              <Field label="What are you currently seeking support with?">
                <TextArea
                  value={form.seeking_support}
                  onChange={(e) => setForm({ ...form, seeking_support: e.target.value })}
                />
              </Field>
              <Field label="What type of experience are you drawn to?">
                <CheckboxGroup
                  options={experienceOptions}
                  values={form.experience_interests}
                  onChange={(vals) => setForm({ ...form, experience_interests: vals })}
                />
              </Field>
              <Field label="Interested in a personalized healing art piece?">
                <RadioPills
                  options={artOptions}
                  value={form.interested_in_art}
                  onChange={(val) => setForm({ ...form, interested_in_art: val })}
                />
              </Field>
              <Field label="Preferred location">
                <RadioPills
                  options={locationOptions}
                  value={form.preferred_location}
                  onChange={(val) => setForm({ ...form, preferred_location: val })}
                />
              </Field>
              <Field label="Anything else you feel called to share">
                <TextArea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </Field>
              <Button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Inquiry'}
              </Button>
              {status === 'error' && <FormStatus status="error" />}
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
