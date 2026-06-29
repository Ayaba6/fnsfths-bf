import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../../services/supabase"
import { useReactToPrint } from "react-to-print"
import { ArrowLeft, Printer, ShieldCheck, Loader2 } from "lucide-react"
import CarteFNSTHS from "../../components/ui/CarteFNSTHS"

export default function CartePDF() {
  const { id } = useParams()
  const [praticien, setPraticiens] = useState(null)
  const [loading, setLoading] = useState(true)

  const componentRefRecto = useRef(null)
  const componentRefVerso = useRef(null)

  // =================================================================
  // COHÉRENCE DU CYCLE DE VIE DES HOOKS (DÉPOSITION AVANT LE RETURN)
  // =================================================================
  const handlePrintRecto = useReactToPrint({
    contentRef: componentRefRecto,
    documentTitle: `Carte_FNSTHS_Recto_${praticien?.nom || "Document"}_${praticien?.prenom || ""}`,
  })

  const handlePrintVerso = useReactToPrint({
    contentRef: componentRefVerso,
    documentTitle: `Carte_FNSTHS_Verso_${praticien?.nom || "Document"}_${praticien?.prenom || ""}`,
  })

  useEffect(() => {
    const fetchPraticien = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("praticiens")
        .select("*")
        .eq("id", id)
        .single()

      if (!error && data) {
        setPraticiens(data)
      }
      setLoading(false)
    }

    if (id) fetchPraticien()
  }, [id])

  // =================================================================
  // CLAUSE DE SÉCURITÉ EN PÉRIODE DE CHARGEMENT
  // =================================================================
  if (loading || !praticien) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50 p-4">
        <Loader2 className="animate-spin text-green-600 w-9 h-9" />
        <p className="text-sm text-gray-500 font-medium text-center">Récupération des données d'adhésion...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      
      {/* BARRE DE RETOUR & ACTIONS RESPONSIVE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/praticiens/cartes" 
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-900 transition-colors shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-900 truncate">
              Espace d'Impression Officiel
            </h1>
            <p className="text-xs text-gray-400 truncate">
              Titulaire : <span className="font-semibold text-gray-700">{praticien.nom} {praticien.prenom}</span>
            </p>
          </div>
        </div>

        {/* Badge de statut sécurisé */}
        <div className="flex items-center gap-2 sm:self-auto self-start pl-11 sm:pl-0">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
            praticien.statut === 'actif'
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <ShieldCheck size={12} />
            Statut : {praticien.statut || "En attente"}
          </span>
        </div>
      </div>

      {/* ZONE DE VUE DES CARTES & BOUTONS RESPONSIVE */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* BLOC RECTO */}
        <div className="flex flex-col items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="w-full flex sm:flex-row flex-col justify-between sm:items-center items-start gap-2 border-b border-gray-100 pb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Face Avant (Recto)</h2>
            <button
              onClick={() => handlePrintRecto()}
              className="flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors shadow-2xs w-full sm:w-auto"
            >
              <Printer size={13} />
              Imprimer le Recto
            </button>
          </div>
          
          {/* CORRECTION DU SCROLL : Nettoyage esthétique de la barre de défilement + padding vertical */}
          <div className="w-full overflow-x-auto py-3 px-1 flex justify-start sm:justify-center xl:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 shadow-inner shrink-0">
              <CarteFNSTHS praticien={praticien} cardRef={componentRefRecto} view="recto" />
            </div>
          </div>
        </div>

        {/* BLOC VERSO */}
        <div className="flex flex-col items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="w-full flex sm:flex-row flex-col justify-between sm:items-center items-start gap-2 border-b border-gray-100 pb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Face Arrière (Verso)</h2>
            <button
              onClick={() => handlePrintVerso()}
              className="flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors shadow-2xs w-full sm:w-auto"
            >
              <Printer size={13} />
              Imprimer le Verso
            </button>
          </div>
          
          {/* CORRECTION DU SCROLL : Nettoyage esthétique de la barre de défilement + padding vertical */}
          <div className="w-full overflow-x-auto py-3 px-1 flex justify-start sm:justify-center xl:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 shadow-inner shrink-0">
              <CarteFNSTHS praticien={praticien} cardRef={componentRefVerso} view="verso" />
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}