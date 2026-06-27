import QRCode from "react-qr-code"
import BadgeStatut from "./BadgeStatut"

export default function CarteFNSTHS({ praticien, cardRef }) {
  return (
    <div
      ref={cardRef}
      className="w-[420px] h-[250px] bg-white border rounded-lg p-4 flex flex-col justify-between"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="font-bold text-green-700">
          FNSTHS BURKINA
        </h2>

        <BadgeStatut statut={praticien.statut} />
      </div>

      {/* BODY */}
      <div className="flex gap-4 mt-3">

        {/* PHOTO */}
        <div>
          {praticien.photo ? (
            <img
              src={praticien.photo}
              className="w-20 h-20 object-cover rounded border"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-xs">
              No photo
            </div>
          )}
        </div>

        {/* INFOS */}
        <div className="text-sm space-y-1">
          <p><strong>Nom :</strong> {praticien.nom}</p>
          <p><strong>Prénom :</strong> {praticien.prenom}</p>
          <p><strong>ID :</strong> {praticien.numero_adherent}</p>
          <p><strong>Région :</strong> {praticien.region}</p>
          <p><strong>Spécialité :</strong> {praticien.specialite}</p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-end border-t pt-2">

        <div className="text-xs text-gray-500">
          Fédération Nationale des Tradipraticiens de Santé
        </div>

        <QRCode
          value={praticien.numero_adherent}
          size={70}
        />

      </div>
    </div>
  )
}