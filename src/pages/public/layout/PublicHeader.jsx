import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import logo from "../../../assets/logo-trans.png"

export default function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 bg-green-50/80 backdrop-blur-md border-b border-green-100 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo FNSTHS/BF" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
        </Link>

        {/* MENU BUREAU (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8 font-bold text-gray-700">
          <Link to="/a-propos" className="hover:text-green-700 transition-colors">À propos</Link>
          <Link to="/annuaire" className="hover:text-green-700 transition-colors">Annuaire</Link>
          <Link to="/contact" className="hover:text-green-700 transition-colors">Contact</Link>
          <Link to="/login" className="px-6 py-2.5 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20">
            Espace Membre
          </Link>
        </div>

        {/* BOUTON HAMBURGER (Visible on mobile) */}
        <button 
          className="md:hidden p-2 text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MENU MOBILE (Visible when isOpen is true) */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-green-100 p-6 flex flex-col gap-4 font-bold text-gray-700">
          <Link to="/a-propos" onClick={() => setIsOpen(false)}>À propos</Link>
          <Link to="/annuaire" onClick={() => setIsOpen(false)}>Annuaire</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} className="mt-2 px-6 py-3 bg-green-600 text-white text-center rounded-xl hover:bg-green-700 transition">
            Espace Membre
          </Link>
        </div>
      )}
    </header>
  )
}