import { useState } from "react"
import { supabase } from "../../services/supabase"
import { Phone, MapPin, Camera, FileImage, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

const REGIONS_BF = ["Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", "Plateau-Central", "Sahel", "Sud-Ouest"]
const LISTE_SPECIALITES = ["Médecine traditionnelle", "Pharmacopée", "Ostéopathie traditionnelle", "Soins spirituels", "Accouchement traditionnel", "Consultation"]

export default function PraticienForm({ onSuccess }) {
  const [form, setForm] = useState({ 
    nom: "", prenom: "", date_naissance: "", telephone: "", 
    secteur: "", profession: "Tradipraticien", specialite: [],
    contact_urgence: "", contact_urgence_tel: "", region: "", 
    statut: "en_attente" 
  })
  const [files, setFiles] = useState({ photo: null, cni_recto: null, cni_verso: null })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: "", text: "" })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleFileChange = (name, file) => setFiles({ ...files, [name]: file })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const uploadFile = async (file, folder) => {
        if (!file) return null
        const filePath = `${folder}/${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage.from("documents-praticiens").upload(filePath, file)
        if (error) throw error
        return supabase.storage.from("documents-praticiens").getPublicUrl(data.path).data.publicUrl
      }

      const [photo, cni_r, cni_v] = await Promise.all([
        uploadFile(files.photo, "photos"),
        uploadFile(files.cni_recto, "cni"),
        uploadFile(files.cni_verso, "cni")
      ])

      const { error } = await supabase.from("praticiens").insert([{
        ...form,
        specialite: form.specialite.join(", "),
        numero_adherent: "FNSTHS-" + Math.floor(Math.random() * 100000000),
        photo, cni_recto: cni_r, cni_verso: cni_v
      }])

      if (error) throw error
      setStatus({ type: "success", text: "Inscription validée !" })
      if (onSuccess) setTimeout(onSuccess, 1500)
    } catch (err) {
      console.error(err)
      setStatus({ type: "error", text: "Erreur lors de l'enregistrement." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Nouvelle Carte de Membre</h3>
      
      {status.text && (
        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium border ${status.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} />
        <Input label="Prénom(s)" name="prenom" value={form.prenom} onChange={handleChange} />
        <Input label="Date de naissance" name="date_naissance" type="date" value={form.date_naissance} onChange={handleChange} />
        <Input label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} icon={<Phone size={14} />} />
        <Input label="Secteur" name="secteur" value={form.secteur} onChange={handleChange} icon={<MapPin size={14} />} />
        
        <SpecialiteSelect 
          selected={form.specialite} 
          onChange={(val) => setForm({ ...form, specialite: val })} 
        />
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Région</label>
          <select required name="region" value={form.region} onChange={handleChange} className="w-full p-2.5 border rounded-lg text-sm bg-white">
            <option value="">Choisir la région...</option>
            {REGIONS_BF.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase">Personne à prévenir</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Nom" name="contact_urgence" value={form.contact_urgence} onChange={handleChange} />
          <Input label="Téléphone" name="contact_urgence_tel" value={form.contact_urgence_tel} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <FileInput label="Photo" name="photo" isUploaded={!!files.photo} onChange={handleFileChange} icon={<Camera size={16}/>} />
        <FileInput label="CNI Recto" name="cni_recto" isUploaded={!!files.cni_recto} onChange={handleFileChange} icon={<FileImage size={16}/>} />
        <FileInput label="CNI Verso" name="cni_verso" isUploaded={!!files.cni_verso} onChange={handleFileChange} icon={<FileImage size={16}/>} />
      </div>

      <button disabled={loading} type="submit" className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition-colors">
        {loading ? <Loader2 className="animate-spin mx-auto" /> : "Générer la demande de carte"}
      </button>
    </form>
  )
}

function SpecialiteSelect({ selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative space-y-1">
      <label className="text-[10px] font-bold text-gray-500 uppercase">Spécialités</label>
      <div onClick={() => setIsOpen(!isOpen)} className="w-full p-2.5 border rounded-lg text-sm bg-white cursor-pointer flex justify-between items-center">
        <span className="truncate">{selected.length > 0 ? selected.join(", ") : "Choisir..."}</span>
        <span>▼</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-2 max-h-40 overflow-y-auto">
          {LISTE_SPECIALITES.map(opt => (
            <label key={opt} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer text-sm">
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => {
                const next = selected.includes(opt) ? selected.filter(i => i !== opt) : [...selected, opt]
                onChange(next)
              }} className="rounded text-green-600" />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function Input({ label, icon, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-500 uppercase">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-gray-400">{icon}</div>}
        <input {...props} required className={`${icon ? 'pl-9' : 'pl-3'} w-full p-2.5 border rounded-lg text-sm`} />
      </div>
    </div>
  )
}

function FileInput({ label, name, onChange, icon, isUploaded }) {
  return (
    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer transition-colors ${isUploaded ? "border-green-500 bg-green-50" : "border-gray-300 hover:bg-gray-50"}`}>
      <div className={`${isUploaded ? "text-green-600" : "text-gray-400"} mb-1`}>
        {isUploaded ? <CheckCircle2 size={20} /> : icon}
      </div>
      <span className={`text-[9px] font-bold uppercase text-center ${isUploaded ? "text-green-700" : "text-gray-500"}`}>
        {isUploaded ? "Chargé" : label}
      </span>
      <input type="file" onChange={(e) => onChange(name, e.target.files[0])} className="hidden" />
    </label>
  )
}