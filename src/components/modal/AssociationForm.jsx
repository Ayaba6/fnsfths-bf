import { useState, useEffect } from "react"
import { supabase } from "../../services/supabase"
import { Upload, User, Mail, Lock, Phone, MapPin, CheckCircle2, AlertCircle, Building, MapIcon } from "lucide-react"

const REGIONS_BURKINA = [
  "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", 
  "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", 
  "Plateau-Central", "Sahel", "Sud-Ouest"
]

export default function AssociationForm({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: "", text: "" })
  const [reseau, setReseau] = useState(null)

  const [form, setForm] = useState({
    nom: "", responsable_nom: "", email: "", password: "", 
    telephone: "", region: "", ville: "", description: ""
  })

  const [photoFile, setPhotoFile] = useState(null)
  const [cnibFile, setCnibFile] = useState(null)

  useEffect(() => {
    const getReseau = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const uploadFile = async (file, folder) => {
    if (!file) return null
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from("documents-asso").upload(`${folder}/${fileName}`, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from("documents-asso").getPublicUrl(data.path)
    return urlData.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: "", text: "" })

    try {
      if (!reseau) throw new Error("Réseau parent introuvable.")

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: "association" } }
      })

      if (authError) throw authError
      
      const photo_url = await uploadFile(photoFile, "photos")
      const cnib_url = await uploadFile(cnibFile, "cnib")

      const { error: insertError } = await supabase.from("organisations").insert([{
        ...form,
        parent_id: reseau.id,
        type: "association",
        statut: "actif",
        user_id: authData?.user?.id,
        photo_url,
        cnib_url
      }])

      if (insertError) throw insertError

      setStatus({ type: "success", text: "Association créée avec succès !" })
      if (onSuccess) setTimeout(onSuccess, 1500)

    } catch (err) {
      setStatus({ type: "error", text: err.message })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header compact */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">Nouvelle Association</h3>
        <p className="text-xs text-gray-500">Rattachement au réseau : {reseau?.nom || "..."}</p>
      </div>

      {status.text && (
        <div className={`p-3 rounded-lg flex items-center gap-2 text-xs font-medium border ${status.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {status.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Nom de l'association</label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required name="nom" value={form.nom} onChange={handleChange} className="pl-9 w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Responsable</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required name="responsable_nom" value={form.responsable_nom} onChange={handleChange} className="pl-9 w-full p-2 border rounded-lg text-sm" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Téléphone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required name="telephone" value={form.telephone} onChange={handleChange} className="pl-9 w-full p-2 border rounded-lg text-sm" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Région</label>
          <select required name="region" value={form.region} onChange={handleChange} className="w-full p-2 border rounded-lg text-sm bg-white">
            <option value="">Choisir...</option>
            {REGIONS_BURKINA.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Ville</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required name="ville" value={form.ville} onChange={handleChange} className="pl-9 w-full p-2 border rounded-lg text-sm" />
          </div>
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Email & Mot de passe</label>
          <div className="grid grid-cols-2 gap-4">
            <input required type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="p-2 border rounded-lg text-sm" />
            <input required type="password" name="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} className="p-2 border rounded-lg text-sm" />
          </div>
        </div>

        <div className="sm:col-span-2 space-y-1">
           <label className="text-[10px] font-bold text-gray-500 uppercase">Documents</label>
           <div className="grid grid-cols-2 gap-4">
              <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="text-xs p-2 border rounded-lg" />
              <input type="file" accept="image/*,application/pdf" onChange={(e) => setCnibFile(e.target.files[0])} className="text-xs p-2 border rounded-lg" />
           </div>
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Valider l'inscription"}
      </button>
    </form>
  )
}