import { useState } from "react"
import { supabase } from "../../services/supabase"
import {
  User, Mail, Phone, MapPin, Stethoscope, Camera, 
  FileImage, FileText, Loader2, CheckCircle2, AlertCircle, 
  FolderOpen, UserCheck
} from "lucide-react"

const REGIONS_BF = [
  "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", 
  "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", 
  "Plateau-Central", "Sahel", "Sud-Ouest"
]

export default function PraticienForm({ onSuccess }) {
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "", 
    region: "", specialite: "", statut: "en_attente"
  })

  const [files, setFiles] = useState({ photo: null, cni_recto: null, cni_verso: null, diplome: null })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: "", text: "" })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleFileChange = (name, file) => setFiles({ ...files, [name]: file })

  const uploadFile = async (file, folder) => {
    if (!file) return null
    const { data, error } = await supabase.storage.from("documents-praticiens").upload(`${folder}/${Date.now()}-${file.name}`, file)
    if (error) throw error
    return supabase.storage.from("documents-praticiens").getPublicUrl(data.path).data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const [photo, cni_r, cni_v, diplome] = await Promise.all([
        uploadFile(files.photo, "photos"),
        uploadFile(files.cni_recto, "cni"),
        uploadFile(files.cni_verso, "cni"),
        uploadFile(files.diplome, "diplomes")
      ])

      const { error } = await supabase.from("praticiens").insert([{
        ...form,
        numero_adherent: "FNSTHS-" + Date.now().toString().slice(-8),
        photo, cni_recto: cni_r, cni_verso: cni_v, diplome
      }])

      if (error) throw error
      setStatus({ type: "success", text: "Enregistré avec succès !" })
      if (onSuccess) setTimeout(onSuccess, 1500)
    } catch (err) {
      setStatus({ type: "error", text: "Erreur lors de l'enregistrement." })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-gray-800">Nouveau Praticien</h3>
      </div>

      {status.text && (
        <div className={`p-3 rounded-lg flex items-center gap-2 text-xs font-medium border ${status.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} icon={<User size={14} />} />
        <Input label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} icon={<User size={14} />} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} icon={<Mail size={14} />} />
        <Input label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} icon={<Phone size={14} />} />
        <Input label="Spécialité" name="specialite" value={form.specialite} onChange={handleChange} icon={<Stethoscope size={14} />} />
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Région</label>
          <select required name="region" value={form.region} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm bg-white">
            <option value="">Choisir...</option>
            {REGIONS_BF.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t">
        <label className="text-[10px] font-bold text-gray-500 uppercase">Justificatifs</label>
        <div className="grid grid-cols-2 gap-2">
          <FileInput label="Photo" name="photo" onChange={handleFileChange} icon={<Camera size={14}/>} />
          <FileInput label="Diplôme" name="diplome" onChange={handleFileChange} icon={<FileText size={14}/>} />
          <FileInput label="CNI Recto" name="cni_recto" onChange={handleFileChange} icon={<FileImage size={14}/>} />
          <FileInput label="CNI Verso" name="cni_verso" onChange={handleFileChange} icon={<FileImage size={14}/>} />
        </div>
      </div>

      <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="animate-spin" size={16} /> : "Enregistrer le praticien"}
      </button>
    </form>
  )
}

function Input({ label, icon, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-500 uppercase">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>
        <input {...props} required className="pl-8 w-full p-2 border rounded-lg text-sm" />
      </div>
    </div>
  )
}

function FileInput({ label, name, onChange, icon }) {
  return (
    <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-2 cursor-pointer hover:bg-gray-50">
      <div className="text-gray-400">{icon}</div>
      <span className="text-[10px] font-medium text-gray-600 mt-1">{label}</span>
      <input type="file" onChange={(e) => onChange(name, e.target.files[0])} className="hidden" />
    </label>
  )
}