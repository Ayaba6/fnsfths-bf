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
  Building2,
  Loader2
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
    return () => {
      document.body.style.overflow = "auto"
    }
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refresh])

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen space-y-6 max-w-7xl mx-auto">

      {/* HEADER & ACTIONS PANEL */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Network className="text-green-600 w-7 h-7" />
            🌐 Dashboard Réseau
          </h1>
          <p className="text-sm text-gray-500">
            Vue d'ensemble de votre coordination régionale et suivi des certifications.
          </p>
        </div>

        {/* 🔥 BOUTONS PLACÉS EN HAUT DE PAGE */}
        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => setModal("association")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-sm shadow-green-600/10 transition-all"
          >
            <Plus size={16} />
            Créer une Association
          </button>

          <button
            onClick={() => setModal("praticien")}
            className="bg-gray-950 hover:bg-gray-800 text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-sm transition-all"
          >
            <Users size={16} />
            Ajouter un Praticien
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          [...Array(5)].map((_, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm animate-pulse h-24" />
          ))
        ) : (
          <>
            <StatCard 
              icon={<Building2 />} 
              title="Associations" 
              value={stats.associations} 
              colorClass="text-green-600 bg-green-50 border-green-100" 
            />
            <StatCard 
              icon={<Users />} 
              title="Praticiens" 
              value={stats.praticiens} 
              colorClass="text-indigo-600 bg-indigo-50 border-indigo-100" 
            />
            <StatCard 
              icon={<Clock />} 
              title="En attente" 
              value={stats.enAttente} 
              colorClass="text-amber-600 bg-amber-50 border-amber-100" 
            />
            <StatCard 
              icon={<Send />} 
              title="Transmis" 
              value={stats.transmis} 
              colorClass="text-blue-600 bg-blue-50 border-blue-100" 
            />
            <StatCard 
              icon={<CheckCircle />} 
              title="Certifiés" 
              value={stats.certifies} 
              colorClass="text-emerald-600 bg-emerald-50 border-emerald-100" 
            />
          </>
        )}
      </div>

      {/* MODAL SYSTEM */}
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

/* ================= STATS CARD COMPONENT ================= */
function StatCard({ icon, title, value, colorClass }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-2">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">{title}</span>
        <span className="text-3xl font-bold text-gray-900 tracking-tight block">{value}</span>
      </div>
      <div className={`p-3 rounded-xl border shrink-0 ${colorClass}`}>
        {cloneElement(icon, { size: 22 })}
      </div>
    </div>
  )
}

/* ================= MODERN MODAL WRAPPER ================= */
function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg p-6 rounded-xl border border-gray-100 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  )
}