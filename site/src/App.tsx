import { SiteHeader } from './components/SiteHeader'
import { Hero } from './components/Hero'
import { StorySection } from './components/StorySection'
import { ExperienceSection } from './components/ExperienceSection'
import { MenuPreview } from './components/MenuPreview'
import { VisitSection } from './components/VisitSection'
import { SiteFooter } from './components/SiteFooter'
import { lazy, Suspense, useSyncExternalStore } from 'react'
import { MotionConfig } from 'motion/react'
import { ReviewsSection } from './components/ReviewsSection'
import './App.css'

const AdminPage = lazy(() => import('./components/AdminPage').then((m) => ({ default: m.AdminPage })))

function subscribeHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const isAdminHash = () => window.location.hash === '#admin'

export default function App() {
  const admin = useSyncExternalStore(subscribeHash, isAdminHash, () => false)

  if (admin) {
    return (
      <Suspense fallback={<p className="admin-loading">Se încarcă panoul…</p>}>
        <AdminPage />
      </Suspense>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#continut">
        Sari la conținut
      </a>
      <SiteHeader />
      <main id="continut">
        <Hero />
        <StorySection />
        <ExperienceSection />
        <ReviewsSection />
        <MenuPreview />
        <VisitSection />
      </main>
      <SiteFooter />
    </MotionConfig>
  )
}
