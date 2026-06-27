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
  Loader2,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  UserCheck
} from "lucide-react"

// Liste officielle des 13 régions du Burkina Faso
const REGIONS_BF = [
  "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", 
  "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", 
  "Plateau-Central", "Sahel", "Sud-Ouest"
]

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
  const [status, setStatus] = useState({ type: "", text: "" }) // { type: 'success' | 'error', text: '' }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (name, file) => {
    setFiles({ ...files, [name]: file })
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

  const generateNumero = () => "FNSTHS-" + Date.now().toString().slice(-8)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: "", text: "" })

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
          region: form.region,
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

      setStatus({ type: "success", text: "Praticien enregistré avec succès !" })

      setForm({
        nom: "", prenom: "", email: "", telephone: "", region: "",
        specialite: "", statut: "en_attente", reseau_id: "", association_id: ""
      })

      setFiles({ photo: null, cni_recto: null, cni_verso: null, diplome: null })

      if (onSuccess) setTimeout(() => onSuccess(), 1500)
    } catch (err) {
      console.error(err)
      setStatus({ type: "error", text: "Erreur lors de l'enregistrement ou du téléversement." })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
      
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Stethoscope className="text-indigo-600 w-5 h-5" />
          Création d’un Praticien
        </h3>
        <p className="text-xs text-gray-500">
          Ajout des informations professionnelles et des pièces justificatives obligatoires.
        </p>
      </div>

      {/* Alert Banner */}
      {status.text && (
        <div className={`p-3.5 rounded-lg flex items-center gap-2.5 text-sm font-medium border ${
          status.type === "success" 
            ? "bg-green-50 text-green-700 border-green-200" 
            : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{status.text}</span>
        </div>
      )}

      {/* INFORMATIONS PERSONNELLES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Nom</label>
          <Input required icon={<User size={16} />} name="nom" value={form.nom} placeholder="Nom" onChange={handleChange} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Prénom(s)</label>
          <Input required icon={<User size={16} />} name="prenom" value={form.prenom} placeholder="Prénom" onChange={handleChange} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Email</label>
          <Input required type="email" icon={<Mail size={16} />} name="email" value={form.email} placeholder="adresse@email.com" onChange={handleChange} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Téléphone</label>
          <Input required icon={<Phone size={16} />} name="telephone" value={form.telephone} placeholder="+226 XX XX XX XX" onChange={handleChange} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Spécialité médicale</label>
          <Input required icon={<Stethoscope size={16} />} name="specialite" value={form.specialite} placeholder="Ex: Infirmier d'État, Généraliste" onChange={handleChange} />
        </div>

        {/* REGION SELECT */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Région d'exercice</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <select required name="region" value={form.region} onChange={handleChange}
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
            >
              <option value="" disabled hidden>Sélectionner la région</option>
              {REGIONS_BF.map((r, i) => <option key={i} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

      </div>

      {/* SECTION PHOTO ET PIÈCES JOINTES */}
      <div className="pt-2 border-t border-gray-100">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Documents & Justificatifs</label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* PHOTO MOBILE / PORTRAIT */}
          <div className="sm:col-span-2">
            <FileInput 
              label="Photo portrait du praticien" 
              name="photo" 
              file={files.photo}
              accept="image/*"
              capture="environment"
              onChange={handleFileChange} 
              icon={<Camera size={16} />} 
            />
          </div>

          <FileInput label="CNI (Recto)" name="cni_recto" file={files.cni_recto} onChange={handleFileChange} icon={<FileImage size={16} />} />
          <FileInput label="CNI (Verso)" name="cni_verso" file={files.cni_verso} onChange={handleFileChange} icon={<FileImage size={16} />} />
          
          <div className="sm:col-span-2">
            <FileInput label="Copie du Diplôme principal" name="diplome" file={files.diplome} onChange={handleFileChange} icon={<FileText size={16} />} />
          </div>

        </div>
      </div>

      {/* STATUT DE VALIDATION */}
      <div className="pt-2 border-t border-gray-100 space-y-1">
        <label className="text-xs font-medium text-gray-600">Statut d'adhésion initial</label>
        <div className="relative">
          <UserCheck className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <select name="statut" value={form.statut} onChange={handleChange}
            className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
          >
            <option value="en_attente">En attente de validation</option>
            <option value="certifie">Certifié d'office</option>
            <option value="suspendu">Suspendu</option>
          </select>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-2">
        <button
          disabled={loading}
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold w-full py-2.5 px-4 rounded-lg shadow-sm shadow-indigo-600/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Création du profil praticien...</span>
            </>
          ) : (
            <span>Créer le profil praticien</span>
          )}
        </button>
      </div>

    </form>
  )
}

/* ================= COMPOSANT INPUT STYLISÉ ================= */
function Input({ icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-2.5 text-gray-400">
        {icon}
      </div>
      <input
        {...props}
        className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
      />
    </div>
  )
}

/* ================= COMPOSANT FILE INPUT DESIGNED ================= */
function FileInput({ label, name, file, onChange, icon, ...extraProps }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
        {icon} {label}
      </label>
      <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer transition-colors text-center ${
        file ? 'border-indigo-500 bg-indigo-50/10' : 'border-gray-200 hover:bg-gray-50'
      }`}>
        <FolderOpen size={16} className={file ? "text-indigo-600" : "text-gray-400"} />
        <span className="text-xs font-medium mt-1 text-gray-700 truncate max-w-xs">
          {file ? file.name : "Parcourir le fichier"}
        </span>
        <input 
          type="file" 
          name={name} 
          onChange={(e) => onChange(name, e.target.files[0])} 
          className="hidden" 
          {...extraProps}
        />
      </label>
    </div>
  )
}