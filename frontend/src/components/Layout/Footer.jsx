function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <div className="mb-2 md:mb-0">
          © 2026 Axulo AeroTrack. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
