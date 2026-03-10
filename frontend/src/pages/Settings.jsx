import { useState } from "react"
import { 
  Card, 
  Tabs, 
  Button, 
  Input, 
  Select, 
  useToast,
  Badge
} from "../components/ui"
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Save,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Key,
  Trash2
} from 'lucide-react'
import { useTheme } from "../contexts/ThemeContext"
import ThemeSwitcher from "../components/ui/ThemeSwitcher"

function Settings() {
  const toast = useToast()
  const { isDark } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Profile settings
  const [profile, setProfile] = useState({
    name: 'Thabang Motsoahae',
    email: 'thabang@axulo.aero',
    phone: '+27 123 456 789',
    company: 'Axulo Inc',
    role: 'Admin',
    timezone: 'Africa/Johannesburg',
    language: 'English'
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    defectAlerts: true,
    maintenanceReminders: true,
    weeklyReport: true,
    systemUpdates: false,
    marketingEmails: false
  })

  // Security settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    passwordLastChanged: '2024-02-15'
  })

  // Password change
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  // API settings (mock)
  const [apiSettings, setApiSettings] = useState({
    apiKey: 'axl_sk_live_xxxxx12345xxxxx',
    webhookUrl: 'https://api.axulo.aero/webhooks',
    rateLimit: '1000'
  })

  const handleSaveProfile = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
      toast.success('Profile settings saved successfully')
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Notification preferences updated')
    }, 800)
  }

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setPasswords({ current: '', new: '', confirm: '' })
      toast.success('Password changed successfully')
    }, 1000)
  }

  const handleEnable2FA = () => {
    setSecurity({ ...security, twoFactor: true })
    toast.info('2FA setup - In production, this would show QR code')
  }

  const handleRegenerateApiKey = () => {
    setApiSettings({
      ...apiSettings,
      apiKey: 'axl_sk_live_' + Math.random().toString(36).substring(2, 15)
    })
    toast.success('New API key generated')
  }

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Profile Information</h3>
            <Button
              variant={isEditing ? "success" : "primary"}
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              isLoading={loading}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              disabled={!isEditing}
              icon={User}
            />
            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              disabled={!isEditing}
              icon={Mail}
            />
            <Input
              label="Phone Number"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              disabled={!isEditing}
              icon={Phone}
            />
            <Input
              label="Company"
              value={profile.company}
              onChange={(e) => setProfile({...profile, company: e.target.value})}
              disabled={!isEditing}
            />
            <Select
              label="Timezone"
              value={profile.timezone}
              onChange={(e) => setProfile({...profile, timezone: e.target.value})}
              disabled={!isEditing}
              options={[
                { value: 'Africa/Johannesburg', label: 'Johannesburg (GMT+2)' },
                { value: 'Africa/Cairo', label: 'Cairo (GMT+2)' },
                { value: 'Africa/Lagos', label: 'Lagos (GMT+1)' },
                { value: 'Europe/London', label: 'London (GMT)' },
                { value: 'America/New_York', label: 'New York (GMT-5)' },
              ]}
            />
            <Select
              label="Language"
              value={profile.language}
              onChange={(e) => setProfile({...profile, language: e.target.value})}
              disabled={!isEditing}
              options={[
                { value: 'English', label: 'English' },
                { value: 'French', label: 'French' },
                { value: 'Spanish', label: 'Spanish' },
                { value: 'Arabic', label: 'Arabic' },
              ]}
            />
          </div>

          {!isEditing && (
            <div className="bg-slate-900 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Account created: March 1, 2026</p>
              <p className="text-sm text-gray-400">Last login: Today at 09:42 AM</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
            <Button
              variant="primary"
              onClick={handleSaveNotifications}
              isLoading={loading}
              icon={Save}
            >
              Save Preferences
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { id: 'emailAlerts', label: 'Email Alerts', description: 'Receive important alerts via email' },
              { id: 'defectAlerts', label: 'Defect Alerts', description: 'Get notified when new defects are reported' },
              { id: 'maintenanceReminders', label: 'Maintenance Reminders', description: 'Receive reminders for upcoming maintenance' },
              { id: 'weeklyReport', label: 'Weekly Report', description: 'Weekly summary of fleet status' },
              { id: 'systemUpdates', label: 'System Updates', description: 'Notifications about new features and updates' },
              { id: 'marketingEmails', label: 'Marketing Emails', description: 'Product updates and offers' },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications[item.id]}
                    onChange={(e) => setNotifications({...notifications, [item.id]: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Security Settings</h3>
          
          {/* Password Change */}
          <Card>
            <Card.Header>
              <h4 className="font-medium text-white">Change Password</h4>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Current Password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    icon={Lock}
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    icon={Key}
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Confirm New Password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    icon={Key}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showPassword ? 'Hide' : 'Show'} passwords
                  </button>
                </div>
                <Button
                  variant="primary"
                  onClick={handleChangePassword}
                  isLoading={loading}
                >
                  Update Password
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <Card.Header>
              <h4 className="font-medium text-white">Two-Factor Authentication</h4>
            </Card.Header>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Add an extra layer of security</p>
                  <p className="text-sm text-gray-400">Protect your account with 2FA</p>
                </div>
                {security.twoFactor ? (
                  <Badge variant="success">Enabled</Badge>
                ) : (
                  <Button variant="primary" size="sm" onClick={handleEnable2FA}>
                    Enable 2FA
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Session Management */}
          <Card>
            <Card.Header>
              <h4 className="font-medium text-white">Session Management</h4>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Current Session</p>
                    <p className="text-sm text-gray-400">Chrome on MacOS • Johannesburg, ZA</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <Select
                  label="Session Timeout"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                  options={[
                    { value: '15', label: '15 minutes' },
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '1 hour' },
                    { value: '120', label: '2 hours' },
                  ]}
                />
                <Button variant="danger" size="sm">Sign Out All Devices</Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Theme Preferences</h3>
          
          <Card>
            <Card.Body>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Theme Mode</p>
                    <p className="text-sm text-gray-400">Choose your preferred color scheme</p>
                  </div>
                  <ThemeSwitcher variant="dropdown" />
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <p className="text-white mb-3">Preview</p>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-white'} border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className="flex gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded"></div>
                      <div className="w-8 h-8 bg-green-500 rounded"></div>
                      <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                      <div className="w-8 h-8 bg-red-500 rounded"></div>
                    </div>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>Sample text in current theme</p>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Secondary text example</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    },
    {
      id: 'api',
      label: 'API & Integrations',
      icon: Database,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">API Settings</h3>
          
          <Card>
            <Card.Header>
              <h4 className="font-medium text-white">API Keys</h4>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Live API Key
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={apiSettings.apiKey}
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="secondary" onClick={handleRegenerateApiKey}>
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Keep this key secret. Never share it publicly.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Webhook URL
                  </label>
                  <Input
                    value={apiSettings.webhookUrl}
                    onChange={(e) => setApiSettings({...apiSettings, webhookUrl: e.target.value})}
                    placeholder="https://your-server.com/webhook"
                  />
                </div>

                <Select
                  label="Rate Limit"
                  value={apiSettings.rateLimit}
                  onChange={(e) => setApiSettings({...apiSettings, rateLimit: e.target.value})}
                  options={[
                    { value: '100', label: '100 requests per minute' },
                    { value: '500', label: '500 requests per minute' },
                    { value: '1000', label: '1000 requests per minute' },
                    { value: '5000', label: '5000 requests per minute' },
                  ]}
                />

                <Button variant="primary" icon={Save}>
                  Save API Settings
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h4 className="font-medium text-white">Connected Integrations</h4>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Globe size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">OpenSky Network</p>
                      <p className="text-xs text-gray-400">Flight data integration</p>
                    </div>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                      <Bell size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Slack</p>
                      <p className="text-xs text-gray-400">Notification channel</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Mail size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Microsoft Teams</p>
                      <p className="text-xs text-gray-400">Coming soon</p>
                    </div>
                  </div>
                  <Badge variant="default">Soon</Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )
    }
  ]

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs tabs={tabs} defaultTab="profile" variant="pills" />
    </div>
  )
}

export default Settings
