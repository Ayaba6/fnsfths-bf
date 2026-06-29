import { useEffect, useState, cloneElement } from "react"
import { supabase } from "../../services/supabase"
import {
  Users, Clock, Send, CheckCircle, XCircle, Building2,
  Loader2, Plus, X
} from "lucide-react"

/* IMPORT DU MODAL DE CRÉATION */
import PraticienForm from "../../components/modal/PraticienForm"

export default function AssociationDashboard() {
  const [loading, setLoading] = useState(true)
  const [transmitting, setTransmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [stats, setStats] = useState({ praticiens: 0, enAttente: 0, transmis: 0, certifies: 0, rejetes: 0 })
  const [praticiens, setPraticiens] = useState([])

  /* ================= LOCK SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto"
    return () => { document.body.style.overflow = "auto" }
  }, [isModalOpen])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Utilisateur non connecté")

      const { data: profile } = await supabase
        .from("users")
        .select("organisation_id")
        .eq("id", user.id)
        .single()

      const orgId = profile?.organisation_id
      if (!orgId) {
        setPraticiens([]); return
      }

      const { data: praticiensData } = await supabase
        .from("praticiens")
        .select("*")
        .eq("association_id", orgId)
        .order("created_at", { ascending: false })

      const list = praticiensData || []
      setPraticiens(list)
      setStats({
        praticiens: list.length,
        enAttente: list.filter(p => p.statut === "en_attente").length,
        transmis: list.filter(p => p.statut === "transmis_federation").length,
        certifies: list.filter(p => p.statut === "certifie").length,
        rejetes: list.filter(p => p.statut === "rejete").length
      })
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleTransmettreFédération = async () => {
    const ids = praticiens.filter(p => p.statut === "en_attente").map(p => p.id)
    if (ids.length === 0) return
    setTransmitting(true)
    try {
      await supabase.from("praticiens").update({ statut: "transmis_federation" }).in("id", ids)
      await fetchData()
    } catch (err) { console.error(err) } finally { setTransmitting(false) }
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50/50 min-h-screen space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="text-blue-600 w-7 h-7" /> Dashboard Association
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
            <Plus size={16} /> Créer Praticien
          </button>
          {stats.enAttente > 0 && (
            <button onClick={handleTransmettreFédération} disabled={transmitting} className="bg-gray-950 text-white px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
              {transmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Send size={15} />}
              Transmettre ({stats.enAttente})
            </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? [...Array(5)].map((_, i) => <div key={i} className="bg-white p-5 rounded-xl border h-24 animate-pulse" />) : (
          <>
            <StatCard icon={<Users />} title="Praticiens" value={stats.praticiens} colorClass="text-gray-700 bg-gray-50" />
            <StatCard icon={<Clock />} title="En attente" value={stats.enAttente} colorClass="text-amber-600 bg-amber-50" />
            <StatCard icon={<Send />} title="Transmis" value={stats.transmis} colorClass="text-blue-600 bg-blue-50" />
            <StatCard icon={<CheckCircle />} title="Certifiés" value={stats.certifies} colorClass="text-green-600 bg-green-50" />
            <StatCard icon={<XCircle />} title="Rejetés" value={stats.rejetes} colorClass="text-red-600 bg-red-50" />
          </>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr><th className="p-4">Nom Complet</th><th className="p-4">Numéro</th><th className="p-4">Statut</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {praticiens.map(p => (
                <tr key={p.id}>
                  <td className="p-4 font-semibold">{p.nom} {p.prenom}</td>
                  <td className="p-4 font-mono text-blue-700">{p.numero_adherent}</td>
                  <td className="p-4">{getStatusBadge(p.statut)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CORRIGÉ AVEC SCROLL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-2 shrink-0 border-b">
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <PraticienForm onSuccess={() => { setIsModalOpen(false); fetchData() }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, title, value, colorClass }) {
  return (
    <div className="bg-white p-5 rounded-xl border flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase">{title}</span>
        <span className="text-2xl font-bold block">{value}</span>
      </div>
      <div className={`p-2.5 rounded-xl ${colorClass}`}>{cloneElement(icon, { size: 20 })}</div>
    </div>
  )
}

function getStatusBadge(statut) {
  const config = {
    en_attente: { bg: "bg-amber-50 text-amber-700", label: "En attente" },
    transmis_federation: { bg: "bg-blue-50 text-blue-700", label: "Transmis" },
    certifie: { bg: "bg-green-50 text-green-700", label: "Certifié" },
    rejete: { bg: "bg-red-50 text-red-700", label: "Rejeté" }
  }
  const match = config[statut] || { bg: "bg-gray-50 text-gray-700", label: statut }
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${match.bg}`}>{match.label}</span>
}