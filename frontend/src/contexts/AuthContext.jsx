import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

// Mock user data (replace with real API later)
const MOCK_USER = {
  id: 1,
  name: 'John Doe',
  email: 'john@axulo.aero',
  role: 'Admin',
  avatar: null
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // In a real app, verify token with backend
      setUser(MOCK_USER)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    
    try {
      // Mock login - replace with actual API call
      if (email === 'john@axulo.aero' && password === 'password') {
        const token = 'mock-jwt-token'
        localStorage.setItem('token', token)
        setUser(MOCK_USER)
        navigate('/')
        return { success: true }
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setError(null)
    setLoading(true)
    
    try {
      // Mock registration - replace with actual API call
      const token = 'mock-jwt-token'
      localStorage.setItem('token', token)
      setUser({ ...MOCK_USER, ...userData })
      navigate('/')
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
