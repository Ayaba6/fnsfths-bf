import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Eye, Search, Filter, Trash2 } from "lucide-react"

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
      // 🔥 1. user connecté
      const { data: { user } } = await supabase.auth.getUser()

      // 🔥 2. rôle + organisation
      const { data: profile } = await supabase
        .from("users")
        .select("role, organisation_id")
        .eq("id", user.id)
        .single()

      let query = supabase
        .from("praticiens")
        .select("*")

      // 🔥 3. FILTRAGE SELON ROLE

      if (profile?.role === "association") {
        query = query.eq("association_id", profile.organisation_id)
      }

      if (profile?.role === "reseau") {
        query = query.eq("reseau_id", profile.organisation_id)
      }

      // admin_federation → pas de filtre

      const { data, error } = await query.order("created_at", {
        ascending: false
      })

      if (!error) {
        setPraticiens(data || [])
      }

    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = praticiens.filter((p) => {
    const matchSearch =
      `${p.nom} ${p.prenom} ${p.numero_adherent}`
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchStatus =
      filter === "all" ? true : p.statut === filter

    const matchRegion =
      regionFilter === "all"
        ? true
        : (p.region || "")
            .toLowerCase()
            .includes(regionFilter.toLowerCase())

    return matchSearch && matchStatus && matchRegion
  })

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-2xl font-bold">
        👨‍⚕️ Gestion des Praticiens
      </h1>

      {/* FILTER BAR */}
      <div className="flex gap-3 flex-wrap items-center">

        <div className="flex items-center border rounded px-2">
          <Search size={16} />
          <input
            className="p-2 outline-none"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center border rounded px-2">
          <Filter size={16} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2"
          >
            <option value="all">Tous statuts</option>
            <option value="en_attente">En attente</option>
            <option value="certifie">Certifiés</option>
            <option value="suspendu">Suspendus</option>
          </select>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Nom</th>
              <th>Numéro</th>
              <th>Région</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">

                <td className="p-3">
                  {p.nom} {p.prenom}
                </td>

                <td className="text-green-700">
                  {p.numero_adherent}
                </td>

                <td>{p.region}</td>

                <td>
                  <span className="px-2 py-1 rounded text-xs bg-gray-100">
                    {p.statut}
                  </span>
                </td>

                <td className="flex gap-2 p-2">
                  <button onClick={() => setSelected(p)}>
                    <Eye size={18} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  )
}