import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { useParams } from "react-router-dom"
import QRCodeCard from "../../components/ui/QRCodeCard"

export default function DetailPraticien() {
  const { id } = useParams()
  const [praticien, setPraticien] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("praticiens")
        .select("*")
        .eq("id", id)
        .single()

      setPraticien(data)
    }

    fetchData()
  }, [id])

  if (!praticien) {
    return <p>Chargement...</p>
  }

  return (
    <div className="p-6">
      
      <h1 className="text-2xl font-bold mb-4">
        Fiche Praticien
      </h1>

      <div className="grid grid-cols-2 gap-6">
        
        {/* INFOS */}
        <div className="bg-white p-4 shadow rounded">
          <p><strong>Nom :</strong> {praticien.nom}</p>
          <p><strong>Prénom :</strong> {praticien.prenom}</p>
          <p><strong>Téléphone :</strong> {praticien.telephone}</p>
          <p><strong>Région :</strong> {praticien.region}</p>
          <p><strong>Spécialité :</strong> {praticien.specialite}</p>
          <p><strong>Numéro :</strong> {praticien.numero_adherent}</p>
        </div>

        {/* QR CODE */}
        <QRCodeCard praticien={praticien} />

      </div>

    </div>
  )
}