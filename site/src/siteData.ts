import { useSyncExternalStore } from 'react'

/**
 * Date editabile din panoul admin: meniul cu prețuri și recenziile.
 *
 * DEMO: datele se salvează în localStorage, deci rămân doar în browserul în care
 * au fost introduse. Pentru un site public, același format trebuie mutat într-un
 * backend cu autentificare reală (vezi README).
 */

export type MenuItem = {
  id: string
  name: string
  /** Prețul în lei; null dacă încă nu e stabilit. */
  price: number | null
  description: string
}

export type MenuCategory = {
  id: string
  name: string
  items: MenuItem[]
}

export type Review = {
  id: string
  author: string
  text: string
  /** De unde provine recenzia, de ex. „Google” sau „Facebook”. */
  source: string
}

export type SiteData = {
  menu: MenuCategory[]
  reviews: Review[]
  updatedAt: string | null
}

const STORAGE_KEY = 'ramura-demo-data-v1'
const CHANGE_EVENT = 'ramura-data-change'

/** Pornim gol: nimic inventat până nu introduce proprietarul. */
export const emptyData: SiteData = { menu: [], reviews: [], updatedAt: null }

let cachedRaw: string | null | undefined
let cachedData: SiteData = emptyData

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function getSnapshot(): SiteData {
  const raw = readRaw()
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedData = parseData(raw)
  }
  return cachedData
}

export function parseData(raw: string | null): SiteData {
  if (!raw) return emptyData
  try {
    const value = JSON.parse(raw) as Partial<SiteData>
    return {
      menu: Array.isArray(value.menu) ? value.menu : [],
      reviews: Array.isArray(value.reviews) ? value.reviews : [],
      updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null,
    }
  } catch {
    return emptyData
  }
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

export function useSiteData(): SiteData {
  return useSyncExternalStore(subscribe, getSnapshot, () => emptyData)
}

/** Salvează datele; întoarce false dacă browserul refuză stocarea. */
export function saveSiteData(data: SiteData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }))
    window.dispatchEvent(new Event(CHANGE_EVENT))
    return true
  } catch {
    return false
  }
}

export function clearSiteData() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Stocarea indisponibilă: nu e nimic de șters.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

const priceFormat = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 2 })

export function formatPrice(price: number | null): string {
  return price === null ? 'preț la cafenea' : `${priceFormat.format(price)} lei`
}
