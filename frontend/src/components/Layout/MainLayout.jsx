import Sidebar from "../Sidebar"
import TopNavbar from "./TopNavbar"
import Footer from "./Footer"

function MainLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-800">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        
        <main className="flex-1 overflow-y-auto bg-slate-800">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
