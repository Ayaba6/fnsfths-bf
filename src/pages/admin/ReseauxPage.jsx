import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Network, Search, RefreshCcw } from "lucide-react"

export default function ReseauxPage() {
  const [reseaux, setReseaux] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchReseaux = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("organisations")
      .select("*")
      .eq("type", "reseau")
      .order("created_at", { ascending: false })

    if (!error) {
      setReseaux(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchReseaux()
  }, [])

  const filtered = reseaux.filter((r) =>
    (r.nom || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Network className="text-green-600" />
            Gestion des Réseaux
          </h1>
          <p className="text-gray-500 text-sm">
            Liste des réseaux enregistrés dans le système
          </p>
        </div>

        <button
          onClick={fetchReseaux}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
        >
          <RefreshCcw size={16} />
          Actualiser
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
        <Search size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un réseau..."
          className="w-full outline-none"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Responsable</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Téléphone</th>
                <th className="p-3 text-left">Région</th>
                <th className="p-3 text-left">Statut</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">

                  <td className="p-3 font-medium">{r.nom}</td>
                  <td className="p-3">{r.responsable_nom}</td>
                  <td className="p-3 text-gray-600">{r.email}</td>
                  <td className="p-3">{r.telephone}</td>
                  <td className="p-3">{r.region}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        r.statut === "actif"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.statut}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  )
}