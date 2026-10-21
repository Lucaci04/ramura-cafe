import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { reviews as copy } from '../content'
import { useSiteData, type Review } from '../siteData'

const placeholders: Review[] = Array.from({ length: 4 }, (_, index) => ({
  id: `slot-${index}`,
  author: '',
  text: copy.emptySlot,
  source: '',
}))

export function ReviewsSection() {
  const { reviews } = useSiteData()
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const real = reviews.filter((review) => review.text.trim())
  const items = real.length > 0 ? real : placeholders
  const isPlaceholder = real.length === 0
  // Repetăm cardurile până umplu banda; repetițiile sunt doar vizuale.
  const minCards = 6
  const loop = Array.from({ length: Math.max(items.length, reduce ? 0 : minCards) }, (_, index) => ({
    review: items[index % items.length],
    copy: index >= items.length,
    key: `${items[index % items.length].id}-${index}`,
  }))
  // Banda se mișcă doar dacă utilizatorul nu a cerut mișcare redusă și nu a oprit-o.
  const moving = !reduce && !paused
  // Durata crește cu numărul de recenzii, ca viteza de citire să rămână aceeași.
  const duration = `${loop.length * 9}s`

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="reviews__head">
        <h2 id="reviews-title">{copy.heading}</h2>
        {!reduce && (
          <button type="button" className="reviews__toggle" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
            {paused ? 'Pornește derularea' : 'Oprește derularea'}
          </button>
        )}
      </div>

      <div className={`reviews__viewport${moving ? '' : ' reviews__viewport--still'}`}>
        <div className="reviews__track" style={{ animationDuration: duration }}>
          <ReviewList cards={loop} placeholder={isPlaceholder} />
          {/* A doua copie face bucla continuă; cititoarele de ecran o ignoră. */}
          {!reduce && <ReviewList cards={loop} placeholder={isPlaceholder} hidden />}
        </div>
      </div>
    </section>
  )
}

type Card = { review: Review; copy: boolean; key: string }

function ReviewList({ cards, placeholder, hidden = false }: { cards: Card[]; placeholder: boolean; hidden?: boolean }) {
  return (
    <ul className="reviews__list" aria-hidden={hidden || undefined} inert={hidden || undefined}>
      {cards.map(({ review, copy, key }) => (
        <li
          key={key}
          className={`reviews__card${placeholder ? ' reviews__card--slot' : ''}`}
          aria-hidden={(!hidden && copy) || undefined}
        >
          <blockquote>
            <p>{placeholder ? review.text : `„${review.text}”`}</p>
          </blockquote>
          {!placeholder && (
            <p className="reviews__author">
              {review.author}
              {review.source && <span>, {review.source}</span>}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
