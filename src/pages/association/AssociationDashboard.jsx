import { useEffect, useState, cloneElement } from "react"
import { supabase } from "../../services/supabase"

import {
  Users,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  Building2,
  Loader2
} from "lucide-react"

export default function AssociationDashboard() {
  const [loading, setLoading] = useState(true)
  const [transmitting, setTransmitting] = useState(false)

  const [stats, setStats] = useState({
    praticiens: 0,
    enAttente: 0,
    transmis: 0,
    certifies: 0,
    rejetes: 0
  })

  const [praticiens, setPraticiens] = useState([])
  const [associationId, setAssociationId] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Utilisateur non connecté")

      // 2. Récupérer l'organisation_id (association_id) depuis la table users
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("organisation_id")
        .eq("id", user.id)
        .single()

      if (profileError) throw profileError
      const orgId = profile?.organisation_id
      setAssociationId(orgId)

      if (!orgId) {
        setPraticiens([])
        setStats({ praticiens: 0, enAttente: 0, transmis: 0, certifies: 0, rejestes: 0 })
        return
      }

      // 3. 🔥 RECUPERATION DIRECTE DES STATS ET MEMBRES DEPUIS LA TABLE PRATICIENS
      const { data: praticiensData, error: praticiensError } = await supabase
        .from("praticiens")
        .select("*")
        .eq("association_id", orgId)
        .order("created_at", { ascending: false })

      if (praticiensError) throw praticiensError

      const list = praticiensData || []
      setPraticiens(list)

      // 4. Calcul des statistiques à partir des lignes récupérées
      setStats({
        praticiens: list.length,
        enAttente: list.filter(p => p.statut === "en_attente").length,
        transmis: list.filter(p => p.statut === "transmis_federation").length,
        certifies: list.filter(p => p.statut === "certifie").length,
        rejetes: list.filter(p => p.statut === "rejete").length
      })

    } catch (err) {
      console.error("❌ DASHBOARD PRATICIENS ERROR:", err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Action pour envoyer tous les dossiers d'un coup
  const handleTransmettreFédération = async () => {
    const praticiensAEnvoyer = praticiens.filter(p => p.statut === "en_attente")
    if (praticiensAEnvoyer.length === 0) return

    setTransmitting(true)
    try {
      const ids = praticiensAEnvoyer.map(p => p.id)
      const { error } = await supabase
        .from("praticiens")
        .update({ statut: "transmis_federation" })
        .in("id", ids)

      if (error) throw error
      await fetchData() 
    } catch (err) {
      console.error("❌ TRANSMISSION ERROR:", err.message)
    } finally {
      setTransmitting(false)
    }
  }

  const getStatusBadge = (statut) => {
    const config = {
      en_attente: { bg: "bg-amber-50 text-amber-700 border-amber-200", label: "En attente" },
      transmis_federation: { bg: "bg-blue-50 text-blue-700 border-blue-200", label: "Transmis" },
      certifie: { bg: "bg-green-50 text-green-700 border-green-200", label: "Certifié" },
      rejete: { bg: "bg-red-50 text-red-700 border-red-200", label: "Rejeté" }
    }
    const match = config[statut] || { bg: "bg-gray-50 text-gray-700 border-gray-200", label: statut }
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${match.bg}`}>{match.label}</span>
  }

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen space-y-6 max-w-7xl mx-auto">

      {/* HEADER & TOP ACTION BUTTON */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="text-blue-600 w-7 h-7" />
            Dashboard Association
          </h1>
          <p className="text-sm text-gray-500">
            Pilotez vos membres praticiens locaux, vérifiez les statuts de validation et transmettez les dossiers.
          </p>
        </div>

        {/* BOUTON TRANSMETTRE PLACÉ EN HAUT */}
        {stats.enAttente > 0 && (
          <button
            onClick={handleTransmettreFédération}
            disabled={transmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 shadow-sm shadow-blue-600/10 transition-all shrink-0 self-start lg:self-center"
          >
            {transmitting ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Send size={15} />
            )}
            <span>Transmettre à la Fédération ({stats.enAttente})</span>
          </button>
        )}
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          [...Array(5)].map((_, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm animate-pulse h-24" />
          ))
        ) : (
          <>
            <StatCard icon={<Users />} title="Praticiens" value={stats.praticiens} colorClass="text-gray-700 bg-gray-50 border-gray-100" />
            <StatCard icon={<Clock />} title="En attente" value={stats.enAttente} colorClass="text-amber-600 bg-amber-50 border-amber-100" />
            <StatCard icon={<Send />} title="Transmis" value={stats.transmis} colorClass="text-blue-600 bg-blue-50 border-blue-100" />
            <StatCard icon={<CheckCircle />} title="Certifiés" value={stats.certifies} colorClass="text-green-600 bg-green-50 border-green-100" />
            <StatCard icon={<XCircle />} title="Rejetés" value={stats.rejetes} colorClass="text-red-600 bg-red-50 border-red-100" />
          </>
        )}
      </div>

      {/* TABLE DATA PANEL */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-900 text-sm">
            Praticiens inscrits au registre de l'association
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/40 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4">Nom Complet</th>
                <th className="p-4">Numéro d'adhérent</th>
                <th className="p-4">Statut Dossier</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                [...Array(3)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-36" /></td>
                    <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                    <td className="p-4"><div className="h-6 bg-gray-200 rounded-full w-20" /></td>
                  </tr>
                ))
              ) : praticiens.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-8 text-gray-400 font-medium">
                    Aucun praticien n'est encore enregistré dans votre base locale.
                  </td>
                </tr>
              ) : (
                praticiens.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">
                      {p.nom} {p.prenom}
                    </td>
                    <td className="p-4 text-blue-700 font-mono font-medium">
                      {p.numero_adherent || <span className="text-gray-300">Non attribué</span>}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(p.statut)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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