import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Building2, Search, RefreshCcw, MapPin, SlidersHorizontal } from "lucide-react"

const REGIONS_BF = [
  "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", 
  "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", 
  "Plateau-Central", "Sahel", "Sud-Ouest"
]

export default function AssociationsPage() {
  const [associations, setAssociations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")

  const fetchAssociations = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non connecté")

      const { data: profile } = await supabase
        .from("users")
        .select("organisation_id, role")
        .eq("id", user.id)
        .maybeSingle()

      let query = supabase.from("organisations").select("*").eq("type", "association").order("created_at", { ascending: false })
      if (profile?.role === "reseau" && profile.organisation_id) query = query.eq("parent_id", profile.organisation_id)

      const { data, error } = await query
      if (error) throw error
      setAssociations(data || [])
    } catch (err) {
      console.error("Erreur :", err.message)
      setAssociations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAssociations() }, [])

  const filtered = associations.filter((a) => {
    const matchSearch = `${a.nom} ${a.responsable_nom} ${a.email}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filter === "all" ? true : a.statut === filter
    const matchRegion = regionFilter === "all" ? true : (a.region || "").toLowerCase() === regionFilter.toLowerCase()
    return matchSearch && matchStatus && matchRegion
  })

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="text-green-600 w-7 h-7" /> Associations Rattachées
          </h1>
        </div>
        <button onClick={fetchAssociations} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
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
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Association</th>
                <th className="p-4 text-left">Responsable</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Localisation</th>
                <th className="p-4 text-left">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(a => <AssociationRow key={a.id} a={a} />)}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map(a => (
            <div key={a.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-900">{a.nom}</p>
                <StatusBadge statut={a.statut} />
              </div>
              <p className="text-sm text-gray-600">Resp: <span className="font-medium">{a.responsable_nom || 'N/A'}</span></p>
              <div className="flex items-center text-xs text-gray-500 gap-2">
                <MapPin size={12} /> {a.ville}, {a.region}
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

function AssociationRow({ a }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-4 font-semibold text-gray-900">{a.nom}</td>
      <td className="p-4 text-gray-700">{a.responsable_nom || '—'}</td>
      <td className="p-4 text-xs">
        <div className="font-medium">{a.email || '—'}</div>
        <div className="text-gray-400">{a.telephone || '—'}</div>
      </td>
      <td className="p-4 text-sm text-gray-600">
        {a.ville} <br/> <span className="text-xs text-gray-400">{a.region}</span>
      </td>
      <td className="p-4"><StatusBadge statut={a.statut} /></td>
    </tr>
  )
}