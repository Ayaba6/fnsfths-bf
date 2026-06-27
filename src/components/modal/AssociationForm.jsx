import { useState } from "react"
import { supabase } from "../../services/supabase"

export default function AssociationForm({ onSuccess }) {
  const [form, setForm] = useState({
    nom: "",
    responsable_nom: "",
    email: "",
    telephone: "",
    region: "",
    ville: "",
    description: ""
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.from("organisations").insert([
        {
          nom: form.nom,
          responsable_nom: form.responsable_nom,
          email: form.email,
          telephone: form.telephone,
          region: form.region,
          ville: form.ville,
          description: form.description,
          type: "association",
          statut: "actif",
          created_at: new Date()
        }
      ])

      if (error) throw error

      setMessage("✔ Association créée avec succès")

      setForm({
        nom: "",
        responsable_nom: "",
        email: "",
        telephone: "",
        region: "",
        ville: "",
        description: ""
      })

      if (onSuccess) onSuccess()

    } catch (err) {
      console.log(err)
      setMessage("❌ Erreur lors de la création")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      <input
        name="nom"
        value={form.nom}
        onChange={handleChange}
        placeholder="Nom de l'association"
        className="border p-2 w-full rounded"
      />

      <input
        name="responsable_nom"
        value={form.responsable_nom}
        onChange={handleChange}
        placeholder="Nom du responsable"
        className="border p-2 w-full rounded"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full rounded"
      />

      <input
        name="telephone"
        value={form.telephone}
        onChange={handleChange}
        placeholder="Téléphone"
        className="border p-2 w-full rounded"
      />

      <input
        name="region"
        value={form.region}
        onChange={handleChange}
        placeholder="Région"
        className="border p-2 w-full rounded"
      />

      <input
        name="ville"
        value={form.ville}
        onChange={handleChange}
        placeholder="Ville"
        className="border p-2 w-full rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description de l'association"
        className="border p-2 w-full rounded"
      />

      <button
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded"
      >
        {loading ? "Création..." : "Créer l'association"}
      </button>

      {message && (
        <p className="text-sm text-center mt-2">
          {message}
        </p>
      )}

    </form>
  )
}