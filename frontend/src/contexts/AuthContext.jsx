import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

// Key for localStorage
const USERS_STORAGE_KEY = 'axulo_users'
const SESSION_KEY = 'axulo_session'

// Helper to get users from localStorage
const getStoredUsers = () => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Helper to save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Initialize with demo user if no users exist
  useEffect(() => {
    const users = getStoredUsers()
    if (users.length === 0) {
      const demoUser = {
        id: 1,
        name: 'Thabang Motsoahae',
        email: 'thabang@axulo.aero',
        phone: '+27 123 456 789',
        password: 'password',
        role: 'Admin',
        createdAt: new Date().toISOString()
      }
      saveUsers([demoUser])
    }
  }, [])

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
      const userData = JSON.parse(session)
      setUser(userData)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    
    try {
      // Get users from storage
      const users = getStoredUsers()
      
      // Find user with matching email and password
      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )
      
      if (foundUser) {
        // Don't store password in session
        const { password: _, ...userWithoutPassword } = foundUser
        localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword))
        setUser(userWithoutPassword)
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
      // Get existing users
      const users = getStoredUsers()
      
      // Check if email already exists
      const existingUser = users.find(
        u => u.email.toLowerCase() === userData.email.toLowerCase()
      )
      
      if (existingUser) {
        throw new Error('Email already registered')
      }
      
      // Create new user with unique ID
      const newUser = {
        id: users.length + 1,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: 'User',
        createdAt: new Date().toISOString()
      }
      
      // Save to storage
      const updatedUsers = [...users, newUser]
      saveUsers(updatedUsers)
      
      // Auto login after registration
      const { password: _, ...userWithoutPassword } = newUser
      localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)
      
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
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
