import { NavLink, useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"
import {
  LayoutDashboard,
  Users,
  Network,
  Building2,
  CreditCard,
  Award,
  FileText,
  Settings,
  LogOut,
  X,
  ShieldCheck
} from "lucide-react"

// Importez votre logo officiel FNSFTHS
import logoFNSFTHS from "../../assets/logo-trans.png"

function NavItem({ icon: Icon, label, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all group ${
          isActive
            ? "bg-green-600 text-white shadow-md shadow-green-600/25"
            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={17} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-gray-500"}`} />
          <span className="tracking-wide truncate">{label}</span>
          {isActive && (
            <span className="absolute right-2 w-1.5 h-4 bg-white/40 rounded-full" />
          )}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ role, onClose }) {
  const navigate = useNavigate()
  const safeRole = (role || "").toLowerCase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const getRoleBadgeInfo = () => {
    switch (safeRole) {
      case "admin_federation":
        return { label: "Administration Fédération", color: "bg-red-50 text-red-700 border-red-200" }
      case "reseau":
        return { label: "Espace Réseau", color: "bg-amber-50 text-amber-700 border-amber-200" }
      case "association":
        return { label: "Espace Association", color: "bg-blue-50 text-blue-700 border-blue-200" }
      default:
        return { label: "Utilisateur", color: "bg-gray-50 text-gray-700 border-gray-200" }
    }
  }

  const roleInfo = getRoleBadgeInfo()

  return (
    <aside className="h-full w-64 bg-white border-r border-gray-200/80 shadow-xs flex flex-col relative shrink-0 select-none overflow-hidden">
      
      {/* ================= BOUTON FERMETURE MOBILE ================= */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-xl transition-colors"
          aria-label="Fermer le menu"
        >
          <X size={20} />
        </button>
      )}

      {/* ================= HEADER AVEC LOGO & MARQUE ================= */}
      <div className="p-4 border-b border-gray-100 flex flex-col justify-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center p-1 shadow-xs shrink-0">
            <img 
              src={logoFNSFTHS} 
              alt="Logo FNSFTHS" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-sm font-extrabold text-gray-900 tracking-tight truncate">
              FNSFTHS-BF
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Gestion Officielle
            </p>
          </div>
        </div>

        {/* Badge de Rôle Pro */}
        <div className={`mt-3 px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 shadow-2xs ${roleInfo.color}`}>
          <ShieldCheck size={13} className="shrink-0" />
          <span className="truncate">{roleInfo.label}</span>
        </div>
      </div>

      {/* ================= LIENS DE NAVIGATION (SANS SCROLL) ================= */}
      <nav className="flex-1 px-3 py-2 space-y-1 flex flex-col justify-around shrink-0 overflow-hidden">
        {/* ADMIN FÉDÉRATION */}
        {safeRole === "admin_federation" && (
          <>
            <div className="px-2 text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Principal</div>
            <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
            <NavItem to="/admin/praticiens" icon={Users} label="Praticiens" onClick={onClose} />
            
            <div className="px-2 pt-1 text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Structure</div>
            <NavItem to="/admin/reseaux" icon={Network} label="Réseaux" onClick={onClose} />
            <NavItem to="/admin/associations" icon={Building2} label="Associations" onClick={onClose} />
            
            <div className="px-2 pt-1 text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Documents</div>
            <NavItem to="/admin/praticiens/carte" icon={CreditCard} label="Cartes FNSTHS" onClick={onClose} />
            <NavItem to="/admin/attestations" icon={Award} label="Attestations" onClick={onClose} />
            <NavItem to="/admin/lettres" icon={FileText} label="Lettres Administratives" onClick={onClose} />
          </>
        )}

        {/* RÉSEAU */}
        {safeRole === "reseau" && (
          <>
            <div className="px-2 text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Espace Réseau</div>
            <NavItem to="/reseau" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
            <NavItem to="/reseau/associations" icon={Building2} label="Mes associations" onClick={onClose} />
            <NavItem to="/reseau/praticiens" icon={Users} label="Mes praticiens" onClick={onClose} />
          </>
        )}

        {/* ASSOCIATION */}
        {safeRole === "association" && (
          <>
            <div className="px-2 text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Espace Association</div>
            <NavItem to="/association" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
            <NavItem to="/association/praticiens" icon={Users} label="Praticiens" onClick={onClose} />
          </>
        )}
      </nav>

      {/* ================= FOOTER / PARAMÈTRES & DÉCONNEXION ================= */}
      <div className="p-3 border-t border-gray-100 space-y-1 bg-gray-50/50 shrink-0">
        <NavItem to="/settings" icon={Settings} label="Paramètres" onClick={onClose} />

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50/80 transition-all text-left group"
        >
          <LogOut size={17} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}