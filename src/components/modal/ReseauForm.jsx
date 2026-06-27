import { useState } from "react"
import { supabase } from "../../services/supabase"
import { Upload, User, Mail, Lock, Phone, MapPin, FileText, CheckCircle2, AlertCircle } from "lucide-react"

// Liste des régions du Burkina Faso pour éviter les fautes de frappe dans la base de données
const REGIONS_BURKINA = [
  "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", 
  "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", 
  "Plateau-Central", "Sahel", "Sud-Ouest"
]

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
  const [status, setStatus] = useState({ type: "", text: "" }) // { type: 'success' | 'error', text: '' }

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
    setStatus({ type: "", text: "" })

    try {
      // 1️⃣ CREATE AUTH USER
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: "reseau" } }
      })

      if (authError) throw authError
      const userId = authData?.user?.id
      if (!userId) throw new Error("Impossible de créer l'utilisateur")

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
      setStatus({ type: "success", text: "Réseau et compte créés avec succès !" })
      
      setForm({ nom: "", responsable_nom: "", email: "", password: "", telephone: "", region: "", description: "" })
      setCnibFile(null)
      setPhotoFile(null)

      if (onSuccess) setTimeout(() => onSuccess(), 1500)

    } catch (err) {
      console.error("❌ ERROR:", err.message)
      setStatus({ type: "error", text: err.message })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
      
      <div>
        <h3 className="text-lg font-bold text-gray-800">Créer un Nouveau Réseau</h3>
        <p className="text-xs text-gray-500">Renseignez les informations pour configurer le compte du réseau partenaire.</p>
      </div>

      {/* Message Flash Alerte */}
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

      {/* GRILLE RESPONSIVE : 1 col sur mobile, 2 cols sur PC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Informations Structure */}
        <div className="space-y-3 sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Structure</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input required name="nom" value={form.nom} onChange={handleChange} placeholder="Nom du réseau"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
          </div>
        </div>

        {/* Responsable & Téléphone */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Nom du responsable</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required name="responsable_nom" value={form.responsable_nom} onChange={handleChange} placeholder="Prénom & Nom"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Téléphone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required name="telephone" value={form.telephone} onChange={handleChange} placeholder="+226 XX XX XX XX"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
          </div>
        </div>

        {/* Région (Select input pour la propreté des données) */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium text-gray-600">Région d'implantation</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <select required name="region" value={form.region} onChange={handleChange}
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none"
            >
              <option value="" disabled hidden>Sélectionner la région</option>
              {REGIONS_BURKINA.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Section Identifiants Compte */}
        <div className="sm:col-span-2 pt-2 border-t border-gray-100">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Identifiants de connexion</label>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Email professionnel</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="adresse@email.com"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Mot de passe d'accès</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium text-gray-600">Description / Observations</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Informations complémentaires sur le réseau..." rows={2}
            className="p-3 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
          />
        </div>

        {/* SECTION UPLOADS DESIGN COMPACT */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">CNIB (Recto/Verso)</label>
          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer transition-colors text-center ${cnibFile ? 'border-green-500 bg-green-50/20' : 'border-gray-200 hover:bg-gray-50'}`}>
            <Upload size={16} className={cnibFile ? "text-green-600" : "text-gray-400"} />
            <span className="text-xs font-medium mt-1 text-gray-700 truncate max-w-xs">
              {cnibFile ? cnibFile.name : "Téléverser le document"}
            </span>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setCnibFile(e.target.files[0])} className="hidden" />
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">Photo d'identité du responsable</label>
          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer transition-colors text-center ${photoFile ? 'border-green-500 bg-green-50/20' : 'border-gray-200 hover:bg-gray-50'}`}>
            <Upload size={16} className={photoFile ? "text-green-600" : "text-gray-400"} />
            <span className="text-xs font-medium mt-1 text-gray-700 truncate max-w-xs">
              {photoFile ? photoFile.name : "Téléverser l'image"}
            </span>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="hidden" />
          </label>
        </div>

      </div>

      {/* BOUTON D'ACTION */}
      <div className="pt-2">
        <button
          disabled={loading}
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-2.5 px-4 rounded-lg shadow-sm shadow-green-600/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Génération du compte...</span>
            </>
          ) : (
            <span>Créer le réseau + compte</span>
          )}
        </button>
      </div>

    </form>
  )
}