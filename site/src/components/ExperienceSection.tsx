import { family, pictures } from '../content'

export function ExperienceSection() {
  const picture = pictures.nest

  return (
    <section className="family" id="copii" aria-labelledby="family-title">
      <div className="family__panel">
        <h2 id="family-title">{family.heading}</h2>
        <div className="family__blocks">
          {family.blocks.map((block) => (
            <div key={block.title} className="family__block">
              <h3>{block.title}</h3>
              <p>{block.text}</p>
            </div>
          ))}
        </div>
        <figure className="family__figure">
          <div className="family__picture">
            <img
              src={picture.src}
              alt={picture.alt}
              width={picture.width}
              height={picture.height}
              loading="lazy"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}
