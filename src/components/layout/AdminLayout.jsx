import Sidebar from "./Sidebar"

export default function AdminLayout({ children }) {
  return (
    <div className="flex bg-gray-50 min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  )
}