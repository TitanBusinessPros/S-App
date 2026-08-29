import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Compass } from './pages/Compass'
import { MapWater } from './pages/MapWater'
import { Weather } from './pages/Weather'

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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
