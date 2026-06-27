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
  Shield,
  X
} from "lucide-react"

function NavItem({ icon: Icon, label, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
          isActive
            ? "bg-green-600 text-white"
            : "text-gray-700 hover:bg-gray-100"
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

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm flex flex-col relative">

      {/* ================= MOBILE CLOSE BTN ================= */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-3 right-3 p-2"
        >
          <X />
        </button>
      )}

      {/* ================= HEADER ================= */}
      <div className="p-5 border-b">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Shield className="text-green-600" />
          FNSTHS
        </h1>

        <p className="text-xs text-gray-500">
          {safeRole === "admin_federation" && "Administration Fédération"}
          {safeRole === "reseau" && "Espace Réseau"}
          {safeRole === "association" && "Espace Association"}
        </p>
      </div>

      {/* ================= NAV ================= */}
      <nav className="flex-1 p-4 space-y-2">

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
      <div className="p-4 border-t space-y-2">

        <NavLink
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <Settings size={18} />
          Paramètres
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full"
        >
          <LogOut size={18} />
          Déconnexion
        </button>

      </div>
    </div>
  )
}