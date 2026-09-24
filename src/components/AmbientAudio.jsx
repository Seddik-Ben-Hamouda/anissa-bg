import { useState, useEffect, useRef } from 'react'

export default function AmbientAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const isMutedByUser = useRef(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlayState = () => setIsPlaying(true)
    const handlePauseState = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlayState)
    audio.addEventListener('pause', handlePauseState)

    // Attempt autoplay immediately
    const attemptPlay = () => {
      if (isMutedByUser.current || !audio) return
      audio.play().catch(() => {
        // Autoplay policy prevented immediate unmuted playback without gesture
      })
    }

    attemptPlay()

    // Fallback: If browser blocked initial autoplay, start on very first interaction anywhere on page
    const onFirstInteraction = () => {
      if (!isMutedByUser.current && audio && audio.paused) {
        audio.play().catch(() => {})
      }
      cleanupListeners()
    }

    const events = ['pointerdown', 'touchstart', 'click', 'keydown']
    events.forEach((evt) => {
      window.addEventListener(evt, onFirstInteraction, { passive: true })
    })

    const cleanupListeners = () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, onFirstInteraction)
      })
    }

    return () => {
      audio.removeEventListener('play', handlePlayState)
      audio.removeEventListener('pause', handlePauseState)
      cleanupListeners()
    }
  }, [])

  const toggleAudio = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      isMutedByUser.current = true
      audio.pause()
    } else {
      isMutedByUser.current = false
      audio.play().catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/images/audio.mp3" loop preload="auto" />
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Turn off ambient sound' : 'Turn on ambient sound'}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-gold/30 bg-obsidian/85 px-4 py-2.5 shadow-2xl backdrop-blur-md transition-all hover:border-gold hover:bg-obsidian hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span className="relative flex h-2.5 w-2.5">
          {isPlaying && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full transition-colors ${
              isPlaying ? 'bg-gold' : 'bg-gold-dim/40'
            }`}
          />
        </span>
        <span className="font-sans text-[11px] font-medium tracking-widest text-ivory select-none">
          {isPlaying ? 'Sound On' : 'Sound Off'}
        </span>
      </button>
    </>
  )
}
