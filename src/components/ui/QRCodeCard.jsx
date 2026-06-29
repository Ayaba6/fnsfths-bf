import QRCode from "react-qr-code"

export default function QRCodeCard({ praticien }) {
  // On intègre le statut directement dans l'objet JSON
  const qrData = JSON.stringify({
    id: praticien.numero_adherent,
    nom: praticien.nom,
    prenom: praticien.prenom,
    telephone: praticien.telephone,
    statut: praticien.statut === 'actif' ? 'ACTIF' : 'EN_ATTENTE'
  })

  return (
    <div className="bg-white p-4 shadow rounded w-fit text-center border border-gray-100">

      <h2 className="font-bold mb-3 text-green-700 uppercase tracking-wide text-sm">
        Carte FNSTHS
      </h2>

      {/* CORRECTION : Remplacement de QRCodeCanvas par QRCode (conforme à ton import) */}
      <div className="p-2 bg-white border border-gray-100 rounded-lg inline-block">
        <QRCode 
          value={qrData} 
          size={180} 
          level="M" /* Sécurise la lecture du JSON volumineux */
        />
      </div>

      <div className="mt-3 text-sm text-gray-800">
        <p className="font-bold uppercase">{praticien.nom} {praticien.prenom}</p>
        <p className="text-xs font-mono text-gray-500 mt-0.5">{praticien.numero_adherent}</p>
        
        {/* Un petit rappel visuel du statut sous le QR code */}
        <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-2 ${
          praticien.statut === 'actif' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {praticien.statut || "En attente"}
        </span>
      </div>

    </div>
  )
}