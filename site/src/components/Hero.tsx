import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { heroVideo, venue } from '../content'
import { easeInOut, easeOut, rise, sequence } from '../motion'
import './Hero.css'

export function Hero() {
  const reduce = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  // Cu mișcare redusă, video-ul nu pornește singur; rămâne imaginea de afiș.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reduce) {
      video.pause()
    } else {
      video.play().catch(() => setPlaying(false))
    }
  }, [reduce])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }
  // Cu mișcare redusă, totul apare direct în starea finală.
  const initial = reduce ? false : 'hidden'

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <motion.div
        className="hero__egg"
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: easeOut }}
      />
      <figure className="hero__figure">
        {/* Momentul semnătură: imaginea se deschide ca un oblon, din oul verde. */}
        <motion.div
          className="hero__picture"
          initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.1, delay: 0.35, ease: easeInOut }}
        >
          <motion.video
            ref={videoRef}
            src={heroVideo.src}
            poster={heroVideo.poster}
            width={720}
            height={480}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            initial={reduce ? false : { scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, delay: 0.35, ease: easeOut }}
          />
        </motion.div>
        <motion.figcaption
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <span>{heroVideo.caption}</span>
          <button type="button" className="hero__play" onClick={togglePlay}>
            {playing ? 'Oprește video-ul' : 'Pornește video-ul'}
          </button>
        </motion.figcaption>
      </figure>

      <motion.div className="hero__copy" variants={sequence(0.15)} initial={initial} animate="visible">
        <motion.h1 id="hero-title" variants={rise}>
          Cafea bună,
          <br /> copii veseli.
        </motion.h1>
        <motion.p className="hero__lead" variants={rise}>
          {venue.name} e un cuib pe {venue.street}, în {venue.city}: o cafea fără grabă, cu cei
          mici aproape și prietenii la aceeași masă.
        </motion.p>
        <motion.div className="hero__actions" variants={rise}>
          <a className="button" href={venue.mapsUrl} target="_blank" rel="noreferrer">
            Vezi drumul pe hartă
            <span className="visually-hidden"> (se deschide Google Maps într-o filă nouă)</span>
          </a>
          <a className="text-link" href="#meniu">
            Despre meniu
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
