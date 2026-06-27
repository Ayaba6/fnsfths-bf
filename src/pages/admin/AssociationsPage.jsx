import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Building2, Search, RefreshCcw, MapPin, SlidersHorizontal, Loader2 } from "lucide-react"

// Liste officielle des 13 régions du Burkina Faso
const REGIONS_BF = [
  "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", 
  "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", 
  "Plateau-Central", "Sahel", "Sud-Ouest"
]

export default function AssociationsPage() {
  const [associations, setAssociations] = useState([])
  const [loading, setLoading] = useState(true)
  
  // États pour la recherche et les filtres
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")

  const fetchAssociations = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Utilisateur non connecté")

      // 🔥 SAFE PROFILE FETCH
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("organisation_id, role")
        .eq("id", user.id)
        .maybeSingle()

      if (profileError) console.error("PROFILE FETCH ERROR:", profileError)

      const reseauId = profile?.organisation_id

      let query = supabase
        .from("organisations")
        .select("*")
        .eq("type", "association")
        .order("created_at", { ascending: false })

      // 🔥 FILTRE SELON ROLE
      if (profile?.role === "reseau" && reseauId) {
        query = query.eq("parent_id", reseauId)
      }

      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError

      setAssociations(data || [])
    } catch (err) {
      console.error("FETCH ERROR:", err.message)
      setAssociations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssociations()
  }, [])

  // Système de filtrage combiné (Recherche + Statut + Région)
  const filtered = associations.filter((a) => {
    const matchSearch = `${a.nom} ${a.responsable_nom} ${a.email} ${a.ville}`
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchStatus = filter === "all" ? true : a.statut === filter

    const matchRegion = regionFilter === "all" 
      ? true 
      : (a.region || "").toLowerCase() === regionFilter.toLowerCase()

    return matchSearch && matchStatus && matchRegion
  })

  // Badge dynamique pour harmoniser les statuts
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
            <Building2 className="text-green-600 w-7 h-7" />
            Associations Rattachées
          </h1>
          <p className="text-sm text-gray-500">
            Supervisez les associations locales de votre secteur, leurs coordonnées et leurs statuts d'activité.
          </p>
        </div>

        <button
          onClick={fetchAssociations}
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
            placeholder="Nom, responsable, ville..."
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
                <th className="p-4">Nom de l'Association</th>
                <th className="p-4">Responsable</th>
                <th className="p-4">Contacts</th>
                <th className="p-4">Zone / Région</th>
                <th className="p-4">Statut</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                // SKELETON PREVENTS TABLE JUMPS
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
                    Aucune association enregistrée ou correspondante à vos filtres.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">
                      {a.nom}
                    </td>
                    <td className="p-4 text-gray-700">
                      {a.responsable_nom || <span className="text-gray-400 italic">Non renseigné</span>}
                    </td>
                    <td className="p-4 text-xs space-y-0.5">
                      <div className="text-gray-900 font-medium">{a.email || "—"}</div>
                      <div className="text-gray-400 font-mono">{a.telephone || "—"}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{a.ville || "N/A"}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} /> {a.region || "Non spécifiée"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(a.statut)}
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