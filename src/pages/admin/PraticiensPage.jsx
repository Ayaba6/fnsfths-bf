import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Eye, Search, MapPin, SlidersHorizontal, User } from "lucide-react"

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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("users")
        .select("role, organisation_id")
        .eq("id", user.id)
        .maybeSingle()

      let query = supabase.from("praticiens").select("*")

      if (profile?.role === "association") query = query.eq("association_id", profile.organisation_id)
      if (profile?.role === "reseau") query = query.eq("reseau_id", profile.organisation_id)

      const { data, error } = await query.order("created_at", { ascending: false })
      if (!error) setPraticiens(data || [])
    } catch (err) {
      console.error("Erreur :", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = praticiens.filter((p) => {
    const matchSearch = `${p.nom} ${p.prenom} ${p.numero_adherent}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filter === "all" ? true : p.statut === filter
    const matchRegion = regionFilter === "all" ? true : (p.region || "").toLowerCase() === regionFilter.toLowerCase()
    return matchSearch && matchStatus && matchRegion
  })

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">👨‍⚕️ Gestion des Praticiens</h1>
        </div>
      </div>

      {/* FILTRES */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-gray-50/50">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input className="p-2 bg-transparent outline-none w-full text-sm" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="p-2 border border-gray-300 rounded-lg text-sm bg-white" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="transmis_federation">Transmis</option>
          <option value="certifie">Certifiés</option>
          <option value="suspendu">Suspendus</option>
        </select>
        <select className="p-2 border border-gray-300 rounded-lg text-sm bg-white sm:col-span-2 lg:col-span-1" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
          <option value="all">Toutes les régions</option>
          {REGIONS_BF.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* LISTE / TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* VUE TABLEAU (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Identité</th>
                <th className="p-4 text-left">N° Adhérent</th>
                <th className="p-4 text-left">Région</th>
                <th className="p-4 text-left">Statut</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => <PraticienRow key={p.id} p={p} onSelect={setSelected} />)}
            </tbody>
          </table>
        </div>

        {/* VUE CARDS (Mobile) */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map(p => (
            <div key={p.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">{p.nom} {p.prenom}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{p.numero_adherent}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge statut={p.statut} />
                <button onClick={() => setSelected(p)} className="text-indigo-600"><Eye size={18} /></button>
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
  const config = {
    certifie: "bg-green-50 text-green-700 border-green-200",
    en_attente: "bg-amber-50 text-amber-700 border-amber-200",
    transmis_federation: "bg-blue-50 text-blue-700 border-blue-200",
    suspendu: "bg-red-50 text-red-700 border-red-200"
  };
  return <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${config[statut] || 'bg-gray-100'}`}>{statut?.replace('_', ' ').toUpperCase()}</span>
}

function PraticienRow({ p, onSelect }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-4 font-semibold">{p.nom} {p.prenom}</td>
      <td className="p-4 font-mono text-indigo-600 text-xs">{p.numero_adherent}</td>
      <td className="p-4 text-gray-600">{p.region}</td>
      <td className="p-4"><StatusBadge statut={p.statut} /></td>
      <td className="p-4 text-center">
        <button onClick={() => onSelect(p)} className="p-1.5 hover:bg-gray-200 rounded-lg"><Eye size={16} /></button>
      </td>
    </tr>
  )
}