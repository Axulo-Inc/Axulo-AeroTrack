import { useTheme } from "../../contexts/ThemeContext"

function Footer() {
  const { colors } = useTheme()

  return (
    <footer className={`${colors.bg.secondary} border-t ${colors.border.primary} py-4 px-6`}>
      <div className={`flex flex-col md:flex-row justify-between items-center text-sm ${colors.text.muted}`}>
        <div className="mb-2 md:mb-0">
          © 2026 Axulo AeroTrack. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className={`${colors.text.tertiary} hover:${colors.text.primary} transition`}>Privacy Policy</a>
          <a href="#" className={`${colors.text.tertiary} hover:${colors.text.primary} transition`}>Terms of Service</a>
          <a href="#" className={`${colors.text.tertiary} hover:${colors.text.primary} transition`}>Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
