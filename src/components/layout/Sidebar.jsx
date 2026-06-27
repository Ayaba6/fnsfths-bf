import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Network,
  Building2,
  UserPlus,
  Settings,
  LogOut,
  Shield,
  CreditCard
} from "lucide-react"

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm flex flex-col">

      {/* HEADER */}
      <div className="p-5 border-b">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Shield className="text-green-600" />
          FNSTHS
        </h1>
        <p className="text-xs text-gray-500">
          Administration fédération
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-2">

        <NavLink to="/admin" className={linkClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/praticiens" className={linkClass}>
          <Users size={18} />
          Praticiens
        </NavLink>

        <NavLink to="/admin/reseaux" className={linkClass}>
          <Network size={18} />
          Réseaux
        </NavLink>

        <NavLink to="/admin/associations" className={linkClass}>
          <Building2 size={18} />
          Associations
        </NavLink>

        {/* ⚠️ IMPORTANT: pas de /admin/ajouter si route n'existe pas */}
        <NavLink to="/admin/praticiens" className={linkClass}>
          <UserPlus size={18} />
          Ajouter praticien
        </NavLink>

        {/* 🆕 CARTES FNSTHS */}
        <NavLink to="/admin/praticiens/carte" className={linkClass}>
          <CreditCard size={18} />
          Cartes FNSTHS
        </NavLink>

      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t space-y-2">

        <NavLink to="/admin/settings" className={linkClass}>
          <Settings size={18} />
          Paramètres
        </NavLink>

        <button className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full">
          <LogOut size={18} />
          Déconnexion
        </button>

      </div>

    </div>
  )
}