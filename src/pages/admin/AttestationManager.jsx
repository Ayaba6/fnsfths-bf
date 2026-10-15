import { useState, useEffect } from "react"
import { supabase } from "../../services/supabase"
import {
  Printer,
  FileText,
  CheckSquare,
  Square,
  Search,
  Award,
  Download,
  CheckCircle,
  Loader2,
  Plus,
  Edit,
  Trash2,
  List,
  ArrowLeft
} from "lucide-react"
import html2pdf from "html2pdf.js"

// Importez votre logo depuis le dossier assets
import logoFNSFTHS from "../../assets/logo-trans.png"

export default function AttestationManager() {
  const [praticiens, setPraticiens] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Mode de vue : "list" | "form"
  const [viewMode, setViewMode] = useState("list")

  // Liste des configurations chargées depuis Supabase
  const [attestationsList, setAttestationsList] = useState([])
  const [searchListTerm, setSearchListTerm] = useState("")

  // Paramètres de l'attestation en cours d'édition / création
  const [currentId, setCurrentId] = useState(null)
  const [typeAttestation, setTypeAttestation] = useState("reconnaissance")
  const [customTitle, setCustomTitle] = useState("ATTESTATION DE RECONNAISSANCE")
  const [customDescription, setCustomDescription] = useState("")

  // Paramètres du Signataire
  const [roleSignataire, setRoleSignataire] = useState("Le Président de la Fédération")
  const [nomSignataire, setNomSignataire] = useState("Camarade El hadj Moussa ZOUNGRANA")
  const [titreSignataire, setTitreSignataire] = useState("Chevalier de l'Ordre du Mérite")

  const [dateEvenement, setDateEvenement] = useState(new Date().toISOString().split("T")[0])
  const [lieuDelivrance, setLieuDelivrance] = useState("Ouagadougou")

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [exportingId, setExportingId] = useState(null)

  // Villes du Burkina Faso
  const villesBurkina = [
    "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora",
    "Dédougou", "Kaya", "Fada N'Gourma", "Tenkodogo", "Koupéla", "Dori",
    "Gaoua", "Ziniaré", "Manga", "Houndé", "Pô", "Bousse", "Yako",
    "Kongoussi", "Djibo", "Gorom-Gorom", "Orodara", "Titao", "Tougan",
    "Nouna", "Boromo", "Zorgho", "Gourcy", "Bogandé", "Diapaga", "Pama",
    "Batié", "Diébougou", "Leo", "Solenzo"
  ]

  useEffect(() => {
    fetchPraticiens()
    fetchAttestationsConfigs()
  }, [])

  // ---------------------------------------------------------------------------
  // 1. REQUÊTES SUPABASE (FETCH, SAVE, DELETE)
  // ---------------------------------------------------------------------------
  const fetchPraticiens = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("praticiens")
      .select("*")
      .order("nom", { ascending: true })

    if (data) setPraticiens(data)
    setLoading(false)
  }

  const fetchAttestationsConfigs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("attestations_config")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setAttestationsList(data || [])
    } catch (err) {
      console.error("Erreur chargement des attestations Supabase:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    const payload = {
      type_attestation: typeAttestation,
      custom_title: customTitle,
      custom_description: customDescription,
      date_evenement: dateEvenement,
      lieu_delivrance: lieuDelivrance,
      role_signataire: roleSignataire,
      nom_signataire: nomSignataire,
      titre_signataire: titreSignataire,
      updated_at: new Date().toISOString()
    }

    try {
      if (currentId) {
        const { error } = await supabase
          .from("attestations_config")
          .update(payload)
          .eq("id", currentId)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from("attestations_config")
          .insert([payload])
          .select()

        if (error) throw error
        if (data && data[0]) {
          setCurrentId(data[0].id)
        }
      }

      await fetchAttestationsConfigs()
      alert("Configuration d'attestation enregistrée avec succès !")
    } catch (err) {
      console.error("Erreur d'enregistrement:", err)
      alert("Erreur lors de la sauvegarde dans Supabase.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteConfig = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette configuration d'attestation ?")) return

    try {
      const { error } = await supabase
        .from("attestations_config")
        .delete()
        .eq("id", id)

      if (error) throw error
      setAttestationsList((prev) => prev.filter((item) => item.id !== id))
      if (currentId === id) setViewMode("list")
    } catch (err) {
      console.error("Erreur suppression:", err)
      alert("Erreur lors de la suppression.")
    }
  }

  // Modèles prédéfinis lors du changement de type
  const handleTypeChange = (newType) => {
    setTypeAttestation(newType)
    switch (newType) {
      case "reconnaissance":
        setCustomTitle("ATTESTATION DE RECONNAISSANCE")
        setCustomDescription("En témoignage de sa contribution remarquable et de son engagement aux actions de tradition durable, de modernisation, d'éthique, de préservation de la biodiversité et de qualité de conditionnement dans la pratique de la médecine traditionnelle.")
        break
      case "honneur":
        setCustomTitle("ATTESTATION D'HONNEUR")
        setCustomDescription("Reçoit cette attestation en témoignage de sa grande dévotion et de son travail exceptionnel pour la promotion de la pharmacopée traditionnelle au Burkina Faso.")
        break
      case "participation":
        setCustomTitle("ATTESTATION DE PARTICIPATION")
        setCustomDescription("A pris part activement aux travaux, conférences, ateliers et foires organisés par la Fédération pour la valorisation des savoirs endogènes.")
        break
      case "formation":
        setCustomTitle("ATTESTATION DE FIN DE FORMATION")
        setCustomDescription("A suivi avec succès le module de formation pratique dispensé dans le cadre des activités de renforcement des capacités des acteurs.")
        break
      default:
        break
    }
  }

  const handleCreateNew = () => {
    setCurrentId(null)
    setTypeAttestation("reconnaissance")
    setCustomTitle("ATTESTATION DE RECONNAISSANCE")
    setCustomDescription("En témoignage de sa contribution remarquable et de son engagement aux actions de tradition durable, de modernisation, d'éthique, de préservation de la biodiversité et de qualité de conditionnement dans la pratique de la médecine traditionnelle.")
    setDateEvenement(new Date().toISOString().split("T")[0])
    setLieuDelivrance("Ouagadougou")
    setRoleSignataire("Le Président de la Fédération")
    setNomSignataire("Camarade El hadj Moussa ZOUNGRANA")
    setTitreSignataire("Chevalier de l'Ordre du Mérite")
    setSelectedIds([])
    setViewMode("form")
  }

  const handleEditConfig = (config) => {
    setCurrentId(config.id)
    setTypeAttestation(config.type_attestation || "reconnaissance")
    setCustomTitle(config.custom_title || "")
    setCustomDescription(config.custom_description || "")
    setDateEvenement(config.date_evenement || new Date().toISOString().split("T")[0])
    setLieuDelivrance(config.lieu_delivrance || "Ouagadougou")
    setRoleSignataire(config.role_signataire || "Le Président de la Fédération")
    setNomSignataire(config.nom_signataire || "")
    setTitreSignataire(config.titre_signataire || "")
    setViewMode("form")
  }

  // ---------------------------------------------------------------------------
  // 2. IMPRESSION & EXPORT PDF
  // ---------------------------------------------------------------------------
  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = (elementId, praticienNom) => {
    const element = document.getElementById(elementId)
    if (!element) return

    setExportingId(elementId)

    const clone = element.cloneNode(true)
    clone.style.transform = "none"
    clone.style.margin = "0"

    const options = {
      margin: 0,
      filename: `Attestation_${praticienNom.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 1123 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" }
    }

    html2pdf()
      .from(clone)
      .set(options)
      .save()
      .then(() => setExportingId(null))
      .catch(() => setExportingId(null))
  }

  const filteredPraticiens = praticiens.filter((p) => {
    const query = searchTerm.toLowerCase()
    return (
      `${p.nom || ""} ${p.prenom || ""}`.toLowerCase().includes(query) ||
      (p.numero_adherent || "").toLowerCase().includes(query) ||
      (p.region || "").toLowerCase().includes(query)
    )
  })

  const filteredAttestationsList = attestationsList.filter((item) => {
    const q = searchListTerm.toLowerCase()
    return (
      item.custom_title?.toLowerCase().includes(q) ||
      item.custom_description?.toLowerCase().includes(q) ||
      item.nom_signataire?.toLowerCase().includes(q)
    )
  })

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPraticiens.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredPraticiens.map((p) => p.id))
    }
  }

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const selectedPraticiensList = praticiens.filter((p) => selectedIds.includes(p.id))

  // ---------------------------------------------------------------------------
  // 3. AFFICHAGE LISTE
  // ---------------------------------------------------------------------------
  if (viewMode === "list") {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 space-y-6 pb-12 font-sans">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <List className="text-green-600 shrink-0" />
              <span>Gestion des Attestations - <span className="text-red-600 font-extrabold">FNSFTHS-BF</span></span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {attestationsList.length} modèle(s) d'attestation enregistré(s)
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-green-700 shadow-md transition-all"
          >
            <Plus size={18} /> Créer une attestation
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par intitulé, description ou signataire..."
            value={searchListTerm}
            onChange={(e) => setSearchListTerm(e.target.value)}
            className="w-full text-sm outline-none bg-transparent"
          />
        </div>

        {loading ? (
          <div className="bg-white p-12 text-center rounded-2xl border shadow-sm flex flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 size={32} className="animate-spin text-green-600" />
            <p className="text-sm font-semibold">Chargement des attestations...</p>
          </div>
        ) : filteredAttestationsList.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border shadow-sm text-gray-500 space-y-3">
            <Award size={48} className="mx-auto text-gray-300" />
            <p className="font-semibold text-sm">Aucune attestation enregistrée.</p>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl shadow hover:bg-green-700"
            >
              Créer votre première attestation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAttestationsList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2 border-b pb-2">
                    <span className="font-mono text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 uppercase">
                      {item.type_attestation}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {new Date(item.date_evenement).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-green-800 line-clamp-2">{item.custom_title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-3 mt-1 font-light">{item.custom_description}</p>
                  </div>

                  <div className="pt-2 text-xs text-gray-500 border-t border-gray-100">
                    <p><span className="font-semibold text-gray-700">Signataire :</span> {item.nom_signataire}</p>
                    <p><span className="font-semibold text-gray-700">Lieu :</span> {item.lieu_delivrance}</p>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleEditConfig(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors"
                  >
                    <Edit size={14} /> Générer / Éditer
                  </button>
                  <button
                    onClick={() => handleDeleteConfig(item.id)}
                    title="Supprimer"
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // 4. AFFICHAGE FORMULAIRE & APERÇU
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 space-y-6">
      {/* Barre de Retour */}
      <div className="print:hidden bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between gap-3">
        <button
          onClick={() => setViewMode("list")}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-green-700 transition-colors"
        >
          <ArrowLeft size={18} /> Retour à la liste
        </button>
        <button
          onClick={handleSaveConfig}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-green-700 shadow transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
          <span>{saving ? "Enregistrement..." : "Enregistrer"}</span>
        </button>
      </div>

      {/* FORMULAIRE HARMONISÉ */}
      <div className="print:hidden bg-white p-4 sm:p-6 rounded-2xl border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-3">
          <h2 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2 flex-wrap">
            <Award className="text-green-600 shrink-0" />
            <span>{currentId ? "Édition de l'Attestation" : "Nouvelle Attestation"} - <span className="text-red-600 font-extrabold">FNSFTHS-BF</span></span>
          </h2>
          <span className="text-xs bg-green-50 text-green-700 font-semibold px-3 py-1 rounded-full border border-green-200">
            {selectedIds.length} sélectionné(s)
          </span>
        </div>

        {/* Ligne 1 : Modèle & Intitulé */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Modèle de base
            </label>
            <select
              value={typeAttestation}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-medium text-gray-800 transition-all"
            >
              <option value="reconnaissance">Attestation de Reconnaissance</option>
              <option value="participation">Attestation de Participation</option>
              <option value="honneur">Attestation d'Honneur</option>
              <option value="formation">Attestation de Fin de Formation</option>
              <option value="autre">Personnalisé (Libre)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Intitulé exact sur l'attestation
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-bold text-green-800 transition-all"
            />
          </div>
        </div>

        {/* Ligne 2 : Motif */}
        <div className="space-y-1.5 pt-4 border-t border-gray-100">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Texte du témoignage / Motif de l'attestation
          </label>
          <textarea
            rows={3}
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            className="w-full p-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white leading-relaxed font-sans text-gray-800 transition-all resize-none"
          />
        </div>

        {/* Ligne 3 : Date & Lieu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-gray-100 items-start">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Date de délivrance
            </label>
            <input
              type="date"
              value={dateEvenement}
              onChange={(e) => setDateEvenement(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-medium text-gray-800 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Lieu de délivrance
            </label>
            <select
              value={lieuDelivrance}
              onChange={(e) => setLieuDelivrance(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-medium text-gray-800 transition-all"
            >
              {villesBurkina.map((ville) => (
                <option key={ville} value={ville}>{ville}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ligne 4 : Signataire */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-gray-100 items-start">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Qualité / Rôle du signataire
            </label>
            <select
              value={roleSignataire}
              onChange={(e) => setRoleSignataire(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-medium text-gray-800 transition-all"
            >
              <option value="Le Président de la Fédération">Le Président de la Fédération</option>
              <option value="Le Président du Comité d'Organisation (PCO)">Le Président du Comité d'Organisation (PCO)</option>
              <option value="Le Secrétaire Général">Le Secrétaire Général</option>
              <option value="Le Secrétaire Général Adjoint">Le Secrétaire Général Adjoint</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Nom et Prénoms du Signataire
            </label>
            <input
              type="text"
              value={nomSignataire}
              onChange={(e) => setNomSignataire(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-bold text-gray-800 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Décoration / Titre
            </label>
            <input
              type="text"
              value={titreSignataire}
              onChange={(e) => setTitreSignataire(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-medium text-gray-800 transition-all"
            />
          </div>
        </div>

        {/* Sélection des participants */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Cocher les participants concernés
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filtrer les participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 text-xs bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600"
                />
              </div>
              <button
                onClick={handleSelectAll}
                className="text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-3.5 py-2.5 rounded-xl transition-colors whitespace-nowrap text-center border border-green-200"
              >
                {selectedIds.length === filteredPraticiens.length ? "Tout décocher" : "Tout cocher"}
              </button>
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto border rounded-xl divide-y bg-gray-50/50">
            {loading ? (
              <p className="p-4 text-center text-xs text-gray-500">Chargement...</p>
            ) : filteredPraticiens.length > 0 ? (
              filteredPraticiens.map((p) => {
                const isSelected = selectedIds.includes(p.id)
                return (
                  <div
                    key={p.id}
                    onClick={() => handleToggleSelect(p.id)}
                    className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? "bg-green-50/80" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="text-green-600 shrink-0">
                        {isSelected ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-400" />}
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-sm text-gray-800 truncate">{p.nom} {p.prenom}</p>
                        <p className="text-xs text-gray-500 truncate">
                          N° : <span className="font-mono text-green-700">{p.numero_adherent}</span> | Région : {p.region}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="p-4 text-center text-xs text-gray-500">Aucun participant trouvé.</p>
            )}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="print:hidden flex justify-end pt-4">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900 shadow-md transition-all"
            >
              <Printer size={18} /> Imprimer en masse ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      {/* APERÇU ET EXPORT */}
      {selectedPraticiensList.length > 0 ? (
        <div className="space-y-8 flex flex-col items-center w-full">
          {selectedPraticiensList.map((p) => {
            const cardId = `attestation-card-${p.id}`
            return (
              <div key={p.id} className="w-full flex flex-col items-center space-y-3">
                <div className="print:hidden w-full flex justify-end px-1">
                  <button
                    onClick={() => handleExportPDF(cardId, `${p.nom}_${p.prenom}`)}
                    disabled={exportingId === cardId}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 shadow transition-all disabled:opacity-50"
                  >
                    <Download size={14} /> {exportingId === cardId ? "Génération du PDF..." : "Télécharger en PDF"}
                  </button>
                </div>

                <div className="w-full overflow-x-auto p-2 sm:p-4 bg-slate-200/80 rounded-2xl border shadow-inner flex justify-center">
                  <div className="relative shrink-0" style={{ width: "297mm", height: "210mm", transform: "scale(0.32)", transformOrigin: "top center", marginBottom: "-138mm" }}>
                    <div
                      id={cardId}
                      className="bg-white p-8 pt-6 shadow-2xl relative overflow-hidden print-page-break flex flex-col justify-between"
                      style={{
                        width: "297mm",
                        height: "210mm",
                        boxSizing: "border-box",
                        pageBreakAfter: "always",
                        breakAfter: "page",
                        border: "14px solid transparent",
                        borderImage: "linear-gradient(135deg, #d97706 0%, #15803d 50%, #d97706 100%) 1"
                      }}
                    >
                      {/* FILIGRANE DU LOGO */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <img
                          src={logoFNSFTHS}
                          alt="Filigrane FNSFTHS"
                          className="w-[450px] h-[450px] object-contain opacity-[0.08]"
                        />
                      </div>

                      <div className="absolute inset-4 border-2 border-green-800/30 pointer-events-none rounded-lg z-10" />
                      <div className="absolute inset-5 border border-amber-500/30 pointer-events-none rounded-lg z-10" />

                      <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-amber-600 pointer-events-none z-10" />
                      <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-amber-600 pointer-events-none z-10" />
                      <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-amber-600 pointer-events-none z-10" />
                      <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-amber-600 pointer-events-none z-10" />

                      <div className="relative z-20 flex justify-between items-start px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={logoFNSFTHS}
                            alt="Logo FNSFTHS-BF"
                            className="w-24 h-24 object-contain drop-shadow-md -mt-2"
                          />
                        </div>

                        <div className="text-center pt-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300 shadow-xs">
                            <Award size={14} /> Édition Officielle <span className="text-red-600 font-extrabold">FNSFTHS-BF</span> 2026
                          </span>
                        </div>

                        <div className="text-center px-4 py-2 bg-white/90 rounded-xl border border-amber-200/50 shadow-xs">
                          <p className="text-xs font-extrabold tracking-[0.2em] text-red-600 uppercase">BURKINA FASO</p>
                          <div className="w-12 h-[1px] bg-amber-500/60 mx-auto my-1" />
                          <p className="text-[10px] text-gray-700 italic font-semibold tracking-wide">La Patrie ou la Mort, Nous Vaincrons</p>
                        </div>
                      </div>

                      <div className="text-center space-y-3 relative z-20 my-auto">
                        <p className="text-xs sm:text-sm font-extrabold text-green-900 tracking-wider uppercase">
                          <span className="text-red-600 font-extrabold">F</span>édération <span className="text-red-600 font-extrabold">N</span>ationale <span className="text-red-600 font-extrabold">S</span>ans <span className="text-red-600 font-extrabold">F</span>rontière des <span className="text-red-600 font-extrabold">T</span>radipraticiens et <span className="text-red-600 font-extrabold">H</span>erboristes de <span className="text-red-600 font-extrabold">S</span>anté du <span className="text-red-600 font-extrabold">B</span>urkina <span className="text-red-600 font-extrabold">F</span>aso <span className="text-red-600 font-extrabold">(FNSFTHS-BF)</span>
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-wide text-green-700 uppercase drop-shadow-sm py-1">
                          {customTitle}
                        </h1>
                        <div className="w-36 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-2" />

                        <p className="italic font-serif text-sm sm:text-base text-gray-700 pt-1">La présente attestation est fièrement décernée à :</p>

                        <div className="py-2">
                          <p className="text-3xl sm:text-4xl font-bold tracking-wide uppercase text-amber-700 font-serif drop-shadow-xs">
                            {p.nom} {p.prenom}
                          </p>
                          <p className="text-xs font-mono text-gray-600 mt-2 bg-gray-100/90 inline-block px-4 py-1.5 rounded-md border border-gray-200">
                            N° d'adhérent : <span className="font-bold text-green-800">{p.numero_adherent || "N/A"}</span> | Région : <span className="font-semibold text-gray-800">{p.region || "N/A"}</span>
                          </p>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-3xl mx-auto px-6 font-light">
                          {customDescription}
                        </p>
                      </div>

                      <div className="relative z-20 px-6 pb-2 mt-auto">
                        <div className="pt-2 mt-8 flex justify-between items-end text-xs sm:text-sm">
                          <div>
                            <p className="font-medium text-gray-700">
                              Fait à <span className="font-semibold text-gray-900">{lieuDelivrance}</span>, le <span className="font-semibold text-gray-900">{new Date(dateEvenement).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                            </p>
                          </div>

                          <div className="text-center px-4 py-1 min-w-[280px]">
                            <p className="text-xs font-extrabold tracking-[0.1em] text-gray-800 uppercase">{roleSignataire}</p>
                            <div className="w-16 h-[1px] bg-amber-500/60 mx-auto my-1.5" />
                            <div className="h-20" />
                            <p className="text-sm font-extrabold text-gray-900 tracking-wide font-serif pt-1">{nomSignataire}</p>
                            <p className="text-[11px] text-gray-700 italic font-semibold tracking-wide mt-1">{titreSignataire}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="print:hidden bg-white p-8 sm:p-12 text-center rounded-2xl border border-dashed text-gray-400">
          <FileText size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">Cochez un ou plusieurs participants dans la liste ci-dessus pour générer et exporter leurs attestations en PDF.</p>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          
          .print-page-break, .print-page-break * {
            visibility: visible !important;
          }

          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            margin: 0 !important;
            padding: 0 !important;
          }

          @page {
            size: 297mm 210mm landscape;
            margin: 0mm;
          }

          .print-page-break {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-width: 297mm !important;
            max-height: 210mm !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            break-after: page;
            page-break-after: always;
            margin: 0 !important;
            padding: 8mm !important;
            transform: none !important;
            box-shadow: none !important;
            background: white !important;
          }
        }
      `}</style>
    </div>
  )
}