import { credits, pendingFromOwner, venue } from '../content'

const blocks = [
  { letter: 'C', tone: 'sage' },
  { letter: 'U', tone: 'cinnamon' },
  { letter: 'I', tone: 'butter' },
  { letter: 'B', tone: 'oat' },
]

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer__mark" aria-label={venue.name} role="img">
        {blocks.map((block) => (
          <span key={block.letter} className={`footer__block footer__block--${block.tone}`} aria-hidden="true">
            {block.letter}
          </span>
        ))}
      </div>

      <div className="footer__grid">
        <div>
          <p className="footer__strong">{venue.name}</p>
          <p>
            {venue.street}, {venue.city}
          </p>
          <a href={venue.mapsUrl} target="_blank" rel="noreferrer">
            Google Maps<span className="visually-hidden"> (filă nouă)</span>
          </a>
        </div>
        <div>
          <p className="footer__strong">Notă demo</p>
          <p>
            Concept de prezentare, nu site-ul oficial Ramura. Paleta e o propunere. Așteptăm de la
            proprietar: {pendingFromOwner.join(', ')}.
          </p>
          <a href="#admin">Administrare meniu și recenzii (demo)</a>
        </div>
        <div className="footer__credits">
          <p className="footer__strong">Imagini</p>
          <p>
            Imagini și video de atmosferă, nu din cafenea:{' '}
            {credits.map((credit, index) => (
              <span key={credit.page}>
                <a href={credit.page}>„{credit.title}”</a>
                {credit.author ? ` de ${credit.author}` : ''}, <a href={credit.licenceUrl}>{credit.licence}</a>, {credit.via}
                {index < credits.length - 1 ? '; ' : '.'}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  )
}
