import { useEffect } from 'react'

export function useSEO(title, description) {
  useEffect(() => {
    const defaultTitle = 'ANISSA BG — Sacred Art of Healing'
    const defaultDesc = 'Wearable healing art, sacred textiles, and one-of-one creations by Anissa BG.'

    document.title = title ? `${title} | ANISSA BG` : defaultTitle

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.content = description || defaultDesc
  }, [title, description])
}
