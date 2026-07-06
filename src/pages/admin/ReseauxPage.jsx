import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Network, Search, RefreshCcw, MapPin, Trash2, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react"

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
        .neq("statut", "supprime")
        .order("created_at", { ascending: false })
      if (error) throw error
      setReseaux(data || [])
    } catch (err) { console.error("Erreur :", err.message) } finally { setLoading(false) }
  }

  const updateStatut = async (id, nouveauStatut) => {
    const { error } = await supabase.from("organisations").update({ statut: nouveauStatut }).eq("id", id)
    if (!error) setReseaux(prev => prev.map(r => r.id === id ? { ...r, statut: nouveauStatut } : r))
  }

  const supprimerReseau = async (id) => {
    if (!window.confirm("Supprimer ce réseau ?")) return
    const { error } = await supabase.from("organisations").update({ statut: "supprime" }).eq("id", id)
    if (!error) setReseaux(prev => prev.filter(r => r.id !== id))
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Network className="text-green-600 w-7 h-7" /> Gestion des Réseaux
        </h1>
        <button onClick={fetchReseaux} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <RefreshCcw size={15} className={loading ? "animate-spin" : ""} /> Actualiser
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="border border-gray-300 rounded-lg text-sm bg-white" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="en_attente">En attente</option>
          <option value="suspendu">Suspendu</option>
        </select>
        <select className="border border-gray-300 rounded-lg text-sm bg-white sm:col-span-2 lg:col-span-1" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
          <option value="all">Toutes les régions</option>
          {REGIONS_BF.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4">Réseau</th>
                <th className="p-4">Responsable</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold">{r.nom}</td>
                  <td className="p-4">{r.responsable_nom}</td>
                  <td className="p-4"><StatusBadge statut={r.statut} /></td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    {r.statut !== 'actif' && <button onClick={() => updateStatut(r.id, 'actif')} className="text-green-600 p-1.5 hover:bg-green-50 rounded"><CheckCircle size={18}/></button>}
                    {r.statut !== 'suspendu' && <button onClick={() => updateStatut(r.id, 'suspendu')} className="text-orange-600 p-1.5 hover:bg-orange-50 rounded"><AlertCircle size={18}/></button>}
                    <button onClick={() => supprimerReseau(r.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map(r => (
            <div key={r.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{r.nom}</p>
                  <p className="text-xs text-gray-500">{r.responsable_nom}</p>
                </div>
                <StatusBadge statut={r.statut} />
              </div>
              <div className="flex gap-2">
                {r.statut !== 'actif' && <button onClick={() => updateStatut(r.id, 'actif')} className="flex-1 bg-green-50 text-green-700 py-1.5 rounded text-xs font-bold">Activer</button>}
                {r.statut !== 'suspendu' && <button onClick={() => updateStatut(r.id, 'suspendu')} className="flex-1 bg-orange-50 text-orange-700 py-1.5 rounded text-xs font-bold">Suspendre</button>}
                <button onClick={() => supprimerReseau(r.id)} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-xs font-bold">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ statut }) {
  const styles = {
    actif: "bg-green-50 text-green-700 border-green-200",
    suspendu: "bg-red-50 text-red-700 border-red-200",
    en_attente: "bg-amber-50 text-amber-700 border-amber-200"
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[statut] || 'bg-gray-100'}`}>{statut?.toUpperCase()}</span>
}