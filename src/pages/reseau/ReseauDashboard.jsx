import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"

import {
  Users,
  Send,
  Clock,
  CheckCircle,
  Network,
  Plus,
  X
} from "lucide-react"

/* ✅ IMPORT DES VRAIS MODALS */
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
  }, [modal])

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: profile } = await supabase
        .from("users")
        .select("organisation_id")
        .eq("id", user.id)
        .single()

      const orgId = profile.organisation_id

      const { data: associations } = await supabase
        .from("organisations")
        .select("*")
        .eq("type", "association")
        .eq("parent_id", orgId)

      const associationIds = (associations || []).map(a => a.id)

      let praticiens = []

      if (associationIds.length > 0) {
        const { data } = await supabase
          .from("praticiens")
          .select("*")
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
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [refresh])

  if (loading) return <div className="p-6">Chargement...</div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        🌐 Dashboard Réseau
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">

        <StatCard icon={<Network />} title="Associations" value={stats.associations} />
        <StatCard icon={<Users />} title="Praticiens" value={stats.praticiens} />
        <StatCard icon={<Clock />} title="En attente" value={stats.enAttente} />
        <StatCard icon={<Send />} title="Transmis" value={stats.transmis} />
        <StatCard icon={<CheckCircle />} title="Certifiés" value={stats.certifies} />

      </div>

      {/* ACTIONS */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-3">

        <button
          onClick={() => setModal("association")}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} />
          Créer Association
        </button>

        <button
          onClick={() => setModal("praticien")}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Users size={16} />
          Ajouter Praticien
        </button>

      </div>

      {/* MODAL */}
      {modal && (
        <Modal onClose={() => setModal(null)}>

          {modal === "association" && (
            <AssociationForm
              onSuccess={() => {
                setModal(null)
                setRefresh(r => !r)
              }}
            />
          )}

          {modal === "praticien" && (
            <PraticienForm
              onSuccess={() => {
                setModal(null)
                setRefresh(r => !r)
              }}
            />
          )}

        </Modal>
      )}

    </div>
  )
}

/* ================= STATS CARD ================= */
function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        {title}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

/* ================= MODAL ================= */
function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[520px] p-6 rounded-xl relative"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        {children}
      </div>
    </div>
  )
}