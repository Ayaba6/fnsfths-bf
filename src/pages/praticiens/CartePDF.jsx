import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"
import CarteFNSTHS from "../../components/ui/CarteFNSTHS"
import { IdCard, Download, ArrowLeft, Loader2, AlertCircle } from "lucide-react"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function CartePDF() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [praticien, setPraticien] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const cardRef = useRef(null)

  // ================= FETCH PRATICIEN =================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("praticiens")
          .select("*")
          .eq("id", id)
          .single()

        if (error) throw error
        setPraticien(data)
      } catch (error) {
        console.error("❌ ERROR FETCH PRATICIEN:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // ================= EXPORT PDF =================
  const downloadPDF = async () => {
    if (!cardRef.current || !praticien) return
    setExporting(true)

    try {
      // Configuration optimale pour éviter les artefacts d'images distantes (CORS)
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Qualité supérieure pour l'impression
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff"
      })

      const imgData = canvas.toDataURL("image/png")
      
      // Initialisation du document PDF au format paysage A4
      const pdf = new jsPDF("landscape", "mm", "a4")
      const pdfWidth = 297
      const pdfHeight = 210

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`CARTE-FNSTHS-${praticien.numero_adherent}.pdf`)
    } catch (err) {
      console.error("❌ PDF GENERATION ERROR:", err)
    } finally {
      setExporting(false)
    }
  }

  // ================= LOADING SKELETON =================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
        <p className="text-sm font-medium text-gray-500">Génération de la carte officielle...</p>
      </div>
    )
  }

  // ================= ERROR STATE =================
  if (!praticien) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm max-w-md text-center space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Praticien introuvable</h3>
            <p className="text-sm text-gray-500 mt-1">Le profil demandé n'existe pas ou vous n'avez pas l'autorisation d'y accéder.</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 mx-auto w-full transition-colors"
          >
            <ArrowLeft size={16} /> Retour à la liste
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen max-w-5xl mx-auto">

      {/* TOP BAR / ACTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200/60 active:bg-gray-200 rounded-lg text-gray-600 transition-colors"
            title="Retour"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <IdCard className="text-indigo-600 w-5 h-5" />
              Carte FNSTHS Officielle
            </h1>
            <p className="text-xs text-gray-500">Aperçu avant impression et téléchargement sécurisé du document PDF.</p>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          disabled={exporting}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 text-sm shrink-0"
        >
          {exporting ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Compilation du PDF...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Télécharger le PDF</span>
            </>
          )}
        </button>
      </div>

      {/* VISUAL CARDS CONTAINERS */}
      <div className="flex flex-col items-center justify-center">
        
        {/* Conteneur d'export aux proportions strictes de l'A4 Paysage pour html2canvas */}
        <div 
          ref={cardRef}
          className="bg-white shadow-xl rounded-xl border border-gray-100 p-8 w-full flex items-center justify-center select-none"
          style={{ width: "297mm", minHeight: "210mm" }}
        >
          <div className="w-full h-full transform scale-105 origin-center">
            <CarteFNSTHS praticien={praticien} />
          </div>
        </div>

      </div>

    </div>
  )
}