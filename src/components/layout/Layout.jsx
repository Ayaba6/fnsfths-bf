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
      <div className="h-screen flex items-center justify-center">
        Chargement...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b p-3 flex items-center justify-between z-50">
        <h1 className="font-bold text-green-600">FNSTHS</h1>

        <button onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div
        className={`
          fixed md:static z-40 h-full md:h-auto
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar role={role} onClose={() => setOpen(false)} />
      </div>

      {/* ================= OVERLAY MOBILE ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-6 overflow-y-auto md:ml-64 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  )
}