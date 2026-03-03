import { createContext, useState, useContext } from "react"

const DefectsContext = createContext()

export const DefectsProvider = ({ children }) => {
  const [defects, setDefects] = useState([
    { id: 1, aircraftId: 1, description: "Hydraulic pressure fluctuation", severity: "Medium", status: "Open" },
    { id: 2, aircraftId: 1, description: "Cabin light malfunction", severity: "Low", status: "Closed" },
    { id: 3, aircraftId: 2, description: "Engine vibration warning", severity: "High", status: "Open" },
    { id: 4, aircraftId: 3, description: "Landing gear sensor fault", severity: "Medium", status: "Open" },
  ])

  const addDefect = (newDefect) => {
    const newId = defects.length + 1
    setDefects([...defects, { id: newId, ...newDefect }])
  }

  return (
    <DefectsContext.Provider value={{ defects, addDefect }}>
      {children}
    </DefectsContext.Provider>
  )
}

export const useDefects = () => useContext(DefectsContext)
