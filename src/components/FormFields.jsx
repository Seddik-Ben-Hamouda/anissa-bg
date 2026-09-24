export function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="font-sans text-xs tracked-wide text-gold-dim">
        {label.toUpperCase()}
        {required && <span className="text-ember-bright"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

const inputClasses =
  'w-full border border-ivory/20 bg-transparent px-4 py-3 font-sans text-sm text-ivory placeholder:text-ivory-dim/40 focus:border-gold outline-none transition-colors'

export function TextInput(props) {
  return <input {...props} className={inputClasses} />
}

export function TextArea(props) {
  return <textarea rows={4} {...props} className={inputClasses} />
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${inputClasses} bg-obsidian [&>option]:bg-charcoal [&>option]:text-ivory`}>
      {children}
    </select>
  )
}

export function CheckboxGroup({ options, values, onChange }) {
  function toggle(value) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value))
    } else {
      onChange([...values, value])
    }
  }
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <button
          type="button"
          key={opt.value}
          onClick={() => toggle(opt.value)}
          className={`border px-4 py-2 font-sans text-xs tracked transition-colors ${
            values.includes(opt.value)
              ? 'border-gold bg-gold text-obsidian'
              : 'border-ivory/20 text-ivory-dim hover:border-gold/60'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function RadioPills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <button
          type="button"
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`border px-4 py-2 font-sans text-xs tracked transition-colors ${
            value === opt.value
              ? 'border-gold bg-gold text-obsidian'
              : 'border-ivory/20 text-ivory-dim hover:border-gold/60'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function FormStatus({ status, successMessage }) {
  if (status === 'success') {
    return (
      <p className="border border-gold/40 bg-gold/5 px-5 py-4 font-display text-base text-gold">
        {successMessage}
      </p>
    )
  }
  if (status === 'error') {
    return (
      <p className="border border-ember-bright/50 bg-ember/10 px-5 py-4 font-sans text-sm text-ivory">
        Something went wrong sending your message. Please try again in a moment.
      </p>
    )
  }
  return null
}
