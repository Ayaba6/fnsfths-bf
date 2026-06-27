import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import Sidebar from "../layout/Sidebar"
import { Menu, X } from "lucide-react"

export default function Layout({ children }) {
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setRole("")
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single()

      if (error) {
        console.log("ROLE ERROR:", error.message)
        setRole("")
      } else {
        setRole((data?.role || "").toLowerCase().trim())
      }
      setLoading(false)
    }

    fetchRole()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 text-gray-500">
        Chargement...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b px-4 flex items-center justify-between z-50 shadow-sm">
        <h1 className="font-bold text-green-600">FNSTHS</h1>
        <button 
          onClick={() => setOpen(!open)}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ================= SIDEBAR ================= */}
      {/* CORRECTION : Reste en fixed sur desktop pour un comportement de dashboard classique */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 h-full w-64 bg-white
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar role={role} onClose={() => setOpen(false)} />
      </div>

      {/* ================= OVERLAY MOBILE ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30 backdrop-blur-xs"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= MAIN CONTENT ================= */}
      {/* CORRECTION : md:ml-64 fonctionne parfaitement maintenant car la sidebar est fixed */}
      <main className="flex-1 min-w-0 overflow-y-auto md:ml-64 pt-20 md:pt-0">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
}