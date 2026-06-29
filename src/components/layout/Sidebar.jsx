import { NavLink, useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"
import {
  LayoutDashboard,
  Users,
  Network,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  X
} from "lucide-react"

function NavItem({ icon: Icon, label, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${
          isActive
            ? "bg-green-600 text-white shadow-sm shadow-green-600/20"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
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

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 shadow-xs flex flex-col relative">

      {/* ================= MOBILE CLOSE BTN ================= */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors"
          aria-label="Fermer le menu"
        >
          <X size={20} />
        </button>
      )}

      {/* ================= HEADER AVEC LOGO ================= */}
      <div className="px-5 py-5 border-b border-gray-100 flex flex-col justify-center">
        <div className="flex items-center gap-3">
          <img 
            src="/logo192.png" 
            alt="Logo FNSFTHS" 
            className="w-9 h-9 object-contain rounded-lg" 
          />
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            FNSFTHS
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-3 font-medium leading-tight uppercase tracking-wider">
          {safeRole === "admin_federation" && "Administration Fédération"}
          {safeRole === "reseau" && "Espace Réseau"}
          {safeRole === "association" && "Espace Association"}
        </p>
      </div>

      {/* ================= NAV LINKS ================= */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {/* ADMIN */}
        {safeRole === "admin_federation" && (
          <>
            <NavItem to="/admin" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
            <NavItem to="/admin/praticiens" icon={Users} label="Praticiens" onClick={onClose} />
            <NavItem to="/admin/reseaux" icon={Network} label="Réseaux" onClick={onClose} />
            <NavItem to="/admin/associations" icon={Building2} label="Associations" onClick={onClose} />
            <NavItem to="/admin/praticiens/carte" icon={CreditCard} label="Cartes FNSTHS" onClick={onClose} />
          </>
        )}

        {/* RESEAU */}
        {safeRole === "reseau" && (
          <>
            <NavItem to="/reseau" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
            <NavItem to="/reseau/associations" icon={Building2} label="Mes associations" onClick={onClose} />
            <NavItem to="/reseau/praticiens" icon={Users} label="Mes praticiens" onClick={onClose} />
          </>
        )}

        {/* ASSOCIATION */}
        {safeRole === "association" && (
          <>
            <NavItem to="/association" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
            <NavItem to="/association/praticiens" icon={Users} label="Praticiens" onClick={onClose} />
          </>
        )}
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <NavLink
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings size={18} />
          <span>Paramètres</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 font-medium hover:bg-red-50 w-full text-left transition-colors"
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}