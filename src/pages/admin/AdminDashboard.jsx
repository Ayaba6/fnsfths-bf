import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import {
  Users,
  Network,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  Plus,
  X,
  MapPin,
  Menu
} from "lucide-react"

import ReseauForm from "../../components/modal/ReseauForm"
import AssociationForm from "../../components/modal/AssociationForm"
import PraticienForm from "../../components/modal/PraticienForm"
import CarteBurkina from "../../components/map/BurkinaMap"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState("reseau")
  const [mobileMenu, setMobileMenu] = useState(false)
  const [regionFilter, setRegionFilter] = useState("all")

  const [stats, setStats] = useState({
    praticiens: 0,
    reseaux: 0,
    associations: 0,
    certifies: 0,
    enAttente: 0,
    suspendus: 0
  })

  const [regionStats, setRegionStats] = useState({})
  const [recentPraticiens, setRecentPraticiens] = useState([])

  // ================= LOCK SCROLL =================
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "auto"
  }, [modalOpen])

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: praticiensData } = await supabase
        .from("praticiens")
        .select("id, nom, prenom, statut, numero_adherent, region, created_at")

      const praticiens = praticiensData || []

      const { data: orgs } = await supabase
        .from("organisations")
        .select("type")

      const reseaux = orgs?.filter(o => o.type === "reseau").length || 0
      const associations = orgs?.filter(o => o.type === "association").length || 0

      const regStats = {}
      praticiens.forEach(p => {
        if (!p.region) return
        regStats[p.region] = (regStats[p.region] || 0) + 1
      })

      setRegionStats(regStats)

      setStats({
        praticiens: praticiens.length,
        reseaux,
        associations,
        certifies: praticiens.filter(p => p.statut === "certifie").length,
        enAttente: praticiens.filter(p => p.statut === "en_attente").length,
        suspendus: praticiens.filter(p => p.statut === "suspendu").length
      })

      const filtered =
        regionFilter === "all"
          ? praticiens
          : praticiens.filter(p => p.region === regionFilter)

      setRecentPraticiens(
        filtered
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
      )
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [regionFilter])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        <Clock className="animate-spin mr-2" /> Chargement...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-gray-800">
          <Shield className="text-green-600 w-8 h-8 md:w-9 md:h-9" />
          <span>Dashboard FNSTHS</span>
        </h1>

        <button
          className="md:hidden p-2 bg-white rounded-lg border shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileMenu(false)}>
          <div className="absolute top-20 right-4 left-4 bg-white p-4 rounded-xl border shadow-xl space-y-2" onClick={(e) => e.stopPropagation()}>
            <ActionCard icon={<Network className="text-blue-500" />} title="Créer Réseau" onClick={() => { setModalType("reseau"); setModalOpen(true); setMobileMenu(false) }} />
            <ActionCard icon={<Building2 className="text-amber-500" />} title="Créer Association" onClick={() => { setModalType("association"); setModalOpen(true); setMobileMenu(false) }} />
            <ActionCard icon={<Plus className="text-green-600" />} title="Ajouter Praticien" onClick={() => { setModalType("praticien"); setModalOpen(true); setMobileMenu(false) }} />
          </div>
        </div>
      )}

      {/* ================= ACTIONS DESKTOP ================= */}
      <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
        <ActionCard icon={<Network className="text-blue-500" />} title="Créer Réseau" onClick={() => { setModalType("reseau"); setModalOpen(true) }} />
        <ActionCard icon={<Building2 className="text-amber-500" />} title="Créer Association" onClick={() => { setModalType("association"); setModalOpen(true) }} />
        <ActionCard icon={<Plus className="text-green-600" />} title="Ajouter Praticien" onClick={() => { setModalType("praticien"); setModalOpen(true) }} />
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
        <StatCard icon={<Users className="text-blue-500" />} title="Praticiens" value={stats.praticiens} />
        <StatCard icon={<Network className="text-purple-500" />} title="Réseaux" value={stats.reseaux} />
        <StatCard icon={<Building2 className="text-amber-500" />} title="Associations" value={stats.associations} />
        <StatCard icon={<CheckCircle className="text-green-500" />} title="Certifiés" value={stats.certifies} />
        <StatCard icon={<Clock className="text-orange-500" />} title="Attente" value={stats.enAttente} />
        <StatCard icon={<XCircle className="text-red-500" />} title="Suspendus" value={stats.suspendus} />
      </div>

      {/* ================= CARTE ================= */}
      <div className="mb-8 bg-white p-4 rounded-xl border shadow-sm overflow-hidden">
        <CarteBurkina selected={regionFilter} onSelect={setRegionFilter} stats={regionStats} />
      </div>

      {/* ================= LISTE PRATICIENS (REFACTO) ================= */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 md:p-5 border-b flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <MapPin size={18} className="text-gray-500" /> Derniers praticiens
          </h2>
        </div>
        
        {/* VUE TABLEAU (DESKTOP) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="py-3 px-4">Nom</th>
                <th className="py-3 px-4">Numéro</th>
                <th className="py-3 px-4">Région</th>
                <th className="py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentPraticiens.map((p) => <PraticienRow key={p.id} p={p} />)}
            </tbody>
          </table>
        </div>

        {/* VUE CARDS (MOBILE) */}
        <div className="md:hidden divide-y divide-gray-100">
          {recentPraticiens.map((p) => (
            <div key={p.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-bold text-gray-800">{p.nom} {p.prenom}</p>
                <p className="text-xs text-gray-500">{p.region} • <span className="font-mono text-green-600">{p.numero_adherent}</span></p>
              </div>
              <StatutBadge statut={p.statut} />
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <CreateForm type={modalType} onSuccess={() => { setModalOpen(false); fetchData() }} />
        </Modal>
      )}
    </div>
  )
}

/* ================= SOUS-COMPOSANTS ================= */

function StatutBadge({ statut }) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border";
  const colors = {
    certifie: 'bg-green-50 text-green-700 border-green-200',
    en_attente: 'bg-amber-50 text-amber-700 border-amber-200',
    suspendu: 'bg-red-50 text-red-700 border-red-200'
  };
  return <span className={`${base} ${colors[statut] || 'bg-gray-50'}`}>{statut}</span>;
}

function PraticienRow({ p }) {
  return (
    <tr className="hover:bg-gray-50/70">
      <td className="py-3.5 px-4 font-medium text-gray-800">{p.nom} {p.prenom}</td>
      <td className="py-3.5 px-4 text-green-700 font-semibold">{p.numero_adherent}</td>
      <td className="py-3.5 px-4 text-gray-600">{p.region}</td>
      <td className="py-3.5 px-4"><StatutBadge statut={p.statut} /></td>
    </tr>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-xl relative shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" onClick={onClose}><X size={20} /></button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function CreateForm({ type, onSuccess }) {
  if (type === "reseau") return <ReseauForm onSuccess={onSuccess} />
  if (type === "association") return <AssociationForm onSuccess={onSuccess} />
  if (type === "praticien") return <PraticienForm onSuccess={onSuccess} />
  return null
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">{icon} {title}</div>
      <div className="text-xl font-bold text-gray-800">{value}</div>
    </div>
  )
}

function ActionCard({ icon, title, onClick }) {
  return (
    <div onClick={onClick} className="bg-white p-4 rounded-xl border border-gray-200 cursor-pointer shadow-sm hover:border-green-500 hover:bg-green-50/10 flex items-center gap-3 transition-all">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <span className="font-semibold text-sm text-gray-700">{title}</span>
    </div>
  )
}