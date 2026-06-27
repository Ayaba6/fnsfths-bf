import { useState } from "react"
import { supabase } from "../../services/supabase"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  Camera,
  FileImage,
  FileText,
  BadgeCheck,
  Loader2
} from "lucide-react"

export default function PraticienForm({ onSuccess }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    region: "",
    specialite: "",
    statut: "en_attente",
    reseau_id: "",
    association_id: ""
  })

  const [files, setFiles] = useState({
    photo: null,
    cni_recto: null,
    cni_verso: null,
    diplome: null
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // ================= REGIONS BURKINA =================
  const REGIONS_BF = [
    "Bankui (Cascades)",
    "Boucle du Mouhoun",
    "Centre",
    "Centre-Est",
    "Centre-Nord",
    "Centre-Ouest",
    "Centre-Sud",
    "Djôrô (Sud-Ouest)",
    "Goulmou (Est)",
    "Guiriko (Hauts-Bassins)",
    "Plateau-Central",
    "Sahel",
    "Sirba",
    "Soum",
    "Sourou",
    "Tapoa",
    "Yaadga (Nord)"
  ]

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] })
  }

  const uploadFile = async (file, folder) => {
    if (!file) return null

    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from("documents-praticiens")
      .upload(`${folder}/${fileName}`, file)

    if (error) throw error

    const { data } = supabase.storage
      .from("documents-praticiens")
      .getPublicUrl(`${folder}/${fileName}`)

    return data.publicUrl
  }

  const generateNumero = () =>
    "FNSTHS-" + Date.now().toString().slice(-8)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const numero_adherent = generateNumero()

      const photo_url = await uploadFile(files.photo, "photos")
      const cni_recto_url = await uploadFile(files.cni_recto, "cni")
      const cni_verso_url = await uploadFile(files.cni_verso, "cni")
      const diplome_url = await uploadFile(files.diplome, "diplomes")

      const { error } = await supabase.from("praticiens").insert([
        {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          telephone: form.telephone,
          region: form.region, // ✅ maintenant select
          specialite: form.specialite,
          statut: form.statut,
          reseau_id: form.reseau_id || null,
          association_id: form.association_id || null,
          numero_adherent,

          photo: photo_url,
          cni_recto: cni_recto_url,
          cni_verso: cni_verso_url,
          diplome: diplome_url,

          created_at: new Date().toISOString()
        }
      ])

      if (error) throw error

      setMessage("✔ Praticien créé avec succès")

      setForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        region: "",
        specialite: "",
        statut: "en_attente",
        reseau_id: "",
        association_id: ""
      })

      setFiles({
        photo: null,
        cni_recto: null,
        cni_verso: null,
        diplome: null
      })

      if (onSuccess) onSuccess()
    } catch (err) {
      console.error(err)
      setMessage("❌ Erreur upload ou insertion")
    }

    setLoading(false)
  }

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="border-b pb-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <User className="text-green-600" />
          Création d’un praticien
        </h2>
        <p className="text-sm text-gray-500">
          Ajout des informations et documents officiels
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* INFOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <Input icon={<User size={16} />} name="nom" placeholder="Nom" onChange={handleChange} />
          <Input icon={<User size={16} />} name="prenom" placeholder="Prénom" onChange={handleChange} />

          <Input icon={<Mail size={16} />} name="email" placeholder="Email" onChange={handleChange} />
          <Input icon={<Phone size={16} />} name="telephone" placeholder="Téléphone" onChange={handleChange} />
          <Input icon={<Stethoscope size={16} />} name="specialite" placeholder="Spécialité" onChange={handleChange} />

          {/* 🔥 REGION SELECT */}
          <div className="relative">
            <div className="absolute left-3 top-2.5 text-gray-400">
              <MapPin size={16} />
            </div>

            <select
              name="region"
              value={form.region}
              onChange={handleChange}
              className="border p-2 pl-9 w-full rounded focus:ring-2 focus:ring-purple-300 outline-none"
            >
              <option value="">-- Choisir une région --</option>
              {REGIONS_BF.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* PHOTO MOBILE */}
        <div className="border rounded p-3 bg-gray-50">
          <label className="flex items-center gap-2 font-semibold mb-2">
            <Camera size={16} /> Photo du praticien
          </label>

          <input
            type="file"
            name="photo"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* DOCUMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <FileInput label="CNI Recto" name="cni_recto" onChange={handleFileChange} icon={<FileImage size={16} />} />
          <FileInput label="CNI Verso" name="cni_verso" onChange={handleFileChange} icon={<FileImage size={16} />} />
          <FileInput label="Diplôme" name="diplome" onChange={handleFileChange} icon={<FileText size={16} />} />

        </div>

        {/* STATUT */}
        <select
          name="statut"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="en_attente">En attente</option>
          <option value="certifie">Certifié</option>
          <option value="suspendu">Suspendu</option>
        </select>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full p-2 rounded flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Création...
            </>
          ) : (
            <>
              <BadgeCheck size={16} />
              Créer praticien
            </>
          )}
        </button>

        {message && (
          <p className="text-center text-sm mt-2">
            {message}
          </p>
        )}

      </form>
    </div>
  )
}

/* ================= INPUT ================= */
function Input({ icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-2.5 text-gray-400">
        {icon}
      </div>
      <input
        {...props}
        className="border p-2 pl-9 w-full rounded focus:ring-2 focus:ring-purple-300 outline-none"
      />
    </div>
  )
}

/* ================= FILE INPUT ================= */
function FileInput({ label, name, onChange, icon }) {
  return (
    <div className="border rounded p-3 bg-white">
      <label className="flex items-center gap-2 font-semibold mb-2">
        {icon} {label}
      </label>
      <input type="file" name={name} onChange={onChange} />
    </div>
  )
}