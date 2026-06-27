import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../../services/supabase"
import CarteFNSTHS from "../../components/ui/CarteFNSTHS"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function CartePDF() {
  const { id } = useParams()
  const [praticien, setPraticien] = useState(null)
  const [loading, setLoading] = useState(true)

  const cardRef = useRef(null)

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("praticiens")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error("❌ ERROR FETCH PRATICIEN:", error)
      }

      setPraticien(data)
      setLoading(false)
    }

    fetchData()
  }, [id])

  // ================= EXPORT PDF =================
  const downloadPDF = async () => {
    if (!cardRef.current) return

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // 🔥 meilleure qualité
        useCORS: true
      })

      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("landscape", "mm", "a4")

      const pdfWidth = 297
      const pdfHeight = 210

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)

      pdf.save(`FNSTHS-${praticien.numero_adherent}.pdf`)
    } catch (err) {
      console.error("❌ PDF ERROR:", err)
    }
  }

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Chargement...
      </div>
    )
  }

  if (!praticien) {
    return (
      <div className="p-6 text-red-600">
        Praticien introuvable
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <h1 className="text-2xl font-bold">
        🎫 Carte FNSTHS Officielle
      </h1>

      {/* CARD */}
      <div
        ref={cardRef}
        className="bg-white rounded-xl shadow p-4 w-full max-w-4xl mx-auto"
      >
        <CarteFNSTHS praticien={praticien} />
      </div>

      {/* BUTTON */}
      <div className="flex justify-center">
        <button
          onClick={downloadPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Télécharger PDF
        </button>
      </div>

    </div>
  )
}