import { useState, useEffect } from "react"
import { supabase } from "../../services/supabase"
import { Printer, FileText, CheckSquare, Square, Search, Award, Download } from "lucide-react"
import html2pdf from "html2pdf.js"

// Importez votre logo depuis le dossier assets (ajustez le chemin selon l'emplacement exact)
import logoFNSFTHS from "../../assets/logo-trans.png"

export default function AttestationManager() {
  const [praticiens, setPraticiens] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Paramètres personnalisables
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
  const [exportingId, setExportingId] = useState(null)

  // Liste complète des villes / chefs-lieux du Burkina Faso
  const villesBurkina = [
    "Ouagadougou",
    "Bobo-Dioulasso",
    "Koudougou",
    "Ouahigouya",
    "Banfora",
    "Dédougou",
    "Kaya",
    "Fada N'Gourma",
    "Tenkodogo",
    "Koupéla",
    "Dori",
    "Gaoua",
    "Ziniaré",
    "Manga",
    "Houndé",
    "Pô",
    "Bousse",
    "Yako",
    "Kongoussi",
    "Djibo",
    "Gorom-Gorom",
    "Orodara",
    "Titao",
    "Tougan",
    "Nouna",
    "Boromo",
    "Zorgho",
    "Gourcy",
    "Bogandé",
    "Diapaga",
    "Pama",
    "Batié",
    "Diébougou",
    "Leo",
    "Solenzo"
  ]

  useEffect(() => {
    fetchPraticiens()
  }, [])

  useEffect(() => {
    switch (typeAttestation) {
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
  }, [typeAttestation])

  const fetchPraticiens = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("praticiens")
      .select("*")
      .order("nom", { ascending: true })
    
    if (data) setPraticiens(data)
    setLoading(false)
  }

  const filteredPraticiens = praticiens.filter(p => {
    const query = searchTerm.toLowerCase()
    return (
      `${p.nom || ""} ${p.prenom || ""}`.toLowerCase().includes(query) ||
      (p.numero_adherent || "").toLowerCase().includes(query) ||
      (p.region || "").toLowerCase().includes(query)
    )
  })

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPraticiens.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredPraticiens.map(p => p.id))
    }
  }

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = (elementId, praticienNom) => {
    const element = document.getElementById(elementId)
    if (!element) return

    setExportingId(elementId)

    const clone = element.cloneNode(true);
    clone.style.transform = 'none';
    clone.style.margin = '0';

    const options = {
      margin: 0,
      filename: `Attestation_${praticienNom.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        windowWidth: 1123 
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'landscape' 
      }
    }

    html2pdf().from(clone).set(options).save().then(() => {
      setExportingId(null)
    }).catch(() => {
      setExportingId(null)
    })
  }

  const selectedPraticiensList = praticiens.filter(p => selectedIds.includes(p.id))

  return (
    <div className="space-y-6">
      {/* 1. CONFIGURATION & SÉLECTION (Masqué à l'impression) */}
      <div className="print:hidden bg-white p-6 rounded-2xl border shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-green-600" /> Gestion des Attestations - Modèle Officiel <span className="text-red-600 font-extrabold">FNSFTHS-BF</span>
          </h2>
          <span className="text-xs bg-green-50 text-green-700 font-semibold px-3 py-1 rounded-full border border-green-200">
            {selectedIds.length} sélectionné(s)
          </span>
        </div>

        {/* Ligne 1 : Type de base & Intitulé exact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Modèle de base</label>
            <select
              value={typeAttestation}
              onChange={(e) => setTypeAttestation(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600"
            >
              <option value="reconnaissance">Attestation de Reconnaissance</option>
              <option value="participation">Attestation de Participation</option>
              <option value="honneur">Attestation d'Honneur</option>
              <option value="formation">Attestation de Fin de Formation</option>
              <option value="autre">Personnalisé (Libre)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Intitulé exact sur l'attestation</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600 font-bold text-green-800"
            />
          </div>
        </div>

        {/* Ligne 2 : Texte du témoignage / description modifiable */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">Texte du témoignage / Motif de l'attestation</label>
          <textarea
            rows={3}
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            className="w-full p-3 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600 leading-relaxed"
          />
        </div>

        {/* Ligne 3 : Date & Ville */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Date de délivrance</label>
            <input
              type="date"
              value={dateEvenement}
              onChange={(e) => setDateEvenement(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Lieu de délivrance</label>
            <select
              value={lieuDelivrance}
              onChange={(e) => setLieuDelivrance(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600"
            >
              {villesBurkina.map((ville) => (
                <option key={ville} value={ville}>{ville}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ligne 4 : Signataire */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Qualité / Rôle du signataire</label>
            <select
              value={roleSignataire}
              onChange={(e) => setRoleSignataire(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600"
            >
              <option value="Le Président de la Fédération">Le Président de la Fédération</option>
              <option value="Le Président du Comité d'Organisation (PCO)">Le Président du Comité d'Organisation (PCO)</option>
              <option value="Le Secrétaire Général">Le Secrétaire Général</option>
              <option value="Le Secrétaire Général Adjoint">Le Secrétaire Général Adjoint</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Nom et Prénoms du Signataire</label>
            <input
              type="text"
              value={nomSignataire}
              onChange={(e) => setNomSignataire(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Décoration / Titre (ex: Chevalier de l'Ordre)</label>
            <input
              type="text"
              value={titreSignataire}
              onChange={(e) => setTitresSignataire(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600"
            />
          </div>
        </div>

        {/* Sélection des participants */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <label className="text-xs font-semibold text-gray-600 uppercase">Cocher les participants concernés</label>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filtrer les participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border rounded-lg outline-none focus:border-green-600"
                />
              </div>
              <button
                onClick={handleSelectAll}
                className="text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
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
                    <div className="flex items-center gap-3">
                      <div className="text-green-600">
                        {isSelected ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-400" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{p.nom} {p.prenom}</p>
                        <p className="text-xs text-gray-500">N° : <span className="font-mono text-green-700">{p.numero_adherent}</span> | Région : {p.region}</p>
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
          <div className="print:hidden flex justify-end gap-3 pt-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900 shadow-md transition-all"
            >
              <Printer size={18} /> Imprimer en masse ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      {/* 2. APERÇU ET EXPORT */}
      {selectedPraticiensList.length > 0 ? (
        <div className="space-y-12 flex flex-col items-center">
          {selectedPraticiensList.map((p, index) => {
            const cardId = `attestation-card-${p.id}`
            return (
              <div key={p.id} className="w-full flex flex-col items-center space-y-3">
                {/* Bouton d'export PDF individuel */}
                <div className="print:hidden w-full max-w-[1100px] flex justify-end px-2">
                  <button
                    onClick={() => handleExportPDF(cardId, `${p.nom}_${p.prenom}`)}
                    disabled={exportingId === cardId}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 shadow transition-all disabled:opacity-50"
                  >
                    <Download size={14} /> {exportingId === cardId ? "Génération du PDF..." : "Télécharger en PDF"}
                  </button>
                </div>

                {/* Conteneur visuel adapté à l'écran */}
                <div className="w-full flex justify-center p-4 bg-slate-200/80 rounded-2xl border shadow-inner overflow-hidden">
                  <div className="relative" style={{ width: '297mm', height: '210mm', transform: 'scale(0.7)', transformOrigin: 'top center', marginBottom: '-60mm' }}>
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
                      {/* FILIGRANE DU LOGO (Arrière-plan centré et subtil) */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <img 
                          src={logoFNSFTHS} 
                          alt="Filigrane FNSFTHS" 
                          className="w-[450px] h-[450px] object-contain opacity-[0.08]" 
                        />
                      </div>

                      {/* Ligne intérieure fine décorative */}
                      <div className="absolute inset-4 border-2 border-green-800/30 pointer-events-none rounded-lg z-10" />
                      <div className="absolute inset-5 border border-amber-500/30 pointer-events-none rounded-lg z-10" />

                      {/* Ornements de coins de style certificat */}
                      <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-amber-600 pointer-events-none z-10" />
                      <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-amber-600 pointer-events-none z-10" />
                      <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-amber-600 pointer-events-none z-10" />
                      <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-amber-600 pointer-events-none z-10" />

                      {/* En-tête : Logo remonté à gauche, Édition au milieu, Bloc pays pro à droite */}
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

                      {/* Titre central et Institution avec le 'F' et 'Burkina Faso' en rouge */}
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

                        {/* Description dynamique et modifiable */}
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-3xl mx-auto px-6 font-light">
                          {customDescription}
                        </p>
                      </div>

                      {/* Bas de page : Date & Signataire avec espace généreux pour la signature et le cachet */}
                      <div className="relative z-20 px-6 pb-4 mt-auto">
                        <div className="border-t border-gray-200/60 pt-2 mt-1 flex justify-between items-end text-xs sm:text-sm">
                          <div>
                            <p className="font-medium text-gray-700">
                              Fait à <span className="font-semibold text-gray-900">{lieuDelivrance}</span>, le <span className="font-semibold text-gray-900">{new Date(dateEvenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </p>
                          </div>

                          {/* Bloc du Signataire avec espace dédié pour la signature/cachet */}
                          <div className="text-center px-4 py-3 bg-white/90 rounded-xl border border-amber-200/50 shadow-xs min-w-[280px]">
                            <p className="text-xs font-extrabold tracking-[0.1em] text-gray-800 uppercase">{roleSignataire}</p>
                            <div className="w-16 h-[1px] bg-amber-500/60 mx-auto my-1.5" />
                            
                            {/* Espace vide prévu pour la signature et le cachet */}
                            <div className="h-16" />

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
        <div className="print:hidden bg-white p-12 text-center rounded-2xl border border-dashed text-gray-400">
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