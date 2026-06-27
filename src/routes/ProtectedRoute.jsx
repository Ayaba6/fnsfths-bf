import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../services/supabase"
import { getUserRole } from "../services/authService"

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const checkRole = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        setAllowed(false)
        setLoading(false)
        return
      }

      const { data: roleData } = await getUserRole(data.user.id)

      const role = roleData?.role ?? null

      if (allowedRoles.includes(role)) {
        setAllowed(true)
      } else {
        setAllowed(false)
      }

      setLoading(false)
    }

    checkRole()
  }, [allowedRoles])

  if (loading) return <p>Chargement...</p>

  if (!allowed) return <Navigate to="/" />

  return children
}