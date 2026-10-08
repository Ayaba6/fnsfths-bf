import { useState, useEffect } from "react"
import { supabase } from "../../services/supabase"
import { Printer, FileText, CheckSquare, Square, Search, Award } from "lucide-react"

export default function AttestationManager() {
  const [praticiens, setPraticiens] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  
  // Paramètres personnalisables basés sur le modèle officiel
  const [typeAttestation, setTypeAttestation] = useState("reconnaissance") 
  const [nomPresident, setNomPresident] = useState("Camarade El hadj Moussa ZOUNGRANA")
  const [titrePresident, setTitrePresident] = useState("Chevalier de l'Ordre du Mérite")
  const [dateEvenement, setDateEvenement] = useState(new Date().toISOString().split("T")[0])
  const [lieuDelivrance, setLieuDelivrance] = useState("Ouagadougou")
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPraticiens()
  }, [])

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

  const selectedPraticiensList = praticiens.filter(p => selectedIds.includes(p.id))

  const getTitleByType = () => {
    switch (typeAttestation) {
      case "reconnaissance": return "ATTESTATION DE RECONNAISSANCE"
      case "honneur": return "ATTESTATION D'HONNEUR"
      default: return "ATTESTATION DE PARTICIPATION"
    }
  }

  const getDescriptionByType = () => {
    switch (typeAttestation) {
      case "reconnaissance":
        return `En témoignage de sa contribution remarquable et de son engagement aux actions (Tradition Durable et Modernisation : Allié Ethique, Préservation de la biodiversité et qualité de conditionnement dans la pratique de la médecine traditionnelle)[cite: 3].`
      case "honneur":
        return `Reçoit cette attestation en témoignage de sa grande dévotion et de son travail exceptionnel pour la promotion de la pharmacopée traditionnelle.`
      default:
        return `A pris part activement aux travaux, conférences et foires organisés par la Fédération pour la valorisation des savoirs endogènes.`
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. CONFIGURATION & SÉLECTION (Masqué à l'impression) */}
      <div className="print:hidden bg-white p-6 rounded-2xl border shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-green-600" /> Gestion des Attestations - Modèle Officiel FNSTHS
          </h2>
          <span className="text-xs bg-green-50 text-green-700 font-semibold px-3 py-1 rounded-full border border-green-200">
            {selectedIds.length} sélectionné(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Type d'attestation</label>
            <select
              value={typeAttestation}
              onChange={(e) => setTypeAttestation(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600"
            >
              <option value="reconnaissance">Attestation de Reconnaissance</option>
              <option value="participation">Attestation de Participation</option>
              <option value="honneur">Attestation d'Honneur</option>
            </select>
          </div>

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
            <label className="text-xs font-semibold text-gray-600 uppercase">Lieu</label>
            <input
              type="text"
              value={lieuDelivrance}
              onChange={(e) => setLieuDelivrance(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Nom du Président (Bas de page)</label>
            <input
              type="text"
              value={nomPresident}
              onChange={(e) => setNomPresident(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600"
              placeholder="Ex: Camarade El hadj Moussa ZOUNGRANA..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase">Titre/Ordre (Sous le président)</label>
            <input
              type="text"
              value={titrePresident}
              onChange={(e) => setTitrePresident(e.target.value)}
              className="w-full p-2.5 text-sm bg-gray-50 border rounded-xl outline-none focus:border-green-600"
              placeholder="Ex: Chevalier de l'Ordre du Mérite..."
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
          <div className="flex justify-end pt-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all"
            >
              <Printer size={18} /> Imprimer les {selectedIds.length} attestation(s) en masse
            </button>
          </div>
        )}
      </div>

      {/* 2. APERÇU ET IMPRESSION DU MODÈLE OFFICIEL AVEC DÉCORATION */}
      {selectedPraticiensList.length > 0 ? (
        <div className="space-y-8">
          {selectedPraticiensList.map((p, index) => (
            <div
              key={p.id}
              className={`bg-white p-10 md:p-14 shadow-2xl max-w-4xl mx-auto print:shadow-none print:p-10 relative overflow-hidden print-page-break ${
                index > 0 ? "print:mt-0" : ""
              }`}
              style={{ 
                pageBreakAfter: "always", 
                minHeight: "680px",
                // Cadre extérieur décoratif avec dégradé Or / Jaune / Vert similaire au modèle
                border: "10px solid transparent",
                borderImage: "linear-gradient(135deg, #f59e0b 0%, #16a34a 100%) 1"
              }}
            >
              {/* Ligne intérieure fine décorative */}
              <div className="absolute inset-4 border border-green-700/60 pointer-events-none rounded-sm" />

              {/* Éléments géométriques de décoration aux coins supérieurs/inférieurs */}
              <div className="absolute top-0 right-0 w-48 h-12 bg-gradient-to-l from-amber-400 to-transparent opacity-80 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-8 bg-gradient-to-l from-green-700 to-amber-400 opacity-90 pointer-events-none" />

              {/* Haut : Logo seul (depuis assets) */}
              <div className="mb-4 relative z-10">
                <img 
                  src="/logo192.png" 
                  alt="Logo FNSTHS" 
                  className="w-20 h-20 object-contain" 
                />
              </div>

              {/* Titre de l'attestation */}
              <div className="text-center space-y-1.5 mb-6 relative z-10">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-green-700 uppercase drop-shadow-xs">
                  {getTitleByType()}
                </h1>
                <p className="text-xs font-bold text-gray-800 tracking-wider">
                  La Fédération Nationale Sans Frontière des Tradipraticiens et Herboristes de Santé du Burkina Faso
                </p>
              </div>

              {/* Corps central */}
              <div className="text-center space-y-4 my-6 relative z-10 px-4">
                <p className="italic font-serif text-sm text-gray-800">Décerne la présente au :</p>
                
                <div className="py-2">
                  <p className="text-2xl md:text-3xl font-bold tracking-wide uppercase text-amber-600 font-serif">
                    {p.nom} {p.prenom}
                  </p>
                  <p className="text-xs font-mono text-gray-500 mt-1">
                    N° d'adhérent : {p.numero_adherent || "N/A"} | Région : {p.region || "N/A"}
                  </p>
                </div>

                <p className="text-xs md:text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  {getDescriptionByType()}
                </p>
              </div>

              {/* Bas de page : Date à gauche et Président / Titre à droite */}
              <div className="flex justify-between items-end mt-12 relative z-10 px-4 text-xs">
                <div>
                  <p className="font-medium text-gray-800">
                    Fait à {lieuDelivrance}, le {new Date(dateEvenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Bloc du Président professionnel aligné à droite */}
                <div className="text-right space-y-1 min-w-[220px]">
                  <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Le Président</p>
                  <div className="pt-4">
                    <p className="text-xs font-extrabold text-gray-900 tracking-wide">{nomPresident}</p>
                    <p className="text-[10px] italic font-medium text-gray-600 mt-0.5">{titrePresident}</p>
                  </div>
                </div>
              </div>

              {/* Décoration feuillage stylisé en bas à gauche */}
              <div className="absolute bottom-4 left-6 flex gap-1.5 opacity-90 pointer-events-none">
                <div className="w-5 h-2.5 bg-green-600 rounded-full rotate-45" />
                <div className="w-6 h-3 bg-green-500 rounded-full -rotate-12 shadow-sm" />
                <div className="w-5 h-2.5 bg-green-700 rounded-full rotate-12" />
                <div className="w-3 h-1.5 bg-emerald-400 rounded-full rotate-45 self-end" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="print:hidden bg-white p-12 text-center rounded-2xl border border-dashed text-gray-400">
          <FileText size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">Cochez un ou plusieurs participants dans la liste ci-dessus pour générer leurs attestations conformes au modèle officiel.</p>
        </div>
      )}

      <style>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-page-break {
            break-after: page;
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  )
}