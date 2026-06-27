import { useState } from "react"
import {
  addPraticien,
  getLastPraticien
} from "../../services/praticienService"

import { generateMemberId } from "../../utils/generateMemberId"

export default function AjouterPraticien() {
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    region: "",
    specialite: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. récupérer dernier numéro
      const { data: lastData } = await getLastPraticien()

      const lastNumber = lastData?.numero_adherent || null

      // 2. générer nouveau numéro
      const numero_adherent = generateMemberId(lastNumber)

      // 3. enregistrer praticien
      const { error } = await addPraticien({
        ...form,
        numero_adherent
      })

      if (error) {
        alert(error.message)
      } else {
        alert(
          "Praticien ajouté avec succès ✅\nNuméro : " +
          numero_adherent
        )

        // reset form
        setForm({
          nom: "",
          prenom: "",
          telephone: "",
          region: "",
          specialite: ""
        })
      }

    } catch (err) {
      console.error(err)
      alert("Erreur serveur")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Ajouter un praticien
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded grid gap-3"
      >
        <input
          name="nom"
          placeholder="Nom"
          className="border p-2"
          value={form.nom}
          onChange={handleChange}
          required
        />

        <input
          name="prenom"
          placeholder="Prénom"
          className="border p-2"
          value={form.prenom}
          onChange={handleChange}
          required
        />

        <input
          name="telephone"
          placeholder="Téléphone"
          className="border p-2"
          value={form.telephone}
          onChange={handleChange}
          required
        />

        <input
          name="region"
          placeholder="Région"
          className="border p-2"
          value={form.region}
          onChange={handleChange}
          required
        />

        <input
          name="specialite"
          placeholder="Spécialité"
          className="border p-2"
          value={form.specialite}
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="bg-green-600 text-white p-2"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  )
}