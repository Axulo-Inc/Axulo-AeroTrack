import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plane, Mail, Lock, User, Phone } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input, Card, useToast } from '../../components/ui'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [agreeTerms, setAgreeTerms] = useState(false)
  
  const { register, loading } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name) {
      newErrors.name = 'Full name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const result = await register(formData)
    if (result.success) {
      toast.success('Registration successful! Welcome to Axulo AeroTrack.')
      navigate('/')
    } else {
      toast.error(result.error || 'Registration failed')
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
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 mt-2">Join Axulo AeroTrack today</p>
        </div>

        {/* Register Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              name="name"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="john@axulo.aero"
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+27 123 456 789"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
            />

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Register
