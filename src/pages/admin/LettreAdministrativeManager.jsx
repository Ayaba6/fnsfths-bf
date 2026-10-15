import { useState, useRef, useEffect } from "react"
import {
  Printer,
  Download,
  FileText,
  Send,
  Building,
  UserCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  List,
  Search,
  ArrowLeft,
  CheckCircle,
  Loader2
} from "lucide-react"
import html2pdf from "html2pdf.js"

// Importez votre client Supabase configuré
import { supabase } from "../../services/supabase" // Ajustez le chemin selon votre structure

// Importez votre logo officiel FNSFTHS
import logoFNSFTHS from "../../assets/logo-trans.png"

export default function LettreAdministrativeManager() {
  const documentRef = useRef(null)
  const containerRef = useRef(null)

  // États généraux
  const [viewMode, setViewMode] = useState("list") // "list" | "form"
  const [exporting, setExporting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [zoomScale, setZoomScale] = useState(1)

  // Données des lettres chargées depuis Supabase
  const [lettres, setLettres] = useState([])

  // Formulaire d'édition / création courant
  const [currentId, setCurrentId] = useState(null)
  const [reference, setReference] = useState("2026-001/FNSFTHS-BF/BE")
  const [lieuDelivrance, setLieuDelivrance] = useState("Ouagadougou")
  const [dateDelivrance, setDateDelivrance] = useState(new Date().toISOString().split("T")[0])
  const [titreDestinataire, setTitreDestinataire] = useState("")
  const [adresseDestinataire, setAdresseDestinataire] = useState("OUAGADOUGOU")
  const [modeleChoisi, setModeleChoisi] = useState("audience")
  const [objet, setObjet] = useState("")
  const [corpsLettre, setCorpsLettre] = useState("")
  const [fonctionSelect, setFonctionSelect] = useState("Le Président de la Fédération")
  const [roleSignataire, setRoleSignataire] = useState("LE PRÉSIDENT")
  const [nomSignataire, setNomSignataire] = useState("Camarade El hadj Moussa ZOUNGRANA")
  const [titreSignataire, setTitreSignataire] = useState("Chevalier de l'Ordre du Mérite")

  // Modèles prédéfinis
  const modelesObjets = [
    {
      id: "audience",
      label: "Demande d'audience et de soutien institutionnel",
      objet: "Demande d'audience et de soutien institutionnel pour les activités de la FNSFTHS-BF",
      corps: `Monsieur le Ministre,\n\nC'est avec un profond respect que nous venons, par la présente, solliciter auprès de votre haute bienveillance une audience de travail au nom du Bureau National de la Fédération Nationale Sans Frontière des Tradipraticiens et Herboristes de Santé du Burkina Faso (FNSFTHS-BF).\n\nDans le cadre de la modernisation de la pharmacopée traditionnelle et de la préservation de la biodiversité médicale dans notre pays, notre structure met en œuvre des actions prioritaires visant le renforcement des capacités et l'encadrement éthique des acteurs de la médecine traditionnelle.\n\nCette rencontre sera l'occasion d'échanger sur les perspectives d'accompagnement institutionnel et d'harmonisation de nos programmes d'action nationaux.\n\nEn espérant une suite favorable à notre demande, nous vous prions d'agréer, Monsieur le Ministre, l'expression de nos salutations très distinguées.`
    },
    {
      id: "invitation",
      label: "Invitation officielle à une cérémonie / événement",
      objet: "Invitation officielle à la cérémonie d'ouverture des journées nationales de la pharmacopée",
      corps: `Monsieur le Directeur,\n\nNous avons l'honneur de vous informer que la Fédération Nationale Sans Frontière des Tradipraticiens et Herboristes de Santé du Burkina Faso (FNSFTHS-BF) organise la Semaine de Foire Nationale des Tradipraticiens et Herboristes de Santé.\n\nCet événement d'envergure nationale se tiendra du 30 novembre au 05 décembre 2026 dans la commune de Nagréongo et réunira l'ensemble des acteurs, chercheurs et partenaires du secteur.\n\nÀ cet effet, nous serions très honorés de votre présence à la cérémonie d'ouverture officielle qui aura lieu le mardi 01 décembre 2026 à partir de 09 heures précises.\n\nComptant vivement sur votre précieuse présence, nous vous prions d'agréer, Monsieur le Directeur, l'assurance de notre considération distinguée.`
    },
    {
      id: "remerciements",
      label: "Lettre de remerciements pour participation",
      objet: "Lettre de remerciements pour votre participation à notre manifestation",
      corps: `Monsieur le Directeur,\n\nC’est avec un réel plaisir que je m’adresse à vous, au nom du Bureau Exécutif de la Fédération Nationale Sans Frontière des Tradipraticiens et Herboristes de Santé du Burkina Faso (FNSFTHS-BF) ainsi qu’au nom de l’ensemble du Comité d’Organisation.\n\nPar la présente, nous tenons à vous expressément exprimer nos plus sincères remerciements pour votre présence et votre contribution active lors de nos récentes activités.\n\nVotre engagement aux côtés de notre Fédération a grandement contribué au succès de cet événement et au renforcement de notre dynamique commune.\n\nTout en vous réitérant notre profonde gratitude, nous espérons pouvoir compter sur votre précieuse collaboration lors de nos prochaines initiatives.\n\nVeuillez agréer, Monsieur le Directeur, l'assurance de notre considération distinguée.`
    },
    {
      id: "libre",
      label: "Objet personnalisé (Saisie libre)",
      objet: "",
      corps: ""
    }
  ]

  const fonctionsSignataires = [
    "Le Président de la Fédération",
    "Le Secrétaire Général",
    "Le Secrétaire Général Adjoint",
    "Le Secrétaire à l'Organisation",
    "Le Trésorier Général",
    "Le Président du Comité d'Organisation (PCO)",
    "Le Chargé des Relations Extérieures",
    "Autre (Saisie libre)"
  ]

  const villesBurkina = [
    "Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Ouahigouya", "Banfora",
    "Dédougou", "Kaya", "Fada N'Gourma", "Tenkodogo", "Koupéla", "Ziniaré"
  ]

  // ---------------------------------------------------------------------------
  // 1. REQUÊTES SUPABASE (FETCH, SAVE, DELETE)
  // ---------------------------------------------------------------------------
  const fetchLettres = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("lettres_administratives")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setLettres(data || [])
    } catch (err) {
      console.error("Erreur chargement Supabase:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLettres()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      reference,
      lieu_delivrance: lieuDelivrance,
      date_delivrance: dateDelivrance,
      titre_destinataire: titreDestinataire,
      adresse_destinataire: adresseDestinataire,
      objet,
      corps_lettre: corpsLettre,
      fonction_signataire: fonctionSelect,
      role_signataire: roleSignataire,
      nom_signataire: nomSignataire,
      titre_signataire: titreSignataire,
      updated_at: new Date().toISOString()
    }

    try {
      if (currentId) {
        const { error } = await supabase
          .from("lettres_administratives")
          .update(payload)
          .eq("id", currentId)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from("lettres_administratives")
          .insert([payload])
          .select()

        if (error) throw error
        if (data && data[0]) {
          setCurrentId(data[0].id)
        }
      }

      await fetchLettres()
      alert("Lettre enregistrée avec succès dans Supabase !")
    } catch (err) {
      console.error("Erreur enregistrement Supabase:", err)
      alert("Erreur lors de l'enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette lettre ?")) return

    try {
      const { error } = await supabase
        .from("lettres_administratives")
        .delete()
        .eq("id", id)

      if (error) throw error
      setLettres((prev) => prev.filter((l) => l.id !== id))
      if (currentId === id) setViewMode("list")
    } catch (err) {
      console.error("Erreur suppression:", err)
      alert("Erreur lors de la suppression.")
    }
  }

  const handleCreateNew = () => {
    setCurrentId(null)
    const nextNum = lettres.length + 1
    const padNum = String(nextNum).padStart(3, "0")
    setReference(`2026-${padNum}/FNSFTHS-BF/BE`)
    setLieuDelivrance("Ouagadougou")
    setDateDelivrance(new Date().toISOString().split("T")[0])
    setTitreDestinataire("Tout Ministère assurant la tutelle technique d'un Établissement de formation professionnelle de l'État")
    setAdresseDestinataire("OUAGADOUGOU")
    setModeleChoisi("audience")
    setObjet(modelesObjets[0].objet)
    setCorpsLettre(modelesObjets[0].corps)
    setFonctionSelect("Le Président de la Fédération")
    setRoleSignataire("LE PRÉSIDENT")
    setNomSignataire("Camarade El hadj Moussa ZOUNGRANA")
    setTitreSignataire("Chevalier de l'Ordre du Mérite")
    setViewMode("form")
  }

  const handleEdit = (lettre) => {
    setCurrentId(lettre.id)
    setReference(lettre.reference)
    setLieuDelivrance(lettre.lieu_delivrance)
    setDateDelivrance(lettre.date_delivrance)
    setTitreDestinataire(lettre.titre_destinataire)
    setAdresseDestinataire(lettre.adresse_destinataire)
    setObjet(lettre.objet)
    setCorpsLettre(lettre.corps_lettre)
    setFonctionSelect(lettre.fonction_signataire || "Le Président de la Fédération")
    setRoleSignataire(lettre.role_signataire)
    setNomSignataire(lettre.nom_signataire)
    setTitreSignataire(lettre.titre_signataire)
    setViewMode("form")
  }

  // ---------------------------------------------------------------------------
  // 2. EXPORT & IMPRESSION
  // ---------------------------------------------------------------------------
  const handleExportPDF = () => {
    if (!documentRef.current) return
    setExporting(true)

    const element = documentRef.current
    const clone = element.cloneNode(true)
    clone.style.transform = "none"
    clone.style.margin = "0"

    const options = {
      margin: 0,
      filename: `Lettre_FNSFTHS_${reference.replace(/[/\\s]/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 794 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    }

    html2pdf()
      .from(clone)
      .set(options)
      .save()
      .then(() => setExporting(false))
      .catch(() => setExporting(false))
  }

  const handlePrint = () => {
    if (!documentRef.current) return
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const content = documentRef.current.outerHTML
    const tailwindCdn = `<script src="https://cdn.tailwindcss.com"></script>`

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Impression Lettre Administrative - FNSFTHS-BF</title>
          ${tailwindCdn}
          <style>
            @page { size: A4 portrait; margin: 0; }
            body { margin: 0; padding: 0; background: white; display: flex; justify-content: center; }
            #printable-letter { width: 210mm !important; height: 297mm !important; box-shadow: none !important; transform: none !important; }
          </style>
        </head>
        <body>
          ${content}
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const lettresFiltrees = lettres.filter(
    (l) =>
      l.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.objet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.titre_destinataire?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ---------------------------------------------------------------------------
  // 3. AFFICHAGE DE LA LISTE DES LETTRES
  // ---------------------------------------------------------------------------
  if (viewMode === "list") {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 space-y-6 pb-12 font-sans">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <List className="text-green-600 shrink-0" />
              <span>Lettres Administratives - <span className="text-red-600 font-extrabold">FNSFTHS-BF</span></span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {lettres.length} lettre(s) synchronisée(s) avec Supabase
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-green-700 shadow-md transition-all"
          >
            <Plus size={18} /> Rédiger une lettre
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par référence, destinataire ou objet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm outline-none bg-transparent"
          />
        </div>

        {loading ? (
          <div className="bg-white p-12 text-center rounded-2xl border shadow-sm flex flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 size={32} className="animate-spin text-green-600" />
            <p className="text-sm font-semibold">Chargement des lettres depuis Supabase...</p>
          </div>
        ) : lettresFiltrees.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border shadow-sm text-gray-500 space-y-3">
            <FileText size={48} className="mx-auto text-gray-300" />
            <p className="font-semibold text-sm">Aucune lettre enregistrée.</p>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl shadow hover:bg-green-700"
            >
              Rédiger votre première lettre
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {lettresFiltrees.map((lettre) => (
              <div
                key={lettre.id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2 border-b pb-2">
                    <span className="font-mono text-xs font-extrabold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                      N° {lettre.reference}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {new Date(lettre.date_delivrance).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Destinataire :</span>
                    <p className="text-xs font-bold text-gray-800 line-clamp-2 mt-0.5">{lettre.titre_destinataire}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Objet :</span>
                    <p className="text-xs font-semibold text-gray-600 line-clamp-3 mt-0.5">{lettre.objet}</p>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleEdit(lettre)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors"
                  >
                    <Edit size={14} /> Éditer / Voir
                  </button>
                  <button
                    onClick={() => handleDelete(lettre.id)}
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
  // 4. ÉDITION ET PRÉVISUALISATION
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6 pb-12 font-sans">
      
      {/* Barre de retour */}
      <div className="print:hidden bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between gap-3">
        <button
          onClick={() => setViewMode("list")}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-green-700 transition-colors"
        >
          <ArrowLeft size={18} /> Retour à la liste
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-green-700 shadow transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
          <span>{saving ? "Enregistrement..." : "Enregistrer dans Supabase"}</span>
        </button>
      </div>

      {/* Formulaire harmonisé */}
      <div className="print:hidden bg-white p-4 sm:p-6 rounded-2xl border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 gap-3">
          <h2 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-green-600 shrink-0" />
            <span>{currentId ? "Édition de la Lettre" : "Nouvelle Lettre Administrative"}</span>
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-900 shadow transition-all"
            >
              <Printer size={16} /> Imprimer
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-green-700 shadow transition-all disabled:opacity-50"
            >
              <Download size={16} /> {exporting ? "Génération..." : "Exporter PDF"}
            </button>
          </div>
        </div>

        {/* Ligne 1 : Méta-données */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Référence / N° d'ordre
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-mono font-bold text-gray-800 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Lieu de rédaction
            </label>
            <select
              value={lieuDelivrance}
              onChange={(e) => setLieuDelivrance(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-medium text-gray-800 transition-all"
            >
              {villesBurkina.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Date
            </label>
            <input
              type="date"
              value={dateDelivrance}
              onChange={(e) => setDateDelivrance(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-medium text-gray-800 transition-all"
            />
          </div>
        </div>

        {/* Ligne 2 : Bloc Destinataire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-gray-100 items-start">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building size={14} className="text-green-600 shrink-0" /> Titre / Qualité du Destinataire
            </label>
            <textarea
              rows={2}
              value={titreDestinataire}
              onChange={(e) => setTitreDestinataire(e.target.value)}
              placeholder="Ex: Tout Ministère assurant la tutelle..."
              className="w-full p-3 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-bold text-gray-800 transition-all resize-none leading-snug"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Adresse / Ville du Destinataire
            </label>
            <textarea
              rows={2}
              value={adresseDestinataire}
              onChange={(e) => setAdresseDestinataire(e.target.value)}
              placeholder="Ex: OUAGADOUGOU"
              className="w-full p-3 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-medium text-gray-800 transition-all resize-none leading-snug uppercase"
            />
          </div>
        </div>

        {/* Ligne 3 : Modèle & Objet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4 border-t border-gray-100 items-start">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Send size={14} className="text-green-600 shrink-0" /> Modèle pré-rempli
            </label>
            <select
              value={modeleChoisi}
              onChange={(e) => {
                const selectedId = e.target.value
                setModeleChoisi(selectedId)
                const m = modelesObjets.find((item) => item.id === selectedId)
                if (m && selectedId !== "libre") {
                  setObjet(m.objet)
                  setCorpsLettre(m.corps)
                }
              }}
              className="w-full h-11 px-3.5 text-sm bg-green-50/80 border border-green-300 text-green-900 font-bold rounded-xl outline-none focus:border-green-600 transition-all"
            >
              {modelesObjets.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Intitulé exact de l'Objet
            </label>
            <textarea
              rows={2}
              value={objet}
              onChange={(e) => setObjet(e.target.value)}
              placeholder="Objet de la lettre..."
              className="w-full p-3 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white font-bold text-gray-800 transition-all resize-none leading-snug"
            />
          </div>
        </div>

        {/* Ligne 4 : Corps de la lettre */}
        <div className="space-y-1.5 pt-4 border-t border-gray-100">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Corps de la lettre (Texte éditable)
          </label>
          <textarea
            rows={8}
            value={corpsLettre}
            onChange={(e) => setCorpsLettre(e.target.value)}
            className="w-full p-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 focus:bg-white leading-relaxed font-sans text-gray-800 transition-all"
          />
        </div>

        {/* Ligne 5 : Bloc Signataire */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-gray-100 items-start">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck size={14} className="text-green-600 shrink-0" /> Qualité du Signataire
            </label>
            <select
              value={fonctionSelect}
              onChange={(e) => {
                const val = e.target.value
                setFonctionSelect(val)
                if (val !== "Autre (Saisie libre)") setRoleSignataire(val.toUpperCase())
              }}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 font-medium text-gray-800 transition-all"
            >
              {fonctionsSignataires.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Nom & Prénoms
            </label>
            <input
              type="text"
              value={nomSignataire}
              onChange={(e) => setNomSignataire(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 font-bold text-gray-800 transition-all"
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
              className="w-full h-11 px-3.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl outline-none focus:border-green-600 font-medium text-gray-800 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Barre de Zoom */}
      <div className="print:hidden bg-white p-3 rounded-xl border shadow-sm flex items-center justify-between flex-wrap gap-3">
        <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
          <ZoomIn size={16} className="text-green-600" /> Zoom aperçu :
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomScale((prev) => Math.max(prev - 0.15, 0.4))}
            className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg border text-xs font-semibold"
          >
            <ZoomOut size={16} /> -
          </button>
          <select
            value={zoomScale}
            onChange={(e) => setZoomScale(parseFloat(e.target.value))}
            className="p-1.5 text-xs border rounded-lg bg-gray-50 font-bold text-gray-800 outline-none"
          >
            <option value={0.4}>40 %</option>
            <option value={0.55}>55 %</option>
            <option value={0.7}>70 %</option>
            <option value={0.85}>85 %</option>
            <option value={1}>100 % (Normal)</option>
          </select>
          <button
            onClick={() => setZoomScale((prev) => Math.min(prev + 0.15, 1.6))}
            className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg border text-xs font-semibold"
          >
            <ZoomIn size={16} /> +
          </button>
        </div>
      </div>

      {/* Aperçu Papier A4 Portrait */}
      <div
        ref={containerRef}
        className="w-full flex justify-center p-2 sm:p-6 bg-slate-200/80 rounded-2xl border shadow-inner overflow-x-auto overflow-y-auto max-h-[85vh] sm:max-h-[90vh]"
      >
        <div
          className="transition-transform duration-200 origin-top flex justify-center my-auto"
          style={{
            transform: `scale(${zoomScale})`,
            marginBottom: zoomScale < 1 ? `-${Math.round((1 - zoomScale) * 297)}mm` : "0px"
          }}
        >
          <div
            ref={documentRef}
            id="printable-letter"
            className="bg-white px-16 py-12 shadow-2xl relative overflow-hidden flex flex-col shrink-0"
            style={{
              width: "210mm",
              height: "297mm",
              boxSizing: "border-box"
            }}
          >
            {/* WATERMARK */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <img src={logoFNSFTHS} alt="Filigrane" className="w-[380px] h-[380px] object-contain opacity-[0.06]" />
            </div>

            {/* EN-TÊTE */}
            <div className="relative z-10 space-y-4">
              <div className="border-b-2 border-green-700 pb-3">
                <img src={logoFNSFTHS} alt="Logo FNSFTHS" className="w-24 h-24 object-contain" />
              </div>

              <div className="flex justify-between items-center text-xs font-serif pt-1">
                <div className="font-bold text-gray-900">
                  N° <span className="font-mono">{reference}</span>
                </div>
                <p className="font-medium text-gray-900">
                  {lieuDelivrance}, le <span className="font-bold">{new Date(dateDelivrance).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </p>
              </div>

              {/* DESTINATAIRE */}
              <div className="flex justify-end" style={{ marginTop: "45px", marginBottom: "25px" }}>
                <div className="text-center space-y-1 w-[320px] font-serif">
                  <p className="text-xs font-extrabold text-gray-900 uppercase">À</p>
                  <p className="text-xs font-extrabold text-gray-900 leading-snug">{titreDestinataire}</p>
                  <p className="text-xs font-extrabold text-gray-900 underline uppercase tracking-widest pt-1">
                    -{adresseDestinataire.replace(/^[-_ ]+|[-_ ]+$/g, "")}-
                  </p>
                </div>
              </div>

              {/* OBJET */}
              <div className="mb-4 font-serif text-xs sm:text-sm text-gray-900" style={{ marginTop: "20px" }}>
                <p className="font-bold leading-normal" style={{ textIndent: "-4.8em", paddingLeft: "4.8em" }}>
                  <span className="underline underline-offset-2">Objet</span> : {objet}
                </p>
              </div>
            </div>

            {/* CORPS DE LA LETTRE */}
            <div
              className="relative z-10 flex-1 my-2 py-1 text-xs sm:text-sm text-gray-900 leading-normal font-serif text-justify whitespace-pre-wrap"
              style={{ hyphens: "auto" }}
            >
              {corpsLettre}
            </div>

            {/* SIGNATURE */}
            <div className="relative z-10 pt-2 mt-auto flex justify-end">
              <div className="text-center min-w-[240px] space-y-0.5">
                <p className="text-xs font-extrabold tracking-wider text-gray-900 uppercase">{roleSignataire}</p>
                <div className="w-10 h-[1px] bg-amber-500/80 mx-auto my-1" />
                <div className="h-16" />
                <p className="text-sm font-extrabold text-gray-900 font-serif">{nomSignataire}</p>
                <p className="text-[11px] text-gray-600 italic font-semibold">{titreSignataire}</p>
              </div>
            </div>

            {/* PIED DE PAGE */}
            <div className="relative z-10 border-t border-gray-200 pt-3 mt-4 text-center text-[9px] text-gray-500 space-y-0.5">
              <p className="font-bold text-green-800 uppercase">Fédération Nationale Sans Frontière des Tradipraticiens et Herboristes de Santé du Burkina Faso</p>
              <p>Siège Social : Ouagadougou | Tél : (+226) 76 17 52 24 / 70 27 83 03 | E-mail : contact@fnsfths.org</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}