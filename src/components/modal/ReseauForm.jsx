import { useState } from "react"
import { supabase } from "../../services/supabase"

export default function ReseauForm({ onSuccess }) {
  const [form, setForm] = useState({
    nom: "",
    responsable_nom: "",
    email: "",
    password: "",
    telephone: "",
    region: "",
    description: ""
  })

  const [cnibFile, setCnibFile] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ================= UPLOAD =================
  const uploadFile = async (file, folder) => {
    if (!file) return null

    const fileName = `${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from("documents-reseau")
      .upload(`${folder}/${fileName}`, file)

    if (error) throw error

    return data.path
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // 1️⃣ CREATE AUTH USER
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              role: "reseau"
            }
          }
        })

      if (authError) throw authError

      const userId = authData?.user?.id

      if (!userId) {
        throw new Error("Impossible de créer l'utilisateur")
      }

      // 2️⃣ UPLOAD FILES
      const cnib_url = await uploadFile(cnibFile, "cnib")
      const photo_url = await uploadFile(photoFile, "photos")

      // 3️⃣ INSERT ORGANISATION
      const { error: insertError } = await supabase
        .from("organisations")
        .insert([
          {
            nom: form.nom,
            responsable_nom: form.responsable_nom,
            email: form.email,
            telephone: form.telephone,
            region: form.region,
            description: form.description,

            cnib_url,
            photo_url,

            user_id: userId,
            type: "reseau",
            statut: "actif",
            created_at: new Date().toISOString()
          }
        ])

      if (insertError) throw insertError

      // 4️⃣ SUCCESS
      setMessage("✔ Réseau + compte créé avec succès")

      setForm({
        nom: "",
        responsable_nom: "",
        email: "",
        password: "",
        telephone: "",
        region: "",
        description: ""
      })

      setCnibFile(null)
      setPhotoFile(null)

      if (onSuccess) onSuccess()

    } catch (err) {
      console.error("❌ ERROR:", err.message)
      setMessage("❌ Erreur lors de la création : " + err.message)
    }

    setLoading(false)
  }

  // ================= UI =================
  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      <input name="nom" value={form.nom} onChange={handleChange}
        placeholder="Nom du réseau"
        className="border p-2 w-full rounded"
      />

      <input name="responsable_nom" value={form.responsable_nom} onChange={handleChange}
        placeholder="Nom du responsable"
        className="border p-2 w-full rounded"
      />

      <input name="email" value={form.email} onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full rounded"
      />

      <input name="password" type="password" value={form.password} onChange={handleChange}
        placeholder="Mot de passe"
        className="border p-2 w-full rounded"
      />

      <input name="telephone" value={form.telephone} onChange={handleChange}
        placeholder="Téléphone"
        className="border p-2 w-full rounded"
      />

      <input name="region" value={form.region} onChange={handleChange}
        placeholder="Région"
        className="border p-2 w-full rounded"
      />

      <textarea name="description" value={form.description} onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full rounded"
      />

      {/* CNIB */}
      <div>
        <label className="text-sm">CNIB</label>
        <input type="file"
          onChange={(e) => setCnibFile(e.target.files[0])}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* PHOTO */}
      <div>
        <label className="text-sm">Photo responsable</label>
        <input type="file"
          onChange={(e) => setPhotoFile(e.target.files[0])}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* BUTTON */}
      <button
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded"
      >
        {loading ? "Création..." : "Créer le réseau + compte"}
      </button>

      {message && (
        <p className="text-sm text-center mt-2">{message}</p>
      )}

    </form>
  )
}