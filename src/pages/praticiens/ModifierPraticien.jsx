import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"
import { updatePraticien } from "../../services/praticienService"

export default function ModifierPraticien() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    region: "",
    specialite: ""
  })

  const [loading, setLoading] = useState(true)

  // Charger données praticien
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("praticiens")
        .select("*")
        .eq("id", id)
        .single()

      if (data) {
        setForm({
          nom: data.nom || "",
          prenom: data.prenom || "",
          telephone: data.telephone || "",
          region: data.region || "",
          specialite: data.specialite || ""
        })
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await updatePraticien(id, form)

    if (error) {
      alert(error.message)
    } else {
      alert("Modification réussie ✅")
      navigate("/praticiens")
    }
  }

  if (loading) {
    return <p className="p-6">Chargement...</p>
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Modifier le praticien
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded grid gap-3"
      >
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          className="border p-2"
          placeholder="Nom"
        />

        <input
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          className="border p-2"
          placeholder="Prénom"
        />

        <input
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          className="border p-2"
          placeholder="Téléphone"
        />

        <input
          name="region"
          value={form.region}
          onChange={handleChange}
          className="border p-2"
          placeholder="Région"
        />

        <input
          name="specialite"
          value={form.specialite}
          onChange={handleChange}
          className="border p-2"
          placeholder="Spécialité"
        />

        <button className="bg-blue-600 text-white p-2">
          Enregistrer modifications
        </button>
      </form>
    </div>
  )
}