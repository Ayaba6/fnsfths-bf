import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, getUserRole } from "../../services/authService"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error: loginError } = await login(email, password)

      if (loginError) throw loginError

      const user = data?.user
      if (!user) throw new Error("Utilisateur introuvable")

      const { data: roleData, error: roleError } = await getUserRole(user.id)

      if (roleError || !roleData) {
        throw new Error("Erreur récupération rôle")
      }

      const role = roleData.role?.trim()
      const organisation_id = roleData.organisation_id

      // 🔥 STOCKAGE GLOBAL
      localStorage.setItem("user", JSON.stringify({
        id: user.id,
        role,
        organisation_id
      }))

      const routes = {
        admin_federation: "/admin",
        reseau: "/reseau",
        association: "/association"
      }

      navigate(routes[role] || "/")

    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 w-80 rounded-xl shadow">

        <h1 className="text-xl font-bold mb-4">Login FNSTHS</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="bg-green-600 text-white w-full p-2 rounded">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  )
}