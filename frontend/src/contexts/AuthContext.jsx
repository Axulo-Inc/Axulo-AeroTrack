import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/auth.service'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    
    try {
      const response = await authService.login(email, password)
      setUser(response.user)
      navigate('/')
      return { success: true }
    } catch (err) {
      setError(err.message || 'Login failed')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setError(null)
    setLoading(true)
    
    try {
      const response = await authService.register(userData)
      setUser(response.user)
      navigate('/')
      return { success: true }
    } catch (err) {
      setError(err.message || 'Registration failed')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    navigate('/login')
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData)
      setUser(response.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
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
