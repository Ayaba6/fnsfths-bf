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
        [...filtered]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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
      <div className="h-screen flex items-center justify-center">
        Chargement...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* ================= HEADER MOBILE ================= */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2">
          <Shield className="text-green-600" />
          Dashboard FNSTHS
        </h1>

        <button
          className="md:hidden p-2 bg-white rounded border"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <Menu />
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div className="md:hidden mb-4 bg-white p-4 rounded-xl border space-y-2">
          <ActionCard icon={<Network />} title="Créer Réseau" onClick={() => {
            setModalType("reseau")
            setModalOpen(true)
            setMobileMenu(false)
          }} />

          <ActionCard icon={<Building2 />} title="Créer Association" onClick={() => {
            setModalType("association")
            setModalOpen(true)
            setMobileMenu(false)
          }} />

          <ActionCard icon={<Plus />} title="Ajouter Praticien" onClick={() => {
            setModalType("praticien")
            setModalOpen(true)
            setMobileMenu(false)
          }} />
        </div>
      )}

      {/* ================= ACTIONS DESKTOP ================= */}
      <div className="hidden md:grid grid-cols-3 gap-4 mb-6">

        <ActionCard icon={<Network />} title="Créer Réseau" onClick={() => {
          setModalType("reseau")
          setModalOpen(true)
        }} />

        <ActionCard icon={<Building2 />} title="Créer Association" onClick={() => {
          setModalType("association")
          setModalOpen(true)
        }} />

        <ActionCard icon={<Plus />} title="Ajouter Praticien" onClick={() => {
          setModalType("praticien")
          setModalOpen(true)
        }} />

      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <StatCard icon={<Users />} title="Praticiens" value={stats.praticiens} />
        <StatCard icon={<Network />} title="Réseaux" value={stats.reseaux} />
        <StatCard icon={<Building2 />} title="Associations" value={stats.associations} />
        <StatCard icon={<CheckCircle />} title="Certifiés" value={stats.certifies} />
        <StatCard icon={<Clock />} title="Attente" value={stats.enAttente} />
        <StatCard icon={<XCircle />} title="Suspendus" value={stats.suspendus} />
      </div>

      {/* ================= CARTE ================= */}
      <div className="mb-6">
        <CarteBurkina
          selected={regionFilter}
          onSelect={setRegionFilter}
          stats={regionStats}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm overflow-x-auto">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <MapPin size={18} />
          Derniers praticiens
        </h2>

        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-500">
              <th>Nom</th>
              <th>Numéro</th>
              <th>Région</th>
              <th>Statut</th>
            </tr>
          </thead>

          <tbody>
            {recentPraticiens.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td>{p.nom} {p.prenom}</td>
                <td className="text-green-700">{p.numero_adherent}</td>
                <td>{p.region}</td>
                <td>{p.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <CreateForm
            type={modalType}
            onSuccess={() => {
              setModalOpen(false)
              fetchData()
            }}
          />
        </Modal>
      )}
    </div>
  )
}

/* ================= MODAL ================= */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl p-5 md:p-6 rounded-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X />
        </button>
        {children}
      </div>
    </div>
  )
}

/* ================= FORM SWITCH ================= */
function CreateForm({ type, onSuccess }) {
  if (type === "reseau") return <ReseauForm onSuccess={onSuccess} />
  if (type === "association") return <AssociationForm onSuccess={onSuccess} />
  if (type === "praticien") return <PraticienForm onSuccess={onSuccess} />
  return null
}

/* ================= UI COMPONENTS ================= */
function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-3 md:p-4 rounded-xl border">
      <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm">
        {icon} {title}
      </div>
      <div className="text-lg md:text-2xl font-bold">{value}</div>
    </div>
  )
}

function ActionCard({ icon, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl border cursor-pointer hover:border-green-500 flex items-center gap-3"
    >
      {icon}
      <span className="font-semibold text-sm md:text-base">{title}</span>
    </div>
  )
}