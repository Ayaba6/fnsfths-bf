import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, getUserRole } from "../../services/authService"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"

/* 🚨 ASSURE-TOI QUE LE CHEMIN VERS TON LOGO EST CORRECT */
import logoImage from "../../assets/logo.JPG";

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
      setError(err.message === "Invalid login credentials" 
        ? "Identifiants ou mot de passe incorrects." 
        : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-slate-900 p-4 overflow-hidden">
      
      {/* Style CSS pour neutraliser le fond blanc/jaune de l'autofill du navigateur */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0 30px rgba(0, 0, 0, 0.25) inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Éléments décoratifs lumineux en arrière-plan */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* CARTE AVEC EFFET VITRÉ (GLASSMORPHISM) */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl p-8 sm:p-10 w-full max-w-md rounded-[2.5rem] border border-white/20 shadow-2xl space-y-6 text-white">
        
        {/* LOGO & REPERES VISUELS */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="p-3 bg-white/90 rounded-2xl shadow-inner">
            <img 
              src={logoImage} 
              alt="Logo FNSTHS/BF" 
              className="w-24 h-auto object-contain mix-blend-multiply"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-serif font-bold tracking-tight text-white">
              Portail F.N.S.F.T.H.S / BF
            </h1>
            <p className="text-[11px] text-green-200/80 font-medium max-w-xs uppercase tracking-wider">
              Fédération Nationale Sans Frontière des Tradipraticiens et Herboristes de Santé
            </p>
          </div>
        </div>

        {/* MESSAGES D'ERREUR */}
        {error && (
          <div className="bg-red-500/25 backdrop-blur-md border border-red-500/40 text-red-100 text-sm p-3.5 rounded-2xl flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* FORMULAIRE DE CONNEXION */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* CHAMP EMAIL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-green-200 uppercase tracking-wider block">
              Adresse Email
            </label>
            <div className="flex items-center border border-white/20 rounded-2xl px-3.5 bg-black/20 focus-within:ring-2 focus-within:ring-green-400 focus-within:border-green-400 focus-within:bg-black/30 transition-all">
              <Mail size={18} className="text-green-300 shrink-0" />
              <input
                type="email"
                required
                className="p-3 bg-transparent outline-none w-full text-sm placeholder-white/40 text-white"
                placeholder="nom@exemple.com"
                value={email}
                disabled={loading}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* CHAMP MOT DE PASSE */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-green-200 uppercase tracking-wider block">
              Mot de passe
            </label>
            <div className="flex items-center border border-white/20 rounded-2xl px-3.5 bg-black/20 focus-within:ring-2 focus-within:ring-green-400 focus-within:border-green-400 focus-within:bg-black/30 transition-all">
              <Lock size={18} className="text-green-300 shrink-0" />
              <input
                type="password"
                required
                className="p-3 bg-transparent outline-none w-full text-sm placeholder-white/40 text-white"
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
            className="w-full bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 disabled:opacity-60 text-green-950 font-bold p-3.5 rounded-2xl text-sm shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 transition-all mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin text-green-950" />
                <span>Vérification du compte...</span>
              </>
            ) : (
              <span>Se connecter à mon espace</span>
            )}
          </button>

        </form>
        
        {/* FOOTER DISCRET */}
        <p className="text-center text-[11px] text-green-200/60 font-medium pt-2">
          Burkina Faso • Santé Globale & Traditionnelle
        </p>
      </div>
    </div>
  )
}