import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Eye, Search, X, Trash2 } from "lucide-react"

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

      let query = supabase.from("praticiens").select("*").neq("statut", "supprime")
      if (profile?.role === "association") query = query.eq("association_id", profile.organisation_id)
      if (profile?.role === "reseau") query = query.eq("reseau_id", profile.organisation_id)

      const { data, error } = await query.order("created_at", { ascending: false })
      if (!error) setPraticiens(data || [])
    } catch (err) { console.error("Erreur :", err) } finally { setLoading(false) }
  }

  const supprimerPraticien = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce praticien ?")) return;
    const { error } = await supabase.from("praticiens").update({ statut: 'supprime' }).eq("id", id);
    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
    } else {
      setPraticiens(prev => prev.filter(p => p.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  }

  // --- Fonction mise à jour pour réactivité immédiate ---
  const updateStatut = async (id, nouveauStatut) => {
    // 1. Mise à jour immédiate de l'affichage dans la liste
    setPraticiens(prev => prev.map(p => p.id === id ? { ...p, statut: nouveauStatut } : p));
    
    // 2. Mise à jour immédiate de la modale ouverte
    if (selected && selected.id === id) {
      setSelected(prev => ({ ...prev, statut: nouveauStatut }));
    }

    // 3. Mise à jour dans Supabase
    const { error } = await supabase.from("praticiens").update({ statut: nouveauStatut }).eq("id", id);
    if (error) {
        alert("Erreur lors de la mise à jour");
        fetchData(); // En cas d'erreur, on recharge les données réelles
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = praticiens.filter((p) => {
    const matchSearch = `${p.nom} ${p.prenom} ${p.numero_adherent || ""}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filter === "all" ? true : p.statut === filter
    const matchRegion = regionFilter === "all" ? true : (p.region || "").toLowerCase() === regionFilter.toLowerCase()
    return matchSearch && matchStatus && matchRegion
  })

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">👨‍⚕️ Gestion des Praticiens</h1>

      {/* FILTRES */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-gray-50">
          <Search size={16} className="text-gray-400" />
          <input className="p-2 bg-transparent outline-none w-full text-sm" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="p-2 border border-gray-300 rounded-lg text-sm bg-white" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="certifie">Certifiés</option>
          <option value="suspendu">Suspendus</option>
        </select>
        <select className="p-2 border border-gray-300 rounded-lg text-sm bg-white" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
          <option value="all">Toutes les régions</option>
          {REGIONS_BF.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* TABLEAU */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">Identité</th>
              <th className="p-4">N° Adhérent</th>
              <th className="p-4">Région</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 font-semibold">{p.nom} {p.prenom}</td>
                <td className="p-4 font-mono text-indigo-600">{p.numero_adherent}</td>
                <td className="p-4">{p.region}</td>
                <td className="p-4"><StatusBadge statut={p.statut} /></td>
                <td className="p-4 text-center flex justify-center gap-2">
                  <button onClick={() => setSelected(p)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600"><Eye size={16} /></button>
                  <button onClick={() => supprimerPraticien(p.id)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE DE DÉTAILS */}
      {selected && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-900 text-lg">Détails du Praticien</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase">{selected.nom} {selected.prenom}</h3>
                  <div className="mt-2"><StatusBadge statut={selected.statut} /></div>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="flex justify-between border-b pb-2"><span className="text-gray-500">N° Agrément</span> <span className="font-bold text-indigo-600">{selected.numero_adherent || "N/A"}</span></p>
                  <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Téléphone</span> <span className="font-medium">{selected.telephone || "Non renseigné"}</span></p>
                  <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Région</span> <span className="font-medium">{selected.region}</span></p>
                  <p className="flex justify-between border-b pb-2"><span className="text-gray-500">Commune</span> <span className="font-medium">{selected.commune || "Non renseignée"}</span></p>
                  <div className="border-b pb-2">
                    <span className="text-gray-500 block mb-1">Spécialités</span>
                    <p className="font-medium">{selected.specialite || "Aucune"}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-[250px] aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center shadow-inner">
                  {selected.photo ? (
                    <img src={selected.photo} alt="Praticien" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">Aucune photo</span>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => updateStatut(selected.id, "certifie")} className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm">Certifier</button>
                  <button onClick={() => updateStatut(selected.id, "suspendu")} className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm">Suspendre</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ statut }) {
  const config = {
    certifie: "bg-green-50 text-green-700 border-green-200",
    en_attente: "bg-amber-50 text-amber-700 border-amber-200",
    suspendu: "bg-red-50 text-red-700 border-red-200"
  };
  return <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${config[statut] || 'bg-gray-100'}`}>{statut?.replace('_', ' ').toUpperCase()}</span>
}