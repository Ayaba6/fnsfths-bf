import QRCode from "react-qr-code"

export default function QRCodeCard({ praticien }) {
  const qrData = JSON.stringify({
    id: praticien.numero_adherent,
    nom: praticien.nom,
    prenom: praticien.prenom,
    telephone: praticien.telephone
  })

  return (
    <div className="bg-white p-4 shadow rounded w-fit text-center">

      <h2 className="font-bold mb-2">
        Carte FNSTHS
      </h2>

      <QRCodeCanvas value={qrData} size={180} />

      <div className="mt-3 text-sm">
        <p><strong>{praticien.nom} {praticien.prenom}</strong></p>
        <p>{praticien.numero_adherent}</p>
      </div>

    </div>
  )
}