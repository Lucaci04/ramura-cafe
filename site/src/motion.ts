import type { Transition, Variants } from 'motion/react'

/** Curbele și duratele comune. Calme: intrările ușor mai lungi, feedbackul scurt. */
export const easeOut = [0.23, 1, 0.32, 1] as const
export const easeInOut = [0.645, 0.045, 0.355, 1] as const

export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
}

/** Părinte care așază copiii în ordinea de citire, la 80ms distanță. */
export const sequence = (delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren } },
})

export const press: Transition = { type: 'spring', stiffness: 500, damping: 30 }

/** Reveal o singură dată, când secțiunea intră în ecran. */
export const inViewOnce = { once: true, amount: 0.3 } as const
