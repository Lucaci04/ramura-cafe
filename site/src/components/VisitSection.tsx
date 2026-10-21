import { venue, visit } from '../content'

export function VisitSection() {
  return (
    <section className="visit" id="vizita" aria-labelledby="visit-title">
      <h2 id="visit-title" className="visually-hidden">
        {visit.heading}
      </h2>
      <address className="visit__rows">
        <p className="visit__row">{venue.name}</p>
        <p className="visit__row">{venue.street}</p>
        <p className="visit__row">{venue.city}</p>
        <p className="visit__row visit__row--pending">{visit.hoursNote}</p>
        <a className="visit__row visit__row--link" href={venue.mapsUrl} target="_blank" rel="noreferrer">
          Deschide harta
          <span className="visually-hidden"> (filă nouă)</span>
        </a>
      </address>

      <div className="visit__postcards">
        {visit.pictures.map((card) => (
          <div key={card.src} className="visit__postcard">
            <img src={card.src} alt={card.alt} width={card.width} height={card.height} loading="lazy" />
          </div>
        ))}
      </div>
      <p className="visit__note">{visit.picturesNote}</p>
    </section>
  )
}
