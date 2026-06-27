import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Eye, Search, Filter, MapPin, SlidersHorizontal, Loader2 } from "lucide-react"

const REGIONS_BF = [
  "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", 
  "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", 
  "Plateau-Central", "Sahel", "Sud-Ouest"
]

export default function PraticiensPage() {
  const [praticiens, setPraticiens] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")

  const [selected, setSelected] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. User connecté
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 2. Rôle + Organisation
      const { data: profile } = await supabase
        .from("users")
        .select("role, organisation_id")
        .eq("id", user.id)
        .maybeSingle() // 🔥 SÉCURISÉ : Remplace .single() pour éviter l'erreur de coercition JSON

      let query = supabase.from("praticiens").select("*")

      // 3. Filtrage automatique selon rôle
      if (profile?.role === "association") {
        query = query.eq("association_id", profile.organisation_id)
      }
      if (profile?.role === "reseau") {
        query = query.eq("reseau_id", profile.organisation_id)
      }

      const { data, error } = await query.order("created_at", { ascending: false })
      if (!error) setPraticiens(data || [])

    } catch (err) {
      console.error("Erreur lors de la récupération :", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Système de filtrage optimisé
  const filtered = praticiens.filter((p) => {
    const matchSearch = `${p.nom} ${p.prenom} ${p.numero_adherent}`
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchStatus = filter === "all" ? true : p.statut === filter

    const matchRegion = regionFilter === "all" 
      ? true 
      : (p.region || "").toLowerCase() === regionFilter.toLowerCase()

    return matchSearch && matchStatus && matchRegion
  })

  // Helper pour styliser les statuts proprement
  const getStatusBadge = (statut) => {
    const config = {
      certifie: { bg: "bg-green-50 text-green-700 border-green-200", label: "Certifié" },
      en_attente: { bg: "bg-amber-50 text-amber-700 border-amber-200", label: "En attente" },
      transmis_federation: { bg: "bg-blue-50 text-blue-700 border-blue-200", label: "Transmis" }, // 🔥 AJOUTÉ pour le flux association
      suspendu: { bg: "bg-red-50 text-red-700 border-red-200", label: "Suspendu" }
    }
    const match = config[statut] || { bg: "bg-gray-50 text-gray-700 border-gray-200", label: statut }
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${match.bg}`}>{match.label}</span>
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">👨‍⚕️ Gestion des Praticiens</h1>
          <p className="text-sm text-gray-500">Visualisez, filtrez et gérez les adhésions des professionnels de santé.</p>
        </div>
      </div>

      {/* FILTER BAR DESIGN */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
        
        {/* Recherche libre */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-gray-50/50 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all w-full md:w-72">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            className="p-2 bg-transparent outline-none w-full text-sm placeholder-gray-400"
            placeholder="Nom, prénom ou N° adhérent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtre Statuts */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white text-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
          <SlidersHorizontal size={16} className="text-gray-400 mr-1" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="py-2 pr-2 bg-transparent outline-none text-gray-700 font-medium"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="transmis_federation">Transmis</option>
            <option value="certifie">Certifiés</option>
            <option value="suspendu">Suspendus</option>
          </select>
        </div>

        {/* Filtre Régions */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-white text-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
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

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-600 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4">Identité du Praticien</th>
                <th className="p-4">N° Adhérent</th>
                <th className="p-4">Région d'exercice</th>
                <th className="p-4">Statut d'accès</th>
                <th className="p-4 text-center">Fiche</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                [...Array(3)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-40" /></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                    <td className="p-4"><div className="h-6 bg-gray-200 rounded-full w-20" /></td>
                    <td className="p-4"><div className="h-8 bg-gray-200 rounded w-8 mx-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                    Aucun praticien ne correspond à vos critères de recherche.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">
                      {p.nom} {p.prenom}
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50/30 px-2 py-1 rounded inline-block">
                        {p.numero_adherent || "Non attribué"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{p.region || "Non spécifiée"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(p.statut)}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelected(p)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-indigo-600 transition-colors inline-flex items-center justify-center"
                        title="Voir les détails"
                      >
                        <Eye size={18} />
                      </button>
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