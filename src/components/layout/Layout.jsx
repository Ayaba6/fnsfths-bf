import { NavLink } from "react-router-dom"
import {
  Home,
  Users,
  Network,
  Building2,
  CreditCard
} from "lucide-react"

/* NAV ITEM */
function NavItem({ icon: Icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 p-2 rounded transition ${
          isActive
            ? "bg-green-600 text-white"
            : "text-gray-700 hover:bg-green-50"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  )
}

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg border-r p-4">

        <h1 className="text-xl font-bold text-green-700 mb-6">
          FNSTHS Admin
        </h1>

        <nav className="space-y-2">

          <NavItem to="/admin" icon={Home} label="Dashboard" />
          <NavItem to="/admin/praticiens" icon={Users} label="Praticiens" />
          <NavItem to="/admin/reseaux" icon={Network} label="Réseaux" />
          <NavItem to="/admin/associations" icon={Building2} label="Associations" />

          {/* ✅ CORRECT ROUTE */}
          <NavItem
            to="/admin/praticiens/carte"
            icon={CreditCard}
            label="Cartes FNSTHS"
          />

        </nav>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}