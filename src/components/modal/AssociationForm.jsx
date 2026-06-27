import { useState, useEffect } from "react"
import { supabase } from "../../services/supabase"
import { Upload, User, Mail, Lock, Phone, MapPin, FileText, CheckCircle2, AlertCircle, Building, MapIcon } from "lucide-react"

// Liste des régions du Burkina Faso pour harmoniser les saisies
const REGIONS_BURKINA = [
  "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", 
  "Centre-Ouest", "Centre-Sud", "Est", "Hauts-Bassins", "Nord", 
  "Plateau-Central", "Sahel", "Sud-Ouest"
]

export default function AssociationForm({ onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: "", text: "" }) // { type: 'success' | 'error', text: '' }
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

  // ================= GET RESEAU =================
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
    setStatus({ type: "", text: "" })

    try {
      if (!reseau) {
        throw new Error("Réseau parent introuvable. Veuillez vous reconnecter.")
      }

      // 1️⃣ CREATE AUTH USER (association)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { role: "association" } }
      })

      if (authError) throw authError
      const userId = authData?.user?.id
      if (!userId) throw new Error("Erreur lors de la création de l'utilisateur")

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
            parent_id: reseau.id,
            type: "association",
            statut: "actif",
            user_id: userId,
            photo_url,
            cnib_url,
            created_at: new Date().toISOString()
          }
        ])

      if (insertError) throw insertError

      // 4️⃣ RESET & SUCCESS
      setStatus({ type: "success", text: "Association et compte rattaché créés avec succès !" })

      setForm({ nom: "", responsable_nom: "", email: "", password: "", telephone: "", region: "", ville: "", description: "" })
      setPhotoFile(null)
      setCnibFile(null)

      if (onSuccess) setTimeout(() => onSuccess(), 1500)

    } catch (err) {
      console.error(err)
      setStatus({ type: "error", text: err.message })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
      
      <div>
        <h3 className="text-lg font-bold text-gray-800">Créer une Nouvelle Association</h3>
        <p className="text-xs text-gray-500">Rattachez une association locale à votre réseau de gestion ({reseau?.nom || "Chargement..."}).</p>
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

      {/* Grille Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Structure */}
        <div className="space-y-1 sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Structure</label>
          <div className="relative">
            <Building className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input required name="nom" value={form.nom} onChange={handleChange} placeholder="Nom de l'association"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Responsable & Téléphone */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Nom du responsable</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required name="responsable_nom" value={form.responsable_nom} onChange={handleChange} placeholder="Prénom & Nom"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Téléphone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required name="telephone" value={form.telephone} onChange={handleChange} placeholder="+226 XX XX XX XX"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Région & Ville */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Région</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <select required name="region" value={form.region} onChange={handleChange}
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
            >
              <option value="" disabled hidden>Choisir la région</option>
              {REGIONS_BURKINA.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Ville / Localité</label>
          <div className="relative">
            <MapIcon className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required name="ville" value={form.ville} onChange={handleChange} placeholder="Ex: Bobo-Dioulasso"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Identifiants Compte */}
        <div className="sm:col-span-2 pt-2 border-t border-gray-100">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Accès Application</label>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Email de l'association</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="contact@asso.org"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Mot de passe temporaire</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input required type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••"
              className="pl-9 pr-3 py-2 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-medium text-gray-600">Présentation résumée</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Objectifs ou secteur d'activité spécifique..." rows={2}
            className="p-3 border border-gray-300 w-full rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        {/* Uploads compacts */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">Photo d'identité responsable</label>
          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer transition-colors text-center ${photoFile ? 'border-blue-500 bg-blue-50/20' : 'border-gray-200 hover:bg-gray-50'}`}>
            <Upload size={16} className={photoFile ? "text-blue-600" : "text-gray-400"} />
            <span className="text-xs font-medium mt-1 text-gray-700 truncate max-w-xs">
              {photoFile ? photoFile.name : "Téléverser la photo"}
            </span>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="hidden" />
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-600">CNIB du responsable (PDF/Image)</label>
          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-3 cursor-pointer transition-colors text-center ${cnibFile ? 'border-blue-500 bg-blue-50/20' : 'border-gray-200 hover:bg-gray-50'}`}>
            <Upload size={16} className={cnibFile ? "text-blue-600" : "text-gray-400"} />
            <span className="text-xs font-medium mt-1 text-gray-700 truncate max-w-xs">
              {cnibFile ? cnibFile.name : "Téléverser la CNIB"}
            </span>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setCnibFile(e.target.files[0])} className="hidden" />
          </label>
        </div>

      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          disabled={loading || !reseau}
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full py-2.5 px-4 rounded-lg shadow-sm shadow-blue-600/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Enregistrement en cours...</span>
            </>
          ) : (
            <span>Créer l'association + compte</span>
          )}
        </button>
      </div>

    </form>
  )
}