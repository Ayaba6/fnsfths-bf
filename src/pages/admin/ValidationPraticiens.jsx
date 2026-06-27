import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { updateStatutPraticien } from "../../services/adminService"

export default function ValidationPraticiens() {
  const [praticiens, setPraticiens] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)

    const { data } = await supabase
      .from("praticiens")
      .select("*")
      .order("created_at", { ascending: false })

    setPraticiens(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUpdate = async (id, statut) => {
    await updateStatutPraticien(id, statut)
    fetchData()
  }

  if (loading) {
    return <p className="p-6">Chargement...</p>
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Validation des praticiens
      </h1>

      <div className="bg-white shadow rounded p-4">

        <table className="w-full">

          <thead>
            <tr className="text-left border-b">
              <th>Nom</th>
              <th>Numéro</th>
              <th>Région</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {praticiens.map((p) => (
              <tr key={p.id} className="border-b">

                <td>{p.nom} {p.prenom}</td>
                <td className="text-green-700 font-bold">
                  {p.numero_adherent}
                </td>
                <td>{p.region}</td>

                <td>
                  <span className="text-sm font-semibold">
                    {p.statut}
                  </span>
                </td>

                <td className="flex gap-2 py-2">

                  {/* VALIDER */}
                  <button
                    onClick={() => handleUpdate(p.id, "certifie")}
                    className="bg-green-600 text-white px-2 py-1 text-xs rounded"
                  >
                    Certifier
                  </button>

                  {/* SUSPENDRE */}
                  <button
                    onClick={() => handleUpdate(p.id, "suspendu")}
                    className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                  >
                    Suspendre
                  </button>

                  {/* INACTIF */}
                  <button
                    onClick={() => handleUpdate(p.id, "inactif")}
                    className="bg-gray-600 text-white px-2 py-1 text-xs rounded"
                  >
                    Inactif
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