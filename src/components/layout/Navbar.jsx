import { useAuth } from "../../context/AuthContext"
import { logout } from "../../services/authService"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h2 className="font-semibold text-gray-700">
        Système de gestion FNSTHS
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.email}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded"
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}