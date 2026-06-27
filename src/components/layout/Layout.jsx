import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import Sidebar from "../layout/Sidebar"

export default function Layout({ children }) {
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setRole("")
        setLoading(false)
        return
      }

      // 🔥 IMPORTANT: table user_roles (corrigé)
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

      {/* SIDEBAR DYNAMIQUE */}
      <Sidebar role={role} />

      {/* CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}