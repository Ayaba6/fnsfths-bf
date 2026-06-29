import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../../services/supabase"
import { Search, SlidersHorizontal, IdCard, MapPin, Eye, Loader2 } from "lucide-react"

export default function CarteList() {
  const [praticiens, setPraticiens] = useState([])
  const [loading, setLoading] = useState(true)
  
  // États pour la recherche et les filtres
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")

  useEffect(() => {
    const fetchPraticiens = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("praticiens")
        .select("id, nom, prenom, region, statut, numero_adherent, specialite, photo")

      if (!error) setPraticiens(data || [])
      setLoading(false)
    }

    fetchPraticiens()
  }, [])

  const regionsUniques = [...new Set(praticiens.map((p) => p.region).filter(Boolean))]

  // Logique de filtrage
  const filteredPraticiens = praticiens.filter((p) => {
    const matchesSearch = `${p.nom} ${p.prenom} ${p.numero_adherent || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === "all" ? true : p.statut === statusFilter
    const matchesRegion = regionFilter === "all" ? true : p.region === regionFilter

    return matchesSearch && matchesStatus && matchesRegion
  })

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-green-600 w-8 h-8" />
        <p className="text-sm text-gray-500 font-medium">Chargement du registre des cartes...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <IdCard className="text-green-600 w-5 h-5" />
            Cartes d'Adhérents FNSTHS
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Gérer, rechercher et prévisualiser les cartes officielles de la fédération.</p>
        </div>
      </div>

      {/* BARRE DE RECHERCHE & FILTRES */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Champ Recherche */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-gray-50/50 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            className="p-2 bg-transparent outline-none w-full text-sm placeholder-gray-400"
            placeholder="Rechercher par nom, prénom, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtre Statut */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white text-sm focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
          <SlidersHorizontal size={14} className="text-gray-400 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 bg-transparent outline-none text-gray-700 font-medium w-full text-xs"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="en_attente">En attente</option>
            <option value="suspendu">Suspendus</option>
          </select>
        </div>

        {/* Filtre Région */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white text-sm focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
          <MapPin size={14} className="text-gray-400 mr-2" />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="py-2 bg-transparent outline-none text-gray-700 font-medium w-full text-xs"
          >
            <option value="all">Toutes les régions</option>
            {regionsUniques.map((reg) => (
              <option key={reg} value={reg}>{reg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* GRILLE DES PRATICIENS / BADGES */}
      {filteredPraticiens.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400 italic text-sm">
          Aucun praticien trouvé avec ces critères de recherche.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPraticiens.map((p) => (
            <div 
              key={p.id} 
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Infos en-tête */}
              <div className="flex justify-between items-start gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {p.nom} {p.prenom}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{p.numero_adherent || "ID : En attente"}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  p.statut === 'actif' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {p.statut || "N/A"}
                </span>
              </div>

              {/* 🗂️ APERÇU MINIATURES RETOUCHÉ POUR CORRESPONDRE AU NOUVEAU DESIGN */}
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 my-2">
                
                {/* Mini Recto (En-tête centré + mini trait vert) */}
                <div className="aspect-[1.58/1] bg-gradient-to-br from-white via-gray-50 to-green-50/20 border border-gray-200 rounded-lg p-1.5 flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-600"></div>
                  
                  {/* Mini Header Centré */}
                  <div className="text-center scale-[0.6] origin-top mt-0.5 leading-none">
                    <div className="text-[7px] font-black text-green-700 uppercase tracking-tighter">Burkina Faso</div>
                    <div className="w-4 h-[0.5px] bg-green-600 mx-auto mt-[1px]"></div>
                  </div>

                  {/* Corps (Photo élargie & décalée + Nom) */}
                  <div className="flex items-center gap-2 px-1 mt-1 flex-1">
                    <div className="w-5 h-6 bg-gray-100 rounded object-cover border shrink-0 overflow-hidden shadow-2xs">
                      {p.photo ? (
                        <img src={p.photo} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="scale-[0.6] origin-left whitespace-nowrap leading-tight text-gray-900 font-bold uppercase truncate max-w-[55px]">
                      {p.nom}
                    </div>
                  </div>
                  <div className="text-[5px] text-gray-400 font-mono px-1 truncate">{p.numero_adherent || "N/A"}</div>
                </div>

                {/* Mini Verso (Adapté au nouveau style clair et épuré) */}
                <div className="aspect-[1.58/1] bg-gradient-to-br from-white via-gray-50 to-green-50/10 border border-gray-200 rounded-lg p-1.5 flex flex-col justify-between relative overflow-hidden shadow-xs">
                  <div className="space-y-0.5 scale-[0.6] origin-top-left w-[160%]">
                    <div className="text-[7px] text-green-700 font-bold uppercase tracking-tighter border-b border-green-600 pb-[1px]">VERSO OFFICIEL</div>
                    <div className="text-[4.5px] text-gray-500 leading-tight">1. Carte strictement personnelle.</div>
                    <div className="text-[4.5px] text-gray-500 leading-tight">2. Scannez le QR pour contrôle.</div>
                  </div>
                  <div className="w-full flex justify-between items-end scale-[0.65] origin-bottom-left w-[150%]">
                    <div className="text-[4.5px] text-gray-400">Ouagadougou</div>
                    <div className="w-6 h-3 border border-dashed border-green-600/40 rounded bg-green-50/20"></div>
                  </div>
                </div>

              </div>

              {/* INFOS INFÉRIEURES */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-gray-400" />
                  {p.region || "Non définie"}
                </span>
                <span className="italic text-gray-400 text-[11px] max-w-[150px] truncate">
                  {p.specialite || "Tradipraticien"}
                </span>
              </div>

              {/* BOUTON D'ACTION */}
              <Link
                to={`/admin/praticiens/carte/${p.id}`}
                className="w-full bg-gray-100 hover:bg-green-600 hover:text-white text-gray-700 font-medium text-center py-2 rounded-xl text-xs mt-3 flex items-center justify-center gap-1.5 transition-all"
              >
                <Eye size={14} />
                <span>Voir et Imprimer la carte</span>
              </Link>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}