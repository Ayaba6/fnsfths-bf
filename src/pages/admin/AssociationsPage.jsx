import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { Building2, Search, RefreshCcw } from "lucide-react"

export default function AssociationsPage() {
  const [associations, setAssociations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchAssociations = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user")

      // 🔥 SAFE PROFILE FETCH
      const { data: profile, error } = await supabase
        .from("users")
        .select("organisation_id, role")
        .eq("id", user.id)
        .maybeSingle()

      if (error) console.log(error)

      const reseauId = profile?.organisation_id

      console.log("RESEAU ID:", reseauId)

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
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchAssociations()
  }, [])

  const filtered = associations.filter((a) =>
    (a.nom || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="text-green-600" />
          Associations
        </h1>

        <button
          onClick={fetchAssociations}
          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
        >
          <RefreshCcw size={16} />
          Actualiser
        </button>

      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher..."
        className="border p-2 w-full rounded"
      />

      {/* CONTENT */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3">Nom</th>
                <th>Responsable</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Région</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3 font-medium">{a.nom}</td>
                  <td>{a.responsable_nom}</td>
                  <td>{a.email}</td>
                  <td>{a.telephone}</td>
                  <td>{a.region}</td>
                  <td>{a.statut}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  )
}