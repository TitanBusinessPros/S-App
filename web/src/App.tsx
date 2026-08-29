import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Compass } from './pages/Compass'
import { MapWater } from './pages/MapWater'
import { Weather } from './pages/Weather'
import { FirstAid } from './pages/FirstAid'
import { Shelter } from './pages/Shelter'
import { FindingWater } from './pages/FindingWater'
import { Snares } from './pages/Snares'
import { SpeciesNearby } from './pages/SpeciesNearby'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
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
            path="/app/species"
            element={
              <ProtectedRoute>
                <SpeciesNearby />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
