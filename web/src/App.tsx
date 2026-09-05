import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { Login } from './pages/Login'
import { Upgrade } from './pages/Upgrade'
import { Admin } from './pages/Admin'
import { Terms } from './pages/Terms'
import { Privacy } from './pages/Privacy'
import { Dashboard } from './pages/Dashboard'
import { Compass } from './pages/Compass'
import { MapWater } from './pages/MapWater'
import { Weather } from './pages/Weather'
import { FirstAid } from './pages/FirstAid'
import { Shelter } from './pages/Shelter'
import { FindingWater } from './pages/FindingWater'
import { Snares } from './pages/Snares'
import { FireStarting } from './pages/FireStarting'
import { WaterPurification } from './pages/WaterPurification'
import { SpeciesNearby } from './pages/SpeciesNearby'
import { Recipes } from './pages/Recipes'

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
            path="/app/map"
            element={
              <ProtectedRoute>
                <MapWater />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/weather"
            element={
              <ProtectedRoute>
                <Weather />
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
                <Shelter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/water-sourcing"
            element={
              <ProtectedRoute>
                <FindingWater />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/snares"
            element={
              <ProtectedRoute>
                <Snares />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/fire-starting"
            element={
              <ProtectedRoute>
                <FireStarting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/water-purification"
            element={
              <ProtectedRoute>
                <WaterPurification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/species"
            element={
              <ProtectedRoute>
                <SpeciesNearby />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/recipes"
            element={
              <ProtectedRoute>
                <Recipes />
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
      </AuthProvider>
    </BrowserRouter>
  )
}
