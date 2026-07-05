import { X, User, Phone, MapPin, Award, Hash } from "lucide-react"
import CarteFNSTHS from "../ui/CarteFNSTHS" // Votre composant carte existant

export default function DetailPraticienModal({ praticien, onClose }) {
  if (!praticien) return null

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-900">Fiche Praticien</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg"><X size={20} /></button>
        </div>

        {/* Contenu Scrollable */}
        <div className="p-6 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Infos */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {praticien.photo ? <img src={praticien.photo} className="w-20 h-20 rounded-full object-cover"/> : <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center"><User size={40}/></div>}
                <div>
                  <h3 className="font-bold text-xl">{praticien.nom} {praticien.prenom}</h3>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{praticien.statut}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2"><Phone size={16}/> {praticien.telephone}</p>
                <p className="flex items-center gap-2"><MapPin size={16}/> {praticien.region}</p>
                <p className="flex items-center gap-2"><Award size={16}/> {praticien.specialite}</p>
                <p className="flex items-center gap-2"><Hash size={16}/> {praticien.numero_adherent}</p>
              </div>
            </div>

            {/* Carte */}
            <div className="flex justify-center scale-90 origin-top">
              <CarteFNSTHS praticien={praticien} view="recto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}