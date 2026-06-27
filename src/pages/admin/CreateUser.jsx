import { useState } from "react"
import { supabase } from "../../services/supabase"

export default function CreateUser() {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("reseau")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // 1️⃣ CREER AUTH USER
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true
        })

      if (authError) throw authError

      const userId = authData.user.id

      // 2️⃣ CREER PROFIL USER
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          id: userId,
          nom,
          prenom,
          email
        })

      if (profileError) throw profileError

      // 3️⃣ ASSIGNER ROLE
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: role
        })

      if (roleError) throw roleError

      setMessage("✔ Utilisateur créé avec succès")

      // reset form
      setNom("")
      setPrenom("")
      setEmail("")
      setPassword("")
      setRole("reseau")

    } catch (err) {
      console.log(err)
      setMessage("❌ Erreur création utilisateur")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded-xl">

      <h2 className="text-xl font-bold mb-4">
        ➕ Créer un compte
      </h2>

      <form onSubmit={handleCreate} className="space-y-3">

        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="reseau">Réseau</option>
          <option value="association">Association</option>
          <option value="praticien">Praticien</option>
        </select>

        <button
          disabled={loading}
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          {loading ? "Création..." : "Créer utilisateur"}
        </button>

      </form>

      {message && (
        <p className="mt-3 text-sm text-center">
          {message}
        </p>
      )}
    </div>
  )
}