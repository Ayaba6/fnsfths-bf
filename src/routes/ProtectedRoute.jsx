import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../services/supabase"
import { getUserRole } from "../services/authService"

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) return setLoading(false)

      const { data: roleData } = await getUserRole(data.user.id)

      const role = roleData?.role

      setAllowed(allowedRoles.includes(role))
      setLoading(false)
    }

    check()
  }, [])

  if (loading) return <p>Chargement...</p>

  if (!allowed) return <Navigate to="/" />

  return children
}