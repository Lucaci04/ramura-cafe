import { useState, type ChangeEvent } from 'react'
import {
  clearSiteData,
  newId,
  parseData,
  saveSiteData,
  useSiteData,
  type MenuCategory,
  type MenuItem,
  type Review,
  type SiteData,
} from '../siteData'
import './AdminPage.css'

/**
 * Panoul admin DEMO. Parola se verifică în browser, deci NU protejează nimic
 * real: oricine citește codul o poate afla. Pentru producție e nevoie de
 * autentificare pe server.
 */
const DEMO_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'ramura-demo'
const SESSION_KEY = 'cuib-admin-session'

function readSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function AdminPage() {
  const [signedIn, setSignedIn] = useState(readSession)

  const signOut = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // ignorăm: sesiunea oricum dispare la închiderea filei
    }
    setSignedIn(false)
  }

  return (
    <div className="admin">
      <header className="admin__bar">
        <a className="admin__mark" href="#top">
          Ramura
        </a>
        <span className="admin__title">Administrare (demo)</span>
        <a className="admin__back" href="#top">
          Înapoi la site
        </a>
        {signedIn && (
          <button type="button" className="admin__ghost" onClick={signOut}>
            Ieși din cont
          </button>
        )}
      </header>
      <main className="admin__main">
        {signedIn ? <Editor /> : <SignIn onSignedIn={() => setSignedIn(true)} />}
      </main>
    </div>
  )
}

function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (password !== DEMO_PASSWORD) {
      setError('Parola nu este corectă. Verifică literele mari și mici și încearcă din nou.')
      return
    }
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // fără sessionStorage, rămâi conectat doar până la reîncărcare
    }
    onSignedIn()
  }

  return (
    <form className="admin__signin" onSubmit={submit} noValidate>
      <h1>Intră în cont</h1>
      <p>
        Aici se editează meniul, prețurile și recenziile. În acest demo, modificările se
        salvează doar în browserul tău.
      </p>
      <label className="admin__field">
        <span>Parolă</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            setError('')
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'signin-error' : undefined}
          required
        />
      </label>
      {error && (
        <p className="admin__error" id="signin-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="button">
        Intră în cont
      </button>
      <p className="admin__hint">Parola demo: ramura-demo</p>
    </form>
  )
}

type Status = { kind: 'idle' | 'saved' | 'error'; message: string }

function Editor() {
  const stored = useSiteData()
  const [draft, setDraft] = useState<SiteData>(stored)
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' })
  const dirty = JSON.stringify({ ...draft, updatedAt: null }) !== JSON.stringify({ ...stored, updatedAt: null })

  const update = (next: SiteData) => {
    setDraft(next)
    setStatus({ kind: 'idle', message: '' })
  }

  const save = () => {
    const ok = saveSiteData(draft)
    setStatus(
      ok
        ? { kind: 'saved', message: 'Modificările au fost salvate. Meniul și recenziile apar pe site.' }
        : { kind: 'error', message: 'Browserul nu permite salvarea. Ieși din modul privat și încearcă din nou.' },
    )
  }

  const discard = () => update(stored)

  const reset = () => {
    if (!window.confirm('Ștergi tot meniul și toate recenziile salvate în acest browser?')) return
    clearSiteData()
    setDraft(parseData(null))
    setStatus({ kind: 'saved', message: 'Datele au fost șterse.' })
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'cuib-meniu-recenzii.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const text = await file.text()
    const parsed = parseData(text)
    if (parsed.menu.length === 0 && parsed.reviews.length === 0) {
      setStatus({ kind: 'error', message: 'Fișierul nu conține un meniu sau recenzii. Alege un fișier exportat din acest panou.' })
      return
    }
    update(parsed)
    setStatus({ kind: 'idle', message: 'Fișier încărcat. Apasă „Salvează modificările” ca să apară pe site.' })
  }

  return (
    <div className="admin__editor">
      <div className="admin__actions" role="toolbar" aria-label="Acțiuni">
        <button type="button" className="button" onClick={save} disabled={!dirty}>
          Salvează modificările
        </button>
        <button type="button" className="admin__ghost" onClick={discard} disabled={!dirty}>
          Renunță la modificări
        </button>
        <button type="button" className="admin__ghost" onClick={exportJson}>
          Exportă JSON
        </button>
        <label className="admin__ghost admin__file">
          Importă JSON
          <input type="file" accept="application/json,.json" onChange={importJson} />
        </label>
        <button type="button" className="admin__ghost admin__danger" onClick={reset}>
          Șterge tot
        </button>
        <p className={`admin__status admin__status--${status.kind}`} role="status">
          {status.message || (dirty ? 'Ai modificări nesalvate.' : 'Totul este salvat.')}
        </p>
      </div>

      <MenuEditor menu={draft.menu} onChange={(menu) => update({ ...draft, menu })} />
      <ReviewsEditor reviews={draft.reviews} onChange={(reviews) => update({ ...draft, reviews })} />
    </div>
  )
}

function MenuEditor({ menu, onChange }: { menu: MenuCategory[]; onChange: (menu: MenuCategory[]) => void }) {
  const setCategory = (id: string, patch: Partial<MenuCategory>) =>
    onChange(menu.map((category) => (category.id === id ? { ...category, ...patch } : category)))

  const setItem = (category: MenuCategory, itemId: string, patch: Partial<MenuItem>) =>
    setCategory(category.id, {
      items: category.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
    })

  return (
    <section className="admin__section" aria-labelledby="admin-menu">
      <div className="admin__section-head">
        <h2 id="admin-menu">Meniu și prețuri</h2>
        <button
          type="button"
          className="admin__ghost"
          onClick={() => onChange([...menu, { id: newId(), name: '', items: [] }])}
        >
          Adaugă categorie
        </button>
      </div>

      {menu.length === 0 && (
        <p className="admin__empty">
          Meniul este gol. Adaugă o categorie (de exemplu băuturile calde), apoi produsele ei.
        </p>
      )}

      {menu.map((category) => (
        <fieldset key={category.id} className="admin__category">
          <legend className="visually-hidden">Categoria {category.name || 'fără nume'}</legend>
          <div className="admin__category-head">
            <label className="admin__field admin__field--grow">
              <span>Nume categorie</span>
              <input value={category.name} onChange={(event) => setCategory(category.id, { name: event.target.value })} />
            </label>
            <button
              type="button"
              className="admin__ghost admin__danger"
              onClick={() => onChange(menu.filter((other) => other.id !== category.id))}
            >
              Șterge categoria
            </button>
          </div>

          <table className="admin__table">
            <thead>
              <tr>
                <th scope="col">Produs</th>
                <th scope="col">Preț (lei)</th>
                <th scope="col">Descriere</th>
                <th scope="col">
                  <span className="visually-hidden">Acțiuni</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {category.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      aria-label="Produs"
                      value={item.name}
                      onChange={(event) => setItem(category, item.id, { name: event.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      aria-label="Preț în lei"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.5}
                      value={item.price ?? ''}
                      onChange={(event) =>
                        setItem(category, item.id, {
                          price: event.target.value === '' ? null : Number(event.target.value),
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      aria-label="Descriere"
                      value={item.description}
                      onChange={(event) => setItem(category, item.id, { description: event.target.value })}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin__ghost admin__danger"
                      onClick={() =>
                        setCategory(category.id, { items: category.items.filter((other) => other.id !== item.id) })
                      }
                    >
                      Șterge<span className="visually-hidden"> {item.name}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="admin__ghost"
            onClick={() =>
              setCategory(category.id, {
                items: [...category.items, { id: newId(), name: '', price: null, description: '' }],
              })
            }
          >
            Adaugă produs
          </button>
        </fieldset>
      ))}
    </section>
  )
}

function ReviewsEditor({ reviews, onChange }: { reviews: Review[]; onChange: (reviews: Review[]) => void }) {
  const setReview = (id: string, patch: Partial<Review>) =>
    onChange(reviews.map((review) => (review.id === id ? { ...review, ...patch } : review)))

  return (
    <section className="admin__section" aria-labelledby="admin-reviews">
      <div className="admin__section-head">
        <h2 id="admin-reviews">Recenzii</h2>
        <button
          type="button"
          className="admin__ghost"
          onClick={() => onChange([...reviews, { id: newId(), author: '', text: '', source: '' }])}
        >
          Adaugă recenzie
        </button>
      </div>
      <p className="admin__empty">
        Adaugă doar recenzii reale, copiate exact și publicate cu acordul autorului.
      </p>

      {reviews.map((review) => (
        <fieldset key={review.id} className="admin__review">
          <legend className="visually-hidden">Recenzie de la {review.author || 'autor necompletat'}</legend>
          <label className="admin__field">
            <span>Autor</span>
            <input value={review.author} onChange={(event) => setReview(review.id, { author: event.target.value })} />
          </label>
          <label className="admin__field">
            <span>Sursa</span>
            <input
              value={review.source}
              placeholder="Google, Facebook…"
              onChange={(event) => setReview(review.id, { source: event.target.value })}
            />
          </label>
          <label className="admin__field admin__field--wide">
            <span>Text</span>
            <textarea rows={3} value={review.text} onChange={(event) => setReview(review.id, { text: event.target.value })} />
          </label>
          <button
            type="button"
            className="admin__ghost admin__danger"
            onClick={() => onChange(reviews.filter((other) => other.id !== review.id))}
          >
            Șterge recenzia
          </button>
        </fieldset>
      ))}
    </section>
  )
}
