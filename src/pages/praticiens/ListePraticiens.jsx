import { useEffect, useState } from "react"
import {
  getPraticiens,
  deletePraticien
} from "../../services/praticienService"

import { Link } from "react-router-dom"

export default function ListePraticiens() {
  const [praticiens, setPraticiens] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)

    const { data, error } = await getPraticiens()

    if (error) {
      console.error(error.message)
    } else {
      setPraticiens(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce praticien ?"
    )

    if (!confirmDelete) return

    await deletePraticien(id)
    fetchData()
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Liste des praticiens
        </h1>

        <Link
          to="/praticiens/ajouter"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Ajouter
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded p-4">

        {loading ? (
          <p className="text-center py-6">
            Chargement...
          </p>
        ) : praticiens.length === 0 ? (
          <p className="text-center py-6 text-gray-500">
            Aucun praticien enregistré
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th>Nom</th>
                <th>Prénom</th>
                <th>Téléphone</th>
                <th>Région</th>
                <th>Numéro</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {praticiens.map((p) => (
                <tr key={p.id} className="border-b">

                  <td>{p.nom}</td>
                  <td>{p.prenom}</td>
                  <td>{p.telephone}</td>
                  <td>{p.region}</td>

                  {/* NUMÉRO ADHÉRENT */}
                  <td className="font-semibold text-green-700">
                    {p.numero_adherent}
                  </td>

                  <td className="flex gap-3 items-center">

                    {/* DÉTAIL / QR CODE */}
                    <Link
                      to={`/praticiens/${p.id}`}
                      className="text-green-600"
                    >
                      Voir
                    </Link>

                    {/* MODIFIER */}
                    <Link
                      to={`/praticiens/edit/${p.id}`}
                      className="text-blue-600"
                    >
                      Modifier
                    </Link>

                    {/* SUPPRIMER */}
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600"
                    >
                      Supprimer
                    </button>
					
                   {/* CARTE */}
                   <Link
                     to={`/praticiens/carte/${p.id}`}
                        className="text-purple-600"
                    >
                      Carte PDF
                     </Link>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  )
}