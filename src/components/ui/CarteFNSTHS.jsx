import QRCode from "react-qr-code"

export default function CarteFNSTHS({ praticien, cardRef, view = "recto" }) {
  
  if (!praticien || typeof praticien !== "object") {
    return (
      <div className="pb-4 flex justify-center">
        <div ref={cardRef} className="w-[440px] h-[260px] bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-xs text-gray-400 italic shadow-sm select-none">
          Chargement des données...
        </div>
      </div>
    )
  }

  const qrData = JSON.stringify({
    id: praticien.numero_adherent || "N/A",
    nom: praticien.nom || "",
    prenom: praticien.prenom || "",
    tel: praticien.telephone || "N/A",
    spec: praticien.specialite || "Tradipraticien",
    reg: praticien.region || "Burkina Faso",
    statut: praticien.statut === 'actif' ? 'ACTIF' : 'EN_ATTENTE'
  })

  // Composant interne pour le filigrane afin d'éviter la répétition
  const Watermark = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0">
      <img src="/logo.JPG" alt="Logo FNSTHS" className="w-64 h-64 object-contain" />
    </div>
  )

  // ================= RECTO =================
  if (view === "recto") {
    return (
      <div className="pb-6 w-full flex justify-center">
        {/* Conteneur de prévisualisation élégant (PC & Mobile responsive) */}
        <div className="p-4 sm:p-8 bg-gradient-to-br from-slate-100 via-white to-slate-100 rounded-3xl border border-slate-200 shadow-xl flex justify-center items-center overflow-hidden w-full max-w-[500px]">
          <div className="scale-[0.75] sm:scale-100 transition-transform duration-300 origin-center">
            <div className="w-[440px] h-[260px] flex justify-center items-center">
              <div className="relative shrink-0" style={{ width: '440px', height: '260px' }}>
                <div
                  ref={cardRef}
                  className="absolute top-0 left-0 bg-gradient-to-br from-white via-gray-50 to-green-50/30 border border-gray-300 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden select-none"
                  style={{ width: '440px', height: '260px', boxSizing: 'border-box' }}
                >
                  <Watermark />

                  <div className="absolute top-0 left-0 right-0 h-1.5 flex z-10">
                    <div className="bg-green-600 flex-1"></div>
                    <div className="bg-red-600 w-5 flex items-center justify-center shrink-0 text-[9px] text-yellow-400">★</div>
                    <div className="bg-green-600 flex-1"></div>
                  </div>

                  <div className="w-full flex flex-col items-center text-center mt-1 z-10">
                    <h2 className="text-[15px] font-black text-green-700 tracking-widest uppercase leading-none mb-0.5">Burkina Faso</h2>
                    <h3 className="text-[9.5px] leading-tight font-bold text-gray-800 flex flex-wrap justify-center gap-x-1.5">
                      <span><span className="text-red-600">F</span>édération</span>
                      <span><span className="text-red-600">S</span>ans</span>
                      <span><span className="text-red-600">F</span>rontière</span>
                      <span className="text-gray-400 font-normal">des</span> <span className="text-red-600">T</span>radipraticiens
                    </h3>
                    <div className="h-[2px] bg-green-600 w-[120px] mx-auto mt-1 rounded-full" />
                  </div>

                  <div className="flex gap-6 mt-2 flex-1 items-center z-10">
                    <div className="w-[96px] h-[112px] shrink-0 border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white">
                      {praticien.photo ? <img src={praticien.photo} alt="Photo" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-50" />}
                    </div>
                    <div className="text-xs space-y-1.5 text-gray-700 flex-1">
                      <p className="text-[13px] font-black text-gray-900 uppercase truncate">{praticien.nom} {praticien.prenom}</p>
                      <div className="pt-1 border-t border-gray-100">
                        <p><strong className="text-gray-400 text-[11px]">N° Adhérent :</strong> <span className="font-bold text-green-700">{praticien.numero_adherent}</span></p>
                        <p><strong className="text-gray-400 text-[11px]">Spécialité :</strong> {praticien.specialite}</p>
                        <p><strong className="text-gray-400 text-[11px]">Région :</strong> {praticien.region}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t pt-2 z-10">
                    <div className="text-[8px] text-gray-400 font-bold uppercase">Carte Officielle</div>
                    <div className="p-1 bg-white border border-gray-200 rounded-lg">
                      <QRCode value={qrData} size={48} level="M" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ================= VERSO =================
  return (
    <div className="pb-6 w-full flex justify-center">
      {/* Conteneur de prévisualisation élégant (PC & Mobile responsive) */}
      <div className="p-4 sm:p-8 bg-gradient-to-br from-slate-100 via-white to-slate-100 rounded-3xl border border-slate-200 shadow-xl flex justify-center items-center overflow-hidden w-full max-w-[500px]">
        <div className="scale-[0.75] sm:scale-100 transition-transform duration-300 origin-center">
          <div className="w-[440px] h-[260px] flex justify-center items-center">
            <div className="relative shrink-0" style={{ width: '440px', height: '260px' }}>
              <div
                ref={cardRef}
                className="absolute top-0 left-0 bg-gradient-to-br from-white via-gray-50 to-green-50/10 border border-gray-300 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden select-none"
                style={{ width: '440px', height: '260px', boxSizing: 'border-box' }}
              >
                <Watermark />

                <div className="border-b-2 border-green-600 pb-1.5 flex justify-between items-center z-10">
                  <h3 className="text-[11px] font-bold text-green-700 uppercase">Conditions d'utilisation</h3>
                  <span className="text-[8px] text-gray-400 uppercase">Verso</span>
                </div>

                <div className="text-[9.5px] text-gray-600 space-y-3 my-2 z-10">
                  <p>1. Cette carte est strictement <strong className="text-gray-900">personnelle et incessible</strong>.</p>
                  <p>2. Certifiez les droits d'exercice en scannant le code QR au verso.</p>
                  <p>3. En cas de perte, notifier le secrétariat permanent à Ouagadougou.</p>
                </div>

                <div className="flex justify-between items-center border-t pt-3 mt-auto z-10">
                  <div className="flex flex-col"><span className="text-[8px] text-gray-400 uppercase">Fait à Ouagadougou</span><span className="text-[9px] font-semibold">Le Bureau National</span></div>
                  <div className="w-28 h-10 border border-dashed border-green-600/40 rounded-lg flex items-center justify-center bg-green-50/20">
                    <span className="text-[7px] text-green-700/60 uppercase">Signature</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}