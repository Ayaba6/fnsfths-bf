import { useEffect, useState, cloneElement } from "react"
import { supabase } from "../../services/supabase"
import {
  Users,
  Send,
  Clock,
  CheckCircle,
  Network,
  Plus,
  X,
  Building2
} from "lucide-react"

/* IMPORT DES FORMULAIRES */
import AssociationForm from "../../components/modal/AssociationForm"
import PraticienForm from "../../components/modal/PraticienForm"

export default function ReseauDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    associations: 0,
    praticiens: 0,
    enAttente: 0,
    transmis: 0,
    certifies: 0
  })
  const [modal, setModal] = useState(null)
  const [refresh, setRefresh] = useState(false)

  /* ================= LOCK SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [modal])

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from("users")
        .select("organisation_id")
        .eq("id", user.id)
        .single()

      const orgId = profile?.organisation_id
      if (!orgId) return

      const { data: associations } = await supabase
        .from("organisations")
        .select("id")
        .eq("type", "association")
        .eq("parent_id", orgId)

      const associationIds = (associations || []).map(a => a.id)
      let praticiens = []

      if (associationIds.length > 0) {
        const { data } = await supabase
          .from("praticiens")
          .select("statut")
          .in("association_id", associationIds)
        praticiens = data || []
      }

      setStats({
        associations: associations?.length || 0,
        praticiens: praticiens.length,
        enAttente: praticiens.filter(p => p.statut === "en_attente").length,
        transmis: praticiens.filter(p => p.statut === "transmis_federation").length,
        certifies: praticiens.filter(p => p.statut === "certifie").length
      })
    } catch (err) {
      console.error("FETCH ERROR:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [refresh])

  return (
    <div className="p-4 md:p-6 bg-gray-50/50 min-h-screen space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Network className="text-green-600 w-7 h-7" /> Dashboard Réseau
          </h1>
          <p className="text-sm text-gray-500">Suivi des associations et certifications.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={() => setModal("association")} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all">
            <Plus size={16} /> Créer Association
          </button>
          <button onClick={() => setModal("praticien")} className="bg-gray-950 hover:bg-gray-800 text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all">
            <Users size={16} /> Ajouter Praticien
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? [...Array(5)].map((_, i) => <div key={i} className="bg-white p-5 rounded-xl border h-24 animate-pulse" />) : (
          <>
            <StatCard icon={<Building2 />} title="Associations" value={stats.associations} colorClass="text-green-600 bg-green-50" />
            <StatCard icon={<Users />} title="Praticiens" value={stats.praticiens} colorClass="text-indigo-600 bg-indigo-50" />
            <StatCard icon={<Clock />} title="En attente" value={stats.enAttente} colorClass="text-amber-600 bg-amber-50" />
            <StatCard icon={<Send />} title="Transmis" value={stats.transmis} colorClass="text-blue-600 bg-blue-50" />
            <StatCard icon={<CheckCircle />} title="Certifiés" value={stats.certifies} colorClass="text-emerald-600 bg-emerald-50" />
          </>
        )}
      </div>

      {/* MODAL SYSTEM */}
      {modal && (
        <Modal onClose={() => setModal(null)}>
          {modal === "association" && <AssociationForm onSuccess={() => { setModal(null); setRefresh(!refresh) }} />}
          {modal === "praticien" && <PraticienForm onSuccess={() => { setModal(null); setRefresh(!refresh) }} />}
        </Modal>
      )}
    </div>
  )
}

function StatCard({ icon, title, value, colorClass }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        <span className="text-2xl font-bold text-gray-900 block">{value}</span>
      </div>
      <div className={`p-2.5 rounded-xl ${colorClass}`}>
        {cloneElement(icon, { size: 20 })}
      </div>
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end p-2 shrink-0 border-b border-gray-50">
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}