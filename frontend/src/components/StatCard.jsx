import { useTheme } from "../contexts/ThemeContext"
import { Card } from "./ui"

function StatCard({ title, value, color }) {
  const { isDark } = useTheme()
  
  // Log for debugging
  console.log('StatCard rendering:', { title, isDark, color })

  // Determine the color class for the value
  let valueColorClass = ''
  
  if (color) {
    // Use provided color (like text-red-400, text-green-400, etc.)
    valueColorClass = color
  } else {
    // For Total Aircraft (no color prop), use blue
    valueColorClass = 'text-blue-600'  // Blue for both modes
  }

  // Title color based on theme
  const titleColorClass = isDark ? 'text-gray-400' : 'text-gray-600'

  return (
    <Card>
      <Card.Body>
        <p className={`text-sm ${titleColorClass} mb-2`}>
          {title}
        </p>
        <p className={`text-2xl font-bold ${valueColorClass}`}>
          {value}
        </p>
      </Card.Body>
    </Card>
  )
}

export default StatCard
