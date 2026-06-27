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
    setError("")
    setLoading(true)

    console.log("🚀 LOGIN START")
    console.log("Email:", email)

    try {
      // 🔐 LOGIN SUPABASE
      const { data, error: loginError } = await login(email, password)

      console.log("📦 SUPABASE RESPONSE:", { data, loginError })

      if (loginError) {
        console.log("❌ LOGIN ERROR:", loginError.message)
        setError(loginError.message || "Erreur login Supabase")
        setLoading(false)
        return
      }

      const user = data?.user

      console.log("👤 USER:", user)

      if (!user) {
        setError("Utilisateur introuvable")
        setLoading(false)
        return
      }

      // 🔥 GET ROLE
      const { data: roleData, error: roleError } = await getUserRole(user.id)

      console.log("🏷️ ROLE DATA:", roleData)
      console.log("⚠️ ROLE ERROR:", roleError)

      const role = roleData?.role?.trim()

      console.log("🎯 ROLE FINAL:", role)

      // 🚀 REDIRECTION PROPRE
      const roleMap = {
        admin_federation: "/admin",
        reseau: "/reseau",
        association: "/association"
      }

      const redirectPath = roleMap[role]

      if (redirectPath) {
        console.log("➡️ REDIRECT:", redirectPath)
        navigate(redirectPath)
      } else {
        console.log("⚠️ ROLE UNKNOWN → fallback")
        setError("Rôle non défini. Contactez l'administrateur.")
        navigate("/")
      }

    } catch (err) {
      console.log("❌ LOGIN EXCEPTION:", err)
      setError("Erreur serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 shadow-lg rounded-xl w-80"
      >

        <h1 className="text-xl font-bold mb-4 text-center">
          Login FNSTHS
        </h1>

        {error && (
          <p className="text-red-600 mb-3 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded transition"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

      </form>
    </div>
  )
}