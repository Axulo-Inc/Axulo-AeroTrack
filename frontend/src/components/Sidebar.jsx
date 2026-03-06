import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Plane, 
  Wrench, 
  Package, 
  BarChart3,
  Settings,
  HelpCircle,
  User
} from 'lucide-react'
import { useTheme } from "../contexts/ThemeContext"

function Sidebar() {
  const location = useLocation()
  const { colors, isDark } = useTheme()
  
  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/fleet", icon: Plane, label: "Fleet" },
    { path: "/maintenance", icon: Wrench, label: "Maintenance" },
    { path: "/inventory", icon: Package, label: "Inventory" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <div className={`w-64 ${colors.bg.secondary} p-6 min-h-screen flex flex-col ${isDark ? 'dark' : 'light'}`}>
      {/* Logo */}
      <div className="mb-10">
        <h2 className={`text-xl font-bold ${colors.text.primary} flex items-center gap-2`}>
          <Plane className="text-blue-400" size={24} />
          <span>Axulo<span className="text-blue-400">Aero</span></span>
        </h2>
        <p className={`text-xs ${colors.text.muted} mt-1`}>Aviation Intelligence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive(item.path)
                ? "bg-blue-600 text-white"
                : `${colors.text.tertiary} ${colors.bg.hover}`
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
            {item.label === "Maintenance" && (
              <span className="ml-auto bg-yellow-500 text-xs px-2 py-1 rounded-full text-black">
                3
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer links */}
      <div className={`pt-6 border-t ${colors.border.primary} space-y-1`}>
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${colors.text.tertiary} ${colors.bg.hover} transition`}
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
        <Link
          to="/help"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg ${colors.text.tertiary} ${colors.bg.hover} transition`}
        >
          <HelpCircle size={20} />
          <span className="font-medium">Help</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
