import { useState } from "react"
import { supabase } from "../../services/supabase"
import BadgeStatut from "../../components/ui/BadgeStatut"

export default function PublicSearch() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setError("")
    setResult([])

    if (!query.trim()) {
      setError("Veuillez saisir un nom ou un numéro d'adhérent")
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from("praticiens")
      .select("*")
      .or(
        `nom.ilike.%${query}%,prenom.ilike.%${query}%,numero_adherent.ilike.%${query}%`
      )
      .limit(20)

    setLoading(false)

    if (error) {
      setError("Erreur de recherche")
      return
    }

    if (!data || data.length === 0) {
      setError("Aucun praticien trouvé ❌")
      return
    }

    setResult(data)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Annuaire Public FNSTHS
      </h1>

      {/* SEARCH BOX */}
      <div className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom ou numéro d'adhérent..."
          className="border p-2 flex-1 rounded"
        />

        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 rounded"
        >
          Rechercher
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">
          Recherche en cours...
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-600 mb-4 text-center">
          {error}
        </p>
      )}

      {/* RESULTS */}
      <div className="grid gap-4">

        {result.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow p-4 rounded flex justify-between items-center"
          >

            {/* LEFT */}
            <div className="flex gap-4 items-center">

              {/* PHOTO */}
              {p.photo ? (
                <img
                  src={p.photo}
                  className="w-16 h-16 rounded-full object-cover border"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                  No photo
                </div>
              )}

              {/* INFOS */}
              <div>
                <h2 className="font-bold text-lg">
                  {p.nom} {p.prenom}
                </h2>

                <p className="text-green-700 font-semibold">
                  {p.numero_adherent}
                </p>

                <p className="text-sm text-gray-600">
                  {p.region} • {p.specialite}
                </p>
              </div>
            </div>

            {/* RIGHT BADGE */}
            <BadgeStatut statut={p.statut} />

          </div>
        ))}

      </div>

      {/* EMPTY STATE */}
      {!loading && result.length === 0 && !error && (
        <p className="text-center text-gray-400 mt-6">
          Recherchez un praticien dans l'annuaire FNSTHS
        </p>
      )}

    </div>
  )
}