import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X, ArrowRight, Phone, Mail } from "lucide-react"
import logo from "../../../assets/logo-trans.png"

export default function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: "À propos", to: "/a-propos" },
    { name: "Annuaire", to: "/annuaire" },
    { name: "Contact", to: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 shadow-sm font-sans">
      {/* BANDEAU SUPÉRIEUR MINCE */}
      <div className="bg-green-900 text-green-100 text-xs py-2 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          
          {/* Coordonnées à gauche */}
          <div className="flex items-center gap-6">
            <a href="tel:+22670533030" className="flex items-center gap-2 hover:text-white transition">
              <Phone size={14} className="text-yellow-400" />
              <span>+226 70 53 30 30</span>
            </a>
            <a href="mailto:contact@fnsfths-bf.org" className="flex items-center gap-2 hover:text-white transition">
              <Mail size={14} className="text-yellow-400" />
              <span>contact@fnsfths-bf.org</span>
            </a>
          </div>

          {/* Réseaux sociaux (Facebook, TikTok, YouTube) à droite avec leurs vraies couleurs */}
          <div className="flex items-center gap-3">
            <span className="text-green-300 hidden md:inline">Suivez-nous :</span>
            
            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center hover:bg-[#1565c0] text-white transition shadow-sm"
              aria-label="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-full bg-black flex items-center justify-center hover:bg-neutral-800 text-white transition shadow-sm border border-white/10"
              aria-label="TikTok"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-7 h-7 rounded-full bg-[#FF0000] flex items-center justify-center hover:bg-[#d50000] text-white transition shadow-sm"
              aria-label="YouTube"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

          </div>

        </div>
      </div>

      {/* BARRE DE NAVIGATION PRINCIPALE */}
      <div className="bg-green-50/90 backdrop-blur-md border-b border-green-100/80">
        <nav className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="Logo FNSTHS/BF" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-105 transition-transform duration-200" 
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-bold text-gray-900 leading-tight"></span>
              <span className="text-[11px] text-green-700 font-semibold uppercase tracking-wider"></span>
            </div>
          </Link>

          {/* MENU BUREAU */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-gray-700 text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-all ${
                    isActive
                      ? "text-green-700 after:bg-green-700 after:w-full"
                      : "text-gray-600 hover:text-green-700 after:w-0 hover:after:w-full after:bg-green-700/50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20 flex items-center gap-2"
            >
              Espace Membre
            </Link>
          </div>

          {/* BOUTON HAMBURGER */}
          <button 
            className="md:hidden p-2 text-gray-700 hover:bg-green-100/60 rounded-xl transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-green-100 p-6 flex flex-col gap-3 font-bold text-gray-700 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl transition-colors flex items-center justify-between text-base ${
                  isActive
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span>{link.name}</span>
              <span className="text-gray-400 font-normal">›</span>
            </NavLink>
          ))}
          
          <Link 
            to="/login" 
            onClick={() => setIsOpen(false)} 
            className="mt-2 w-full px-6 py-3.5 bg-green-600 text-white text-center rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
          >
            Espace Membre <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </header>
  )
}