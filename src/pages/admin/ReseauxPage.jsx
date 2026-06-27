import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Network, Search, RefreshCcw, MapPin, SlidersHorizontal } from "lucide-react"

// Liste officielle des 13 régions du Burkina Faso
const REGIONS_BF = [
  "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", 
  "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", 
  "Plateau-Central", "Sahel", "Sud-Ouest"
]

export default function ReseauxPage() {
  const [reseaux, setReseaux] = useState([])
  const [loading, setLoading] = useState(true)
  
  // États pour la recherche et les filtres
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")

  const fetchReseaux = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("organisations")
        .select("*")
        .eq("type", "reseau")
        .order("created_at", { ascending: false })

      if (error) throw error
      setReseaux(data || [])
    } catch (err) {
      console.error("Erreur lors de la récupération des réseaux :", err.message)
      setReseaux([])
    } {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReseaux()
  }, [])

  // Système de filtrage combiné (Recherche + Statut + Région)
  const filtered = reseaux.filter((r) => {
    const matchSearch = `${r.nom} ${r.responsable_nom} ${r.email} ${r.ville || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchStatus = filter === "all" ? true : r.statut === filter

    const matchRegion = regionFilter === "all" 
      ? true 
      : (r.region || "").toLowerCase() === regionFilter.toLowerCase()

    return matchSearch && matchStatus && matchRegion
  })

  // Badge dynamique de statut
  const getStatusBadge = (statut) => {
    const config = {
      actif: { bg: "bg-green-50 text-green-700 border-green-200", label: "Actif" },
      suspendu: { bg: "bg-red-50 text-red-700 border-red-200", label: "Suspendu" },
      en_attente: { bg: "bg-amber-50 text-amber-700 border-amber-200", label: "En attente" }
    }
    const match = config[statut] || { bg: "bg-gray-50 text-gray-700 border-gray-200", label: statut }
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${match.bg}`}>{match.label}</span>
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Network className="text-green-600 w-7 h-7" />
            Gestion des Réseaux
          </h1>
          <p className="text-sm text-gray-500">
            Supervisez les grands réseaux de coordination médicale régionaux enregistrés sur la plateforme.
          </p>
        </div>

        <button
          onClick={fetchReseaux}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 text-gray-700 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 self-start sm:self-center"
        >
          <RefreshCcw size={15} className={loading ? "animate-spin" : ""} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* FILTER BAR DESIGN */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
        
        {/* Recherche libre */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-gray-50/50 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all w-full md:w-72">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            className="p-2 bg-transparent outline-none w-full text-sm placeholder-gray-400"
            placeholder="Rechercher un réseau..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtre Statuts */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white text-sm focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
          <SlidersHorizontal size={16} className="text-gray-400 mr-1" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="py-2 pr-2 bg-transparent outline-none text-gray-700 font-medium"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="en_attente">En attente</option>
            <option value="suspendu">Suspendu</option>
          </select>
        </div>

        {/* Filtre Régions */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white text-sm focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
          <MapPin size={16} className="text-gray-400 mr-1" />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="py-2 pr-2 bg-transparent outline-none text-gray-700 font-medium"
          >
            <option value="all">Toutes les régions</option>
            {REGIONS_BF.map((r, i) => (
              <option key={i} value={r}>{r}</option>
            ))}
          </select>
        </div>

      </div>

      {/* CONTENT / TABLEAU */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-600 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4">Réseau</th>
                <th className="p-4">Responsable principal</th>
                <th className="p-4">Contacts Émail / Tél</th>
                <th className="p-4">Siège / Région</th>
                <th className="p-4">Statut</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                // SKELETON ANIMATION PREVENTS LAYOUT SHIFTS
                [...Array(3)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-44" /></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-28" /></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-36" /></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                    <td className="p-4"><div className="h-6 bg-gray-200 rounded-full w-16" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                    Aucun réseau de coordination trouvé avec ces paramètres.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">
                      {r.nom}
                    </td>
                    <td className="p-4 text-gray-700">
                      {r.responsable_nom || <span className="text-gray-400 italic">Non spécifié</span>}
                    </td>
                    <td className="p-4 text-xs space-y-0.5">
                      <div className="text-gray-900 font-medium">{r.email}</div>
                      <div className="text-gray-400 font-mono">{r.telephone || "—"}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{r.ville || "N/A"}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} /> {r.region || "Non spécifiée"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(r.statut)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}