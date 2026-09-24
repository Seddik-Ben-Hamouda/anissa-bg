import { Link } from 'react-router-dom'

export function ButtonLink({ to, children, variant = 'outline', className = '' }) {
  const base =
    'inline-block font-sans text-xs tracked-wide px-8 py-3.5 transition-colors duration-300'
  const variants = {
    outline: 'border border-gold text-gold hover:bg-gold hover:text-obsidian',
    solid: 'bg-gold text-obsidian hover:bg-gold-bright',
    ghost: 'text-ivory hover:text-gold border-b border-ivory/40 hover:border-gold pb-1 px-0',
  }
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children.toUpperCase ? children.toUpperCase() : children}
    </Link>
  )
}

export function Button({ children, variant = 'outline', className = '', ...props }) {
  const base =
    'inline-block font-sans text-xs tracked-wide px-8 py-3.5 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    outline: 'border border-gold text-gold hover:bg-gold hover:text-obsidian',
    solid: 'bg-gold text-obsidian hover:bg-gold-bright',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </button>
  )
}
