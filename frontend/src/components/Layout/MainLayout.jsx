import Sidebar from "../Sidebar"
import TopNavbar from "./TopNavbar"
import Footer from "./Footer"
import { useTheme } from "../../contexts/ThemeContext"

function MainLayout({ children }) {
  const { isDark, colors } = useTheme()

  return (
    <div className={`flex h-screen ${isDark ? 'dark' : 'light'} ${colors.bg.primary}`}>
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        
        <main className={`flex-1 overflow-y-auto ${colors.bg.primary}`}>
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
