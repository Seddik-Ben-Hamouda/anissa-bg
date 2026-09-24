import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl font-light text-gold-dim">404</p>
      <h1 className="mt-4 font-display text-3xl font-light text-ivory">Page Not Found</h1>
      <p className="mt-3 max-w-sm font-sans text-sm text-ivory-dim">
        This page doesn't exist. Let's guide you back to the collection.
      </p>
      <Link
        to="/"
        className="mt-8 border border-gold px-8 py-3.5 font-sans text-xs tracked-wide text-gold hover:bg-gold hover:text-obsidian transition-colors"
      >
        BACK HOME
      </Link>
    </div>
  )
}
