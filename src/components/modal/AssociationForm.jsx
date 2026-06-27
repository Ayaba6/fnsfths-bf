import { useState, useEffect } from "react"
import { supabase } from "../../services/supabase"

export default function AssociationForm({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [reseau, setReseau] = useState(null)

  const [form, setForm] = useState({
    nom: "",
    responsable_nom: "",
    email: "",
    password: "",
    telephone: "",
    region: "",
    ville: "",
    description: ""
  })

  const [photoFile, setPhotoFile] = useState(null)
  const [cnibFile, setCnibFile] = useState(null)

  // ================= GET RESEAU (CORRIGÉ) =================
  useEffect(() => {
    const getReseau = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 🔥 ON CHERCHE LE RESEAU DANS organisations
      const { data, error } = await supabase
        .from("organisations")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "reseau")
        .single()

      if (!error) setReseau(data)
    }

    getReseau()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ================= UPLOAD =================
  const uploadFile = async (file, folder) => {
    if (!file) return null

    const fileName = `${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from("documents-asso")
      .upload(`${folder}/${fileName}`, file)

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from("documents-asso")
      .getPublicUrl(data.path)

    return urlData.publicUrl
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      if (!reseau) {
        throw new Error("Réseau introuvable")
      }

      // 1️⃣ CREATE AUTH USER (association)
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              role: "association"
            }
          }
        })

      if (authError) throw authError

      const userId = authData?.user?.id
      if (!userId) throw new Error("Erreur création utilisateur")

      // 2️⃣ UPLOAD FILES
      const photo_url = await uploadFile(photoFile, "photos")
      const cnib_url = await uploadFile(cnibFile, "cnib")

      // 3️⃣ INSERT ASSOCIATION
      const { error: insertError } = await supabase
        .from("organisations")
        .insert([
          {
            nom: form.nom,
            responsable_nom: form.responsable_nom,
            email: form.email,
            telephone: form.telephone,
            region: form.region,
            ville: form.ville,
            description: form.description,

            parent_id: reseau.id, // 🔥 IMPORTANT
            type: "association",
            statut: "actif",

            user_id: userId,

            photo_url,
            cnib_url,

            created_at: new Date().toISOString()
          }
        ])

      if (insertError) throw insertError

      // 4️⃣ RESET
      setMessage("✔ Association + compte créé avec succès")

      setForm({
        nom: "",
        responsable_nom: "",
        email: "",
        password: "",
        telephone: "",
        region: "",
        ville: "",
        description: ""
      })

      setPhotoFile(null)
      setCnibFile(null)

      if (onSuccess) onSuccess()

    } catch (err) {
      console.error(err)
      setMessage("❌ Erreur : " + err.message)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      <input name="nom" value={form.nom} onChange={handleChange}
        placeholder="Nom association"
        className="border p-2 w-full rounded"
      />

      <input name="responsable_nom" value={form.responsable_nom} onChange={handleChange}
        placeholder="Responsable"
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

      <input name="ville" value={form.ville} onChange={handleChange}
        placeholder="Ville"
        className="border p-2 w-full rounded"
      />

      <textarea name="description" value={form.description} onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full rounded"
      />

      {/* PHOTO */}
      <input
        type="file"
        onChange={(e) => setPhotoFile(e.target.files[0])}
        className="border p-2 w-full rounded"
      />

      {/* CNIB */}
      <input
        type="file"
        onChange={(e) => setCnibFile(e.target.files[0])}
        className="border p-2 w-full rounded"
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white w-full p-2 rounded"
      >
        {loading ? "Création..." : "Créer association"}
      </button>

      {message && (
        <p className="text-sm text-center mt-2">{message}</p>
      )}

    </form>
  )
}