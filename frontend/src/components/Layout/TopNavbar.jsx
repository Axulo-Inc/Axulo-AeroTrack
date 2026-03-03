import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

function TopNavbar() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or filter logic
      console.log('Searching for:', searchQuery)
      // You can implement search functionality here
    }
  }

  const handleLogout = () => {
    logout()
  }

  const handleNavigation = (path) => {
    navigate(path)
    setShowUserMenu(false)
  }

  return (
    <div className="bg-slate-900 border-b border-slate-700 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search aircraft, defects, or parts..."
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition"
            />
          </form>
        </div>

        {/* Right side - Icons & User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-slate-700 cursor-pointer border-b border-slate-700">
                    <p className="text-sm text-white">New defect reported on ZS-ABC</p>
                    <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                  </div>
                  <div className="p-4 hover:bg-slate-700 cursor-pointer border-b border-slate-700">
                    <p className="text-sm text-white">Maintenance due for ZS-DEF</p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                  <div className="p-4 hover:bg-slate-700 cursor-pointer">
                    <p className="text-sm text-white">Low stock alert: Hydraulic Pump</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-700 text-center">
                  <button className="text-sm text-blue-400 hover:text-blue-300">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-slate-800 rounded-lg p-2 transition"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-white">{user?.name || 'John Doe'}</p>
                <p className="text-xs text-gray-400">{user?.role || 'Admin'}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
                <div className="p-2">
                  <button 
                    onClick={() => handleNavigation('/profile')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 rounded-lg flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button 
                    onClick={() => handleNavigation('/settings')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 rounded-lg flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <div className="border-t border-slate-700 my-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-lg flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNavbar
