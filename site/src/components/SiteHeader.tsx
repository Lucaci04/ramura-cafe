import { venue } from '../content'
import './SiteHeader.css'

const links = [
  { href: '#cuib', label: 'Despre' },
  { href: '#copii', label: 'Cei mici' },
  { href: '#meniu', label: 'Meniu' },
  { href: '#vizita', label: 'Vizită' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-header__mark" href="#top" aria-label={`${venue.name}, începutul paginii`}>
        Ramura
      </a>
      <nav className="site-header__nav" aria-label="Secțiuni">
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <a className="site-header__map" href={venue.mapsUrl} target="_blank" rel="noreferrer">
        Hartă
        <span className="visually-hidden"> (se deschide Google Maps într-o filă nouă)</span>
      </a>
    </header>
  )
}
