import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, getUserRole } from "../../services/authService"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"

/* 🚨 ASSURE-TOI QUE LE CHEMIN VERS TON LOGO EST CORRECT */
import logoImage from "../../assets/logo.JPG" 

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { data, error: loginError } = await login(email, password)
      if (loginError) throw loginError

      const user = data?.user
      if (!user) throw new Error("Utilisateur introuvable")

      const { data: roleData, error: roleError } = await getUserRole(user.id)
      if (roleError || !roleData) {
        throw new Error("Erreur lors de la récupération de votre rôle.")
      }

      const role = roleData.role?.trim()
      const organisation_id = roleData.organisation_id

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
      // Traduction ou affichage d'un message d'erreur plus convivial
      setError(err.message === "Invalid login credentials" 
        ? "Identifiants ou mot de passe incorrects." 
        : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 w-full max-w-md rounded-2xl border border-gray-100 shadow-xl space-y-6">
        
        {/* LOGO & REPERES VISUELS */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <img 
            src={logoImage} 
            alt="Logo FNSTHS/BF" 
            className="w-32 h-auto object-contain mix-blend-multiply"
          />
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Portail F.N.S.F.T.H.S / BF
            </h1>
            <p className="text-xs text-gray-400 font-medium max-w-xs uppercase tracking-wider">
              Fédération Nationale Sans Frontière des Tradipraticiens et Herboristes de Santé
            </p>
          </div>
        </div>

        {/* MESSAGES D'ERREUR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3.5 rounded-xl flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORMULAIRE DE CONNEXION */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* CHAMP EMAIL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Adresse Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 bg-gray-50/50 focus-within:ring-2 focus-within:ring-green-600/20 focus-within:border-green-600 focus-within:bg-white transition-all">
              <Mail size={18} className="text-gray-400 shrink-0" />
              <input
                type="email"
                required
                className="p-3 bg-transparent outline-none w-full text-sm placeholder-gray-400 text-gray-800"
                placeholder="nom@exemple.com"
                value={email}
                disabled={loading}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* CHAMP MOT DE PASSE */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              Mot de passe
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 bg-gray-50/50 focus-within:ring-2 focus-within:ring-green-600/20 focus-within:border-green-600 focus-within:bg-white transition-all">
              <Lock size={18} className="text-gray-400 shrink-0" />
              <input
                type="password"
                required
                className="p-3 bg-transparent outline-none w-full text-sm placeholder-gray-400 text-gray-800"
                placeholder="••••••••"
                value={password}
                disabled={loading}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* BOUTON SOUMISSION */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:opacity-60 text-white font-semibold p-3 rounded-xl text-sm shadow-sm shadow-green-600/10 flex items-center justify-center gap-2 transition-all mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Vérification du compte...</span>
              </>
            ) : (
              <span>Se connecter à mon espace</span>
            )}
          </button>

        </form>
        
        {/* FOOTER DISCRET */}
        <p className="text-center text-[11px] text-gray-400 font-medium">
          Burkina Faso • Santé Globale & Traditionnelle
        </p>
      </div>
    </div>
  )
}