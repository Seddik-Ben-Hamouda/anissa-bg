// Stand-in for real photography until the client's product images are
// uploaded via the admin dashboard. Deliberately restrained — a soft
// gradient field and a thin gold frame — so it reads as "awaiting image"
// rather than as decorative art in its own right.
export default function EditorialFrame({
  label,
  number,
  aspect = 'aspect-[3/4]',
  tone = 'default',
  className = '',
}) {
  const tones = {
    default: 'from-charcoal-light via-charcoal to-obsidian',
    ember: 'from-ember/40 via-charcoal to-obsidian',
    gold: 'from-gold-dim/30 via-charcoal to-obsidian',
  }

  return (
    <div
      className={`relative ${aspect} w-full overflow-hidden bg-gradient-to-br ${tones[tone]} ${className}`}
    >
      <div className="absolute inset-4 border border-gold-dim/30" />
      {number !== undefined && (
        <span className="absolute bottom-6 right-6 font-display text-6xl text-gold-dim/25">
          {String(number).padStart(2, '0')}
        </span>
      )}
      {label && (
        <span className="absolute left-6 top-6 font-sans text-[10px] tracked-wide text-ivory-dim/50">
          {label}
        </span>
      )}
    </div>
  )
}
