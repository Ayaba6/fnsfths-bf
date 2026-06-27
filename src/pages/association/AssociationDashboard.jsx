import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"

import {
  Users,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  Building2
} from "lucide-react"

export default function AssociationDashboard() {
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    praticiens: 0,
    enAttente: 0,
    transmis: 0,
    certifies: 0,
    rejetes: 0
  })

  const [praticiens, setPraticiens] = useState([])
  const [association, setAssociation] = useState(null)

  const fetchData = async () => {
    setLoading(true)

    try {
      // ================= USER =================
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Utilisateur non connecté")

      // ================= PROFILE =================
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) throw profileError
      if (!profile) throw new Error("Profil introuvable")

      setAssociation(profile)

      // ================= ASSOCIATION ID =================
      const associationId = profile.organisation_id

      if (!associationId) {
        setPraticiens([])
        setStats({
          praticiens: 0,
          enAttente: 0,
          transmis: 0,
          certifies: 0,
          rejetes: 0
        })
        setLoading(false)
        return
      }

      // ================= PRATICIENS =================
      const { data: praticiensData, error } = await supabase
        .from("praticiens")
        .select("*")
        .eq("association_id", associationId)
        .order("created_at", { ascending: false })

      if (error) throw error

      const list = praticiensData || []
      setPraticiens(list)

      // ================= STATS =================
      const enAttente = list.filter(p => p.statut === "en_attente").length
      const transmis = list.filter(p => p.statut === "transmis_federation").length
      const certifies = list.filter(p => p.statut === "certifie").length
      const rejetes = list.filter(p => p.statut === "rejete").length

      setStats({
        praticiens: list.length,
        enAttente,
        transmis,
        certifies,
        rejetes
      })

    } catch (err) {
      console.error("❌ DASHBOARD ERROR:", err.message)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Chargement...
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Building2 />
        Dashboard Association
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">

        <StatCard icon={<Users />} title="Praticiens" value={stats.praticiens} />
        <StatCard icon={<Clock />} title="En attente" value={stats.enAttente} />
        <StatCard icon={<Send />} title="Transmis" value={stats.transmis} />
        <StatCard icon={<CheckCircle />} title="Certifiés" value={stats.certifies} />
        <StatCard icon={<XCircle />} title="Rejetés" value={stats.rejetes} />

      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded-xl shadow">

        <h2 className="font-bold mb-3">
          Praticiens de mon association
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th>Nom</th>
              <th>Numéro</th>
              <th>Statut</th>
            </tr>
          </thead>

          <tbody>
            {praticiens.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  Aucun praticien
                </td>
              </tr>
            ) : (
              praticiens.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td>{p.nom} {p.prenom}</td>
                  <td className="text-green-700">{p.numero_adherent}</td>
                  <td>{p.statut}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* ACTION */}
      <div className="mt-6">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          ➜ Transmettre à la Fédération
        </button>
      </div>

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