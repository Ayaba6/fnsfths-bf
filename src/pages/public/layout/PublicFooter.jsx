import { Link } from "react-router-dom"
import { Sprout, MapPin, Mail, Phone, ArrowRight } from "lucide-react"

export default function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Colonne 1 : À propos */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-green-700 text-white flex items-center justify-center shadow-md">
              <Sprout size={20} />
            </div>
            <span className="font-serif font-bold text-lg text-white tracking-wide">FNSFTHS/BF</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Fédération Nationale des Tradipraticiens et Herboristes de Santé du Burkina Faso. Structurer, sécuriser et valoriser la pharmacopée locale.
          </p>
        </div>

        {/* Colonne 2 : Liens Rapides */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="text-slate-400 hover:text-green-400 transition flex items-center gap-2">
                <span className="text-green-500">›</span> Accueil
              </Link>
            </li>
            <li>
              <Link to="/annuaire" className="text-slate-400 hover:text-green-400 transition flex items-center gap-2">
                <span className="text-green-500">›</span> Annuaire des praticiens
              </Link>
            </li>
            <li>
              <Link to="/a-propos" className="text-slate-400 hover:text-green-400 transition flex items-center gap-2">
                <span className="text-green-500">›</span> À propos de nous
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-slate-400 hover:text-green-400 transition flex items-center gap-2">
                <span className="text-green-500">›</span> Nous contacter
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Domaines / Piliers */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Nos Piliers</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Biodiversité & Écologie
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Modernisation & Sécurité
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Intégration Sanitaire
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Encadrement & Éthique
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Coordonnées de Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Officiel</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
              <span>Ouagadougou, Burkina Faso</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-green-500 flex-shrink-0" />
              <a href="mailto:contact@fnsfths-bf.org" className="hover:text-green-400 transition">
                contact@fnsfths-bf.org
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-green-500 flex-shrink-0" />
              <span>+226 XX XX XX XX</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Barre de bas de page */}
      <div className="border-t border-slate-900 bg-slate-950 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FNSFTHS/BF. Tous droits réservés.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 transition cursor-pointer">Mentions légales</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Politique de confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  )
}