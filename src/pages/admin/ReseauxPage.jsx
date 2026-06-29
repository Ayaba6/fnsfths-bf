import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Network, Search, RefreshCcw, MapPin, SlidersHorizontal } from "lucide-react"

const REGIONS_BF = [
  "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", 
  "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", 
  "Plateau-Central", "Sahel", "Sud-Ouest"
]

export default function ReseauxPage() {
  const [reseaux, setReseaux] = useState([])
  const [loading, setLoading] = useState(true)
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
      console.error("Erreur :", err.message)
      setReseaux([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReseaux() }, [])

  const filtered = reseaux.filter((r) => {
    const matchSearch = `${r.nom} ${r.responsable_nom} ${r.email}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filter === "all" ? true : r.statut === filter
    const matchRegion = regionFilter === "all" ? true : (r.region || "").toLowerCase() === regionFilter.toLowerCase()
    return matchSearch && matchStatus && matchRegion
  })

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Network className="text-green-600 w-7 h-7" /> Gestion des Réseaux
          </h1>
        </div>
        <button onClick={fetchReseaux} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <RefreshCcw size={15} className={loading ? "animate-spin" : ""} /> Actualiser
        </button>
      </div>

      {/* FILTRES */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-gray-50/50">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input className="p-2 bg-transparent outline-none w-full text-sm" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="p-2 border border-gray-300 rounded-lg text-sm bg-white" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="en_attente">En attente</option>
          <option value="suspendu">Suspendu</option>
        </select>
        <select className="p-2 border border-gray-300 rounded-lg text-sm bg-white sm:col-span-2 lg:col-span-1" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
          <option value="all">Toutes les régions</option>
          {REGIONS_BF.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* LISTE / TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/70 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4">Réseau</th>
                <th className="p-4">Responsable</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Localisation</th>
                <th className="p-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => <ReseauRow key={r.id} r={r} />)}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map(r => (
            <div key={r.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-900">{r.nom}</p>
                <StatusBadge statut={r.statut} />
              </div>
              <p className="text-sm text-gray-600">Resp: <span className="font-medium">{r.responsable_nom || 'N/A'}</span></p>
              <div className="flex items-center text-xs text-gray-500 gap-2">
                <MapPin size={12} /> {r.ville}, {r.region}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* COMPOSANTS UI */
function StatusBadge({ statut }) {
  const styles = {
    actif: "bg-green-50 text-green-700 border-green-200",
    suspendu: "bg-red-50 text-red-700 border-red-200",
    en_attente: "bg-amber-50 text-amber-700 border-amber-200"
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[statut] || 'bg-gray-100'}`}>{statut?.toUpperCase()}</span>
}

function ReseauRow({ r }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-4 font-semibold text-gray-900">{r.nom}</td>
      <td className="p-4 text-gray-700">{r.responsable_nom || '—'}</td>
      <td className="p-4 text-xs">
        <div className="font-medium">{r.email}</div>
        <div className="text-gray-400">{r.telephone}</div>
      </td>
      <td className="p-4 text-sm text-gray-600">{r.ville} <br/> <span className="text-xs text-gray-400">{r.region}</span></td>
      <td className="p-4"><StatusBadge statut={r.statut} /></td>
    </tr>
  )
}