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

  // ================= REGIONS BURKINA =================
  const REGIONS_BF = [
    "Bankui",
    "Boucle du Mouhoun",
    "Centre",
    "Centre-Est",
    "Centre-Nord",
    "Centre-Ouest",
    "Centre-Sud",
    "Djôrô",
    "Goulmou",
    "Guiriko",
    "Plateau-Central",
    "Sahel",
    "Sirba",
    "Soum",
    "Sourou",
    "Tapoa",
    "Yaadga"
  ]

  const normalize = (text) =>
    (text || "").toLowerCase().replace(/\s/g, "")

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true)

    try {
      console.log("🚀 FETCH START")

      const { data, error } = await supabase
        .from("praticiens")
        .select("*")
        .order("created_at", { ascending: false })

      console.log("📊 DATA:", data)
      console.log("⚠️ ERROR:", error)

      if (!error) setPraticiens(data || [])

    } catch (err) {
      console.error("FETCH ERROR:", err)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ================= FILTERING =================
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
        : normalize(p.region).includes(normalize(regionFilter))

    return matchSearch && matchStatus && matchRegion
  })

  // ================= DELETE =================
  const deletePraticien = async (id) => {
    if (!confirm("Supprimer ce praticien ?")) return

    const { error } = await supabase
      .from("praticiens")
      .delete()
      .eq("id", id)

    console.log("🗑 DELETE ERROR:", error)

    fetchData()
  }

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        👨‍⚕️ Gestion des Praticiens
      </h1>

      {/* FILTER BAR */}
      <div className="flex gap-3 flex-wrap items-center">

        {/* SEARCH */}
        <div className="flex items-center border rounded px-2">
          <Search size={16} />
          <input
            className="p-2 outline-none"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATUS FILTER */}
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

        {/* REGION FILTER */}
        <div className="flex items-center border rounded px-2">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="p-2"
          >
            <option value="all">🌍 Toutes les régions</option>
            {REGIONS_BF.map((r, i) => (
              <option key={i} value={r}>
                {r}
              </option>
            ))}
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
                  <span className={`px-2 py-1 rounded text-xs ${
                    p.statut === "certifie"
                      ? "bg-green-100 text-green-700"
                      : p.statut === "suspendu"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {p.statut}
                  </span>
                </td>

                <td className="flex gap-2 p-2">

                  <button
                    onClick={() => setSelected(p)}
                    className="text-blue-600"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => deletePraticien(p.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL DETAILS */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="space-y-2">

            <h2 className="text-xl font-bold">
              Détails praticien
            </h2>

            <p><b>Nom:</b> {selected.nom}</p>
            <p><b>Prénom:</b> {selected.prenom}</p>
            <p><b>Email:</b> {selected.email}</p>
            <p><b>Téléphone:</b> {selected.telephone}</p>
            <p><b>Région:</b> {selected.region}</p>
            <p><b>Spécialité:</b> {selected.specialite}</p>
            <p><b>Numéro:</b> {selected.numero_adherent}</p>
            <p><b>Statut:</b> {selected.statut}</p>

            {selected.photo && (
              <img
                src={selected.photo}
                className="w-32 h-32 object-cover rounded"
              />
            )}

          </div>
        </Modal>
      )}

    </div>
  )
}

/* ================= MODAL ================= */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[500px] relative">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  )
}