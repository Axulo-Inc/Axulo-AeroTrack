import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./components/ui/Toast"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import MainLayout from "./components/Layout/MainLayout"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import Dashboard from "./pages/Dashboard.jsx"
import Fleet from "./pages/Fleet.jsx"
import AircraftDetail from "./pages/AircraftDetail.jsx"
import Maintenance from "./pages/Maintenance.jsx"
import Inventory from "./pages/Inventory.jsx"
import Analytics from "./pages/Analytics.jsx"

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/fleet" element={
            <ProtectedRoute>
              <MainLayout>
                <Fleet />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/fleet/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <AircraftDetail />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/maintenance" element={
            <ProtectedRoute>
              <MainLayout>
                <Maintenance />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <MainLayout>
                <Inventory />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <MainLayout>
                <Analytics />
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
