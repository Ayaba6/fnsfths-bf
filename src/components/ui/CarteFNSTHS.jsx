import QRCode from "react-qr-code"

export default function CarteFNSTHS({ praticien, cardRef, view = "recto" }) {
  // SÉCURITÉ ACCRUE : Évite le crash "praticien is undefined" lors des chargements asynchrones
  if (!praticien || typeof praticien !== "object") {
    return (
      <div className="pb-4"> {/* Laisse de l'espace pour le scroll mobile */}
        <div 
          ref={cardRef}
          className="w-[440px] h-[260px] bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-xs text-gray-400 italic shadow-sm select-none"
        >
          Chargement des données de la carte...
        </div>
      </div>
    )
  }

  // Encodage complet des données (dont le statut) au format JSON propre
  const qrData = JSON.stringify({
    id: praticien.numero_adherent || "N/A",
    nom: praticien.nom || "",
    prenom: praticien.prenom || "",
    tel: praticien.telephone || "N/A",
    spec: praticien.specialite || "Tradipraticien",
    reg: praticien.region || "Burkina Faso",
    statut: praticien.statut === 'actif' ? 'ACTIF' : 'EN_ATTENTE'
  })

  // ================= RECTO (FACE AVANT) =================
  if (view === "recto") {
    return (
      <div className="pb-4"> {/* Enveloppe protectrice pour dégager la ligne de scroll */}
        <div
          ref={cardRef}
          className="w-[440px] h-[260px] bg-gradient-to-br from-white via-gray-50 to-green-50/30 border border-gray-300 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden select-none"
          style={{ boxSizing: "border-box" }}
        >
          {/* Liseré décoratif officiel (Drapeau du Burkina Faso) */}
          <div className="absolute top-0 left-0 right-0 h-1.5 flex">
            <div className="bg-green-600 flex-1"></div>
            <div className="bg-red-600 w-5 relative flex items-center justify-center shrink-0">
              <span className="text-[9px] text-yellow-400 absolute mb-[1px]">★</span>
            </div>
            <div className="bg-green-600 flex-1"></div>
          </div>

          {/* HEADER REMONTÉ AU MAXIMUM AVEC AJUSTEMENTS */}
          <div className="w-full flex flex-col items-center text-center mt-0 pt-0.5">
            <h2 className="text-[15px] font-black text-green-700 tracking-widest uppercase leading-none mb-0.5">
              Burkina Faso
            </h2>
            <h3 className="text-[9.5px] leading-tight font-bold text-gray-800 tracking-tight flex flex-wrap justify-center gap-x-1.5">
              <span><span className="text-red-600 font-black text-xs">F</span>édération</span>
              <span><span className="text-red-600 font-black text-xs">S</span>ans</span>
              <span><span className="text-red-600 font-black text-xs">F</span>rontière</span>
              <span className="whitespace-nowrap"><span className="text-gray-400 font-normal">des</span> <span className="text-red-600 font-black text-xs">T</span>radipraticiens</span>
              <span className="whitespace-nowrap"><span className="text-gray-400 font-normal">et</span> <span className="text-red-600 font-black text-xs">H</span>erboristes</span>
              <span className="whitespace-nowrap"><span className="text-gray-400 font-normal">de</span> <span className="text-red-600 font-black text-xs">S</span>anté</span>
            </h3>
            
            {/* TRAIT VERT DE SÉPARATION DISCRET ET FIN */}
            <div className="h-[2px] bg-green-600 w-[120px] mx-auto mt-1.5 rounded-full" />
          </div>

          {/* BODY : BLOC DÉCALÉ VERS LE BAS (mt-4) ET ESPACÉ (gap-6) */}
          <div className="flex gap-6 mt-4 flex-1 items-center pl-1">
            
            {/* CADRE PHOTO ÉLARGI */}
            <div className="w-[96px] h-[112px] shrink-0 border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white flex items-center justify-center">
              {praticien.photo ? (
                <img
                  src={praticien.photo}
                  alt="Identité Titulaire"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-center p-2 border border-dashed border-gray-300 rounded-xl">
                  <span className="text-[9px] text-gray-400 font-semibold leading-tight">Aucune<br/>Photo</span>
                </div>
              )}
            </div>

            {/* INFORMATIONS TEXTUELLES DÉCALÉES VERS LA DROITE (ml-2) */}
            <div className="text-xs space-y-1.5 text-gray-700 flex-1 ml-2">
              <p className="text-[13px] font-black text-gray-900 uppercase tracking-tight truncate">
                {praticien.nom} {praticien.prenom}
              </p>
              <div className="grid grid-cols-1 gap-1.5 pt-1.5 border-t border-gray-100">
                <p className="flex items-baseline gap-1">
                  <strong className="text-gray-400 font-medium text-[11px]">N° Adhérent :</strong> 
                  <span className="font-mono font-bold text-green-700 bg-green-50 px-1 py-0.5 rounded text-[11px]">{praticien.numero_adherent}</span>
                </p>
                <p className="truncate">
                  <strong className="text-gray-400 font-medium text-[11px]">Spécialité :</strong> 
                  <span className="font-semibold text-gray-800">{praticien.specialite || "Non spécifiée"}</span>
                </p>
                <p className="truncate">
                  <strong className="text-gray-400 font-medium text-[11px]">Région :</strong> 
                  <span className="font-medium text-gray-600">{praticien.region || "Burkina Faso"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER ÉPURÉ AVEC CODE QR */}
          <div className="flex justify-between items-end border-t border-gray-100 pt-2 bg-white/50 -mx-4 -mb-4 p-4 rounded-b-2xl">
            <div className="text-[8.5px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Carte de Membre Officielle
            </div>
            {/* CODE QR PRO SÉCURISÉ LEVEL M */}
            <div className="p-1 bg-white border border-gray-200 shadow-xs rounded-lg shrink-0 flex items-center justify-center">
              <QRCode value={qrData} size={54} level="M" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ================= VERSO (FOND BLANC / VERT ÉPURÉ) =================
  return (
    <div className="pb-4"> {/* Enveloppe protectrice pour dégager la ligne de scroll */}
      <div
        ref={cardRef}
        className="w-[440px] h-[260px] bg-gradient-to-br from-white via-gray-50 to-green-50/10 border border-gray-300 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden select-none"
        style={{ boxSizing: "border-box" }}
      >
        {/* Filigrane discret en arrière-plan vert très clair */}
        <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
          <div className="text-7xl font-black text-green-800 rotate-12">FNSTHS</div>
        </div>

        {/* EN-TÊTE VERSO AVEC LIGNES DE STYLE VERTES */}
        <div className="border-b-2 border-green-600 pb-1.5 flex justify-between items-center">
          <h3 className="text-[11px] font-bold tracking-wider text-green-700 uppercase">
            Règlements & Conditions d'utilisation
          </h3>
          <span className="text-[8px] font-bold text-gray-400 tracking-widest uppercase">Verso</span>
        </div>

        {/* TEXTES JURIDIQUES ET SÉCURITÉ EN TEXTE SOMBRE SUR FOND CLAIR */}
        <div className="text-[9.5px] text-gray-600 space-y-2.5 leading-relaxed my-2">
          <p>
            1. Cette carte est strictement <strong className="text-gray-900">personnelle et incessible</strong>. Elle atteste de la qualité de membre actif au sein de la fédération.
          </p>
          <p>
            2. Les autorités de contrôle et le public peuvent certifier les droits d'exercice de ce titulaire en scannant le code QR disponible sur la face avant.
          </p>
          <p>
            3. En cas de perte, de vol ou de détérioration, veuillez immédiatement notifier le secrétariat permanent de la fédération nationale à Ouagadougou.
          </p>
        </div>

        {/* ZONE SIGNATURES ET CACHET REVISITÉE */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-3 bg-gray-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-400 uppercase tracking-wider">Fait à Ouagadougou</span>
            <span className="text-[9px] font-semibold text-gray-700">Le Bureau National</span>
          </div>
          
          {/* Cadre pour tampon / signature physique ou numérique */}
          <div className="w-28 h-10 border border-dashed border-green-600/40 rounded-lg flex items-center justify-center bg-green-50/20 relative">
            <span className="text-[7px] text-green-700/60 font-medium uppercase tracking-wider text-center px-1">
              Signature & Cachet
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}