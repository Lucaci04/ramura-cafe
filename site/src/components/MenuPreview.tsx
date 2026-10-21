import { menu, venue } from '../content'
import { formatPrice, useSiteData } from '../siteData'

export function MenuPreview() {
  const { menu: categories } = useSiteData()
  const filled = categories
    .map((category) => ({ ...category, items: category.items.filter((item) => item.name.trim()) }))
    .filter((category) => category.items.length > 0)

  return (
    <section className="menu" id="meniu" aria-labelledby="menu-title">
      <div className="menu__sheet">
        <h2 id="menu-title">{menu.heading}</h2>

        {filled.length === 0 ? (
          <p className="menu__note">{menu.emptyNote}</p>
        ) : (
          <div className="menu__categories">
            {filled.map((category) => (
              <div key={category.id} className="menu__category">
                <h3>{category.name || 'Altele'}</h3>
                <ul className="menu__items">
                  {category.items.map((item) => (
                    <li key={item.id} className="menu__item">
                      <p className="menu__line">
                        <span className="menu__name">{item.name}</span>
                        <span className="menu__price">{formatPrice(item.price)}</span>
                      </p>
                      {item.description && <p className="menu__desc">{item.description}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <p className="menu__aside">{menu.aside}</p>
        <a className="text-link" href={venue.mapsUrl} target="_blank" rel="noreferrer">
          Află cum ajungi
          <span className="visually-hidden"> (se deschide Google Maps într-o filă nouă)</span>
        </a>
      </div>
    </section>
  )
}
