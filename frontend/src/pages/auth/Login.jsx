import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plane, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input, Card, useToast } from '../../components/ui'

function Login() {
  const [email, setEmail] = useState('thabang@axulo.aero')
  const [password, setPassword] = useState('password')
  const [errors, setErrors] = useState({})
  const { login, loading } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const result = await login(email, password)
    if (result.success) {
      toast.success('Login successful!')
      navigate('/')
    } else {
      toast.error(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-2xl">
              <Plane size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-400 mt-2">Sign in to your Axulo AeroTrack account</p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="thabang@axulo.aero"
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Demo: <span className="text-blue-400">thabang@axulo.aero</span> / password
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
