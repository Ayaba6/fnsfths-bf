import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"

export default function CarteList() {
  const [praticiens, setPraticiens] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("praticiens")
        .select("id, nom, prenom, region, statut")

      if (!error) setPraticiens(data || [])
    }

    fetch()
  }, [])

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        📇 Liste des cartes FNSTHS
      </h1>

      <div className="grid md:grid-cols-3 gap-4">

        {praticiens.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow">

            <p className="font-bold">
              {p.nom} {p.prenom}
            </p>

            <p className="text-sm text-gray-500">
              {p.region}
            </p>

            <p className="text-xs mt-1">
              Statut: {p.statut}
            </p>

            <Link
              to={`/admin/praticiens/carte/${p.id}`}
              className="text-green-600 text-sm mt-2 block"
            >
              Voir carte →
            </Link>

          </div>
        ))}

      </div>
    </div>
  )
}