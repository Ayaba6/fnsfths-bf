export default function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-bold text-white mb-4">FNSFTHS/BF</h4>
          <p className="text-sm">
            Fédération Nationale des Tradipraticiens de Santé du Burkina Faso.
            Structurer, sécuriser et valoriser la pharmacopée locale.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Liens Utiles</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/a-propos" className="hover:text-green-400">À propos</a></li>
            <li><a href="/annuaire" className="hover:text-green-400">Annuaire des praticiens</a></li>
            <li><a href="/contact" className="hover:text-green-400">Nous contacter</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Contact</h4>
          <p className="text-sm">Ouagadougou, Burkina Faso</p>
          <p className="text-sm">Email : contact@fnsfths-bf.org</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>© 2026 FNSFTHS/BF. Tous droits réservés.</p>
      </div>
    </footer>
  )
}