import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { supabase } from "../../services/supabase"

export default function ScanQR() {
  const [result, setResult] = useState(null)
  const [praticien, setPraticien] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    )

    scanner.render(async (decodedText) => {
      setResult(decodedText)

      try {
        const { data, error } = await supabase
          .from("praticiens")
          .select("*")
          .eq("numero_adherent", decodedText)
          .single()

        if (error || !data) {
          setError("Praticien introuvable ❌")
          setPraticien(null)
          return
        }

        setError("")
        setPraticien(data)

      } catch (err) {
        setError("Erreur système")
      }
    })

    return () => scanner.clear()
  }, [])

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Scanner QR Code FNSTHS
      </h1>

      {/* SCANNER */}
      <div id="reader" className="bg-white p-4 shadow rounded" />

      {/* ERREUR */}
      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}

      {/* RESULTAT */}
      {praticien && (
        <div className="mt-4 bg-green-50 p-4 rounded shadow">

          <h2 className="text-xl font-bold mb-2">
            Membre validé ✅
          </h2>

          <p><strong>Nom :</strong> {praticien.nom}</p>
          <p><strong>Prénom :</strong> {praticien.prenom}</p>
          <p><strong>ID :</strong> {praticien.numero_adherent}</p>
          <p><strong>Région :</strong> {praticien.region}</p>
          <p><strong>Spécialité :</strong> {praticien.specialite}</p>

          {praticien.photo && (
            <img
              src={praticien.photo}
              className="w-24 h-24 mt-2 rounded object-cover"
            />
          )}

        </div>
      )}

    </div>
  )
}