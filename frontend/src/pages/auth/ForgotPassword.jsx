import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button, Input, Card, useToast } from '../../components/ui'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (email) {
        setSubmitted(true)
        toast.success('Password reset instructions sent to your email')
      } else {
        setError('Please enter your email address')
        toast.error('Please enter your email address')
      }
      setLoading(false)
    }, 1000)
  }

  const handleReset = () => {
    setSubmitted(false)
    setEmail('')
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
          <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          <p className="text-gray-400 mt-2">
            {submitted 
              ? 'Check your email for instructions' 
              : 'Enter your email to receive reset instructions'}
          </p>
        </div>

        <Card>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                placeholder="john@axulo.aero"
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            // Success Message
            <div className="text-center py-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-500" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Check Your Email</h3>
              <p className="text-gray-400 mb-6">
                We've sent password reset instructions to <br />
                <span className="text-blue-400 font-medium">{email}</span>
              </p>
              <Button
                variant="ghost"
                onClick={handleReset}
                fullWidth
              >
                Try a different email
              </Button>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="text-center mt-6 pt-4 border-t border-slate-700">
            <Link 
              to="/login" 
              className="text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword
