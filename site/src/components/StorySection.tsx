import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { eggs, type EggId } from '../content'
import { easeOut, inViewOnce, press, rise, sequence } from '../motion'

export function StorySection() {
  const [active, setActive] = useState<EggId>('cafea')
  const egg = eggs.find((item) => item.id === active) ?? eggs[0]
  const reduce = useReducedMotion()

  return (
    <motion.section
      className="story"
      id="cuib"
      aria-labelledby="story-title"
      variants={sequence()}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={inViewOnce}
    >
      <div className="story__text">
        <motion.h2 id="story-title" variants={rise}>
          Ce găsești în cuib
        </motion.h2>
        <motion.p className="story__statement" variants={rise}>
          Cuib înseamnă locul la care te întorci. Aici te așteaptă trei lucruri. Alege
          unul.
        </motion.p>
        <motion.div className="story__eggs" role="group" aria-label="Cele trei lucruri din cuib" variants={rise}>
          {eggs.map((item) => {
            const isActive = item.id === active
            return (
              <motion.button
                key={item.id}
                type="button"
                className="story__egg"
                aria-pressed={isActive}
                aria-controls="story-panel"
                onClick={() => setActive(item.id)}
                whileTap={{ scale: 0.94 }}
                transition={press}
              >
                {/* Oul plin alunecă de la o alegere la alta. */}
                {isActive && (
                  <motion.span
                    className="story__egg-fill"
                    layoutId="egg-fill"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="story__egg-label">{item.label}</span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      <motion.figure className="story__panel" id="story-panel" aria-live="polite" variants={rise}>
        <div className="story__picture">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.img
              key={egg.id}
              src={egg.picture.src}
              alt={egg.picture.alt}
              width={egg.picture.width}
              height={egg.picture.height}
              loading="lazy"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.45, ease: easeOut }}
            />
          </AnimatePresence>
        </div>
        <figcaption>
          <span className="story__label">{egg.label}.</span> {egg.line}
        </figcaption>
      </motion.figure>
    </motion.section>
  )
}
