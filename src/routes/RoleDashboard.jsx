import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { getUserRole } from "../../services/authService"

import AdminDashboard from "../admin/AdminDashboard"

export default function RoleDashboard() {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRole = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        setLoading(false)
        return
      }

      const { data: roleData } = await getUserRole(data.user.id)

      setRole(roleData?.role)
      setLoading(false)
    }

    fetchRole()
  }, [])

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Chargement dashboard...
      </div>
    )
  }

  // 🔥 ROUTING PAR ROLE
  switch (role) {

    case "admin_federation":
      return <AdminDashboard />

    case "admin_reseau":
      return <div>Dashboard Réseau</div>

    case "admin_association":
      return <div>Dashboard Association</div>

    default:
      return <div>Dashboard Praticien</div>
  }
}