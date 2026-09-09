import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PaidFeatureRoute } from './components/PaidFeatureRoute'
import { AdminRoute } from './components/AdminRoute'
import { UpdatePrompt } from './components/UpdatePrompt'
import { AnalyticsPageViews } from './components/AnalyticsPageViews'
import { Login } from './pages/Login'
import { Upgrade } from './pages/Upgrade'
import { Admin } from './pages/Admin'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { Dashboard } from './pages/Dashboard'
import { Compass } from './pages/Compass'
import { MoonPhase } from './pages/MoonPhase'
import { SosBeacon } from './pages/SosBeacon'
import { SolunarCalculator } from './pages/SolunarCalculator'
import { Search } from './pages/Search'
import { FirstAid } from './pages/FirstAid'
import { Shelter } from './pages/Shelter'
import { FindingWater } from './pages/FindingWater'
import { Snares } from './pages/Snares'
import { FireStarting } from './pages/FireStarting'
import { WaterPurification } from './pages/WaterPurification'
import { Waypoints } from './pages/Waypoints'
import { SpeciesNearby } from './pages/SpeciesNearby'
import { Recipes } from './pages/Recipes'

// Lazy-loaded on its own: MapWater pulls in Leaflet, which is heavy enough
// to keep out of the initial page load's critical path. Kept split into
// its own chunk after a since-removed MapLibre GL dependency briefly pushed
// the app's precached bundle over the PWA's 2 MiB service-worker limit --
// the split is still a reasonable win on its own, independent of that.
const MapWater = lazy(() => import('./pages/MapWater').then((m) => ({ default: m.MapWater })))
// Same reasoning: Map3D pulls in plain MapLibre GL (~1 MB), only needed by
// someone who actually opens this page.
const Map3D = lazy(() => import('./pages/Map3D').then((m) => ({ default: m.Map3D })))
// Also Leaflet, same reasoning as MapWater -- Rollup automatically shares
// the Leaflet code between this chunk and MapWater's rather than bundling
// two separate copies, since both are lazy-loaded.
const TopographyMap = lazy(() => import('./pages/TopographyMap').then((m) => ({ default: m.TopographyMap })))

function MapWaterFallback() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <p className="mono">Loading map…</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/compass"
            element={
              <ProtectedRoute>
                <Compass />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/moon-phase"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <MoonPhase />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/solunar"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <SolunarCalculator />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/search"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <Search />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/sos-beacon"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <SosBeacon />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/map"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <Suspense fallback={<MapWaterFallback />}>
                    <MapWater />
                  </Suspense>
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/topography"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <Suspense fallback={<MapWaterFallback />}>
                    <TopographyMap />
                  </Suspense>
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/map3d"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <Suspense fallback={<MapWaterFallback />}>
                    <Map3D />
                  </Suspense>
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/first-aid"
            element={
              <ProtectedRoute>
                <FirstAid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/shelter"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <Shelter />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/water-sourcing"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <FindingWater />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/snares"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <Snares />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/fire-starting"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <FireStarting />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/water-purification"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <WaterPurification />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/waypoints"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <Waypoints />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/species"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <SpeciesNearby />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/recipes"
            element={
              <ProtectedRoute>
                <PaidFeatureRoute>
                  <Recipes />
                </PaidFeatureRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/upgrade"
            element={
              <ProtectedRoute>
                <Upgrade />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
        <AnalyticsPageViews />
        <UpdatePrompt />
      </AuthProvider>
    </BrowserRouter>
  )
}
