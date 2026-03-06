import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, Button, Input, useToast, Tabs } from '../components/ui'
import Avatar from '../components/ui/Avatar'
import { Mail, Phone, MapPin, Calendar, Shield, Save, Key } from 'lucide-react'

function Profile() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Thabang Motsoahae',
    email: user?.email || 'thabang@axulo.aero',
    phone: user?.phone || '+27 123 456 789',
    location: 'Johannesburg, South Africa',
    department: 'Flight Operations',
    joinDate: '2024-01-15',
    role: user?.role || 'Admin',
    bio: 'Aviation maintenance professional with 10+ years of experience in fleet management and reliability engineering.',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [avatar, setAvatar] = useState(null)

  const handleProfileUpdate = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    }, 1000)
  }

  const handlePasswordChange = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      toast.success('Password changed successfully')
    }, 1000)
  }

  const handleAvatarUpload = async (file) => {
    // Simulate upload to server
    const imageUrl = URL.createObjectURL(file)
    setAvatar(imageUrl)
    toast.success('Avatar updated successfully')
  }

  const tabs = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: Mail,
      content: (
        <div className="space-y-6">
          {/* Profile Header with Avatar */}
          <div className="flex items-start gap-6">
            <Avatar
              src={avatar}
              name={profileData.name}
              size="2xl"
              editable={true}
              onUpload={handleAvatarUpload}
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
              <p className="text-gray-400">{profileData.role}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="success">Active</Badge>
                <Badge variant="info">Verified</Badge>
              </div>
            </div>
            <Button
              variant={isEditing ? "success" : "primary"}
              onClick={() => isEditing ? handleProfileUpdate() : setIsEditing(true)}
              isLoading={loading && isEditing}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              icon={User}
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              disabled={!isEditing}
            />
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              disabled={!isEditing}
            />
            <Input
              label="Phone Number"
              icon={Phone}
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              disabled={!isEditing}
            />
            <Input
              label="Location"
              icon={MapPin}
              value={profileData.location}
              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              disabled={!isEditing}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              disabled={!isEditing}
              rows={4}
              className="w-full bg-slate-900 text-white rounded-lg border border-slate-700 p-3 focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
            />
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={18} />
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-white">{new Date(profileData.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="text-gray-400" size={18} />
              <div>
                <p className="text-sm text-gray-400">Department</p>
                <p className="text-white">{profileData.department}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">Change Password</h3>
          
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              icon={Key}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type="password"
              icon={Key}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              placeholder="Enter new password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              icon={Key}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              placeholder="Confirm new password"
            />
          </div>

          <Button
            variant="primary"
            onClick={handlePasswordChange}
            isLoading={loading}
          >
            Update Password
          </Button>

          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div>
                <p className="text-white font-medium">Enable 2FA</p>
                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Sessions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                <div>
                  <p className="text-white font-medium">Current Session</p>
                  <p className="text-sm text-gray-400">Chrome on MacOS • Johannesburg, ZA</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <Button variant="danger" size="sm">Sign Out All Devices</Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
          
          {[
            { id: 'email_alerts', label: 'Email Alerts', description: 'Receive email notifications for important updates' },
            { id: 'defect_alerts', label: 'Defect Alerts', description: 'Get notified when new defects are reported' },
            { id: 'maintenance_reminders', label: 'Maintenance Reminders', description: 'Receive reminders for upcoming maintenance' },
            { id: 'weekly_report', label: 'Weekly Report', description: 'Get weekly summary of fleet status' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 text-white bg-slate-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      
      <Tabs tabs={tabs} defaultTab="profile" variant="pills" />
    </div>
  )
}

// Import missing icons
import { User, Bell } from 'lucide-react'
import Badge from '../components/ui/Badge'

export default Profile
