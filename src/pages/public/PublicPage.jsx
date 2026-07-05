import { useEffect, useState, useMemo } from "react"
import { supabase } from "../../services/supabase"
import { Search, Phone, BadgeCheck, MapPin, Filter } from "lucide-react"
import PublicHeader from "./layout/PublicHeader"
import PublicFooter from "./layout/PublicFooter"

export default function PublicPage() {
  const [praticiens, setPraticiens] = useState([])
  const [search, setSearch] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("Toutes")

  useEffect(() => {
    const fetchCertifies = async () => {
      // Connexion à la table 'praticiens'
      const { data } = await supabase
        .from("praticiens")
        .select("*")
        .eq("statut", "certifie") // Filtre uniquement les certifiés
        .order("nom", { ascending: true })
      
      if (data) setPraticiens(data)
    }
    fetchCertifies()
  }, [])

  const regions = useMemo(() => {
    const list = ["Toutes", ...new Set(praticiens.map(p => p.region))]
    return list.filter(Boolean)
  }, [praticiens])

  const filtered = praticiens.filter(p => {
    // Utilisation de 'numero_adherent' comme dans votre table
    const matchesSearch = `${p.nom} ${p.prenom} ${p.region} ${p.numero_adherent}`.toLowerCase().includes(search.toLowerCase())
    const matchesRegion = selectedRegion === "Toutes" || p.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <PublicHeader />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">
            Annuaire des <span className="text-green-700">Tradipraticiens</span>
          </h1>
          <p className="text-gray-500 mb-8">Consultez le répertoire des tradipraticiens et herboristes validés du Burkina Faso</p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher par nom, région ou n° adhérent..." 
                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-4 top-4 text-gray-400" size={20} />
              <select 
                className="w-full md:w-48 pl-12 pr-6 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white cursor-pointer"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-700 font-bold text-lg">
                  {p.prenom?.[0]}{p.nom?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{p.nom} {p.prenom}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <BadgeCheck size={14} className="text-green-600" />
                    {p.numero_adherent || "N° non défini"}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" /> {p.region || "Non précisée"}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" /> {p.telephone || "Non renseigné"}
                </div>
              </div>

              {/* Gestion des spécialités : on sépare la chaîne de caractères par des virgules */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                {p.specialite?.split(',').map((spec, i) => (
                  <span key={i} className="text-green-700 text-xs font-medium bg-green-50 px-2 py-1 rounded-md">
                    {spec.trim()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}