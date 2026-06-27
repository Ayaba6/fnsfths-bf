import { useEffect, useState } from "react"
import {
  getTotalPraticiens,
  getAllPraticiens
} from "../../services/statsService"

export default function Dashboard() {
  const [total, setTotal] = useState(0)
  const [praticiens, setPraticiens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)

      // TOTAL
      const { count } = await getTotalPraticiens()
      setTotal(count || 0)

      // LISTE
      const { data } = await getAllPraticiens()
      setPraticiens(data || [])

      setLoading(false)
    }

    fetchStats()
  }, [])

  // 📊 PAR RÉGION
  const byRegion = praticiens.reduce((acc, p) => {
    const key = p.region || "Non défini"
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // 🌿 PAR SPÉCIALITÉ
  const bySpecialite = praticiens.reduce((acc, p) => {
    const key = p.specialite || "Non défini"
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // 🟢 CERTIFIÉS
  const certifies = praticiens.filter(
    (p) => p.statut === "certifie"
  ).length

  // 🔴 SUSPENDUS
  const suspendus = praticiens.filter(
    (p) => p.statut === "suspendu"
  ).length

  if (loading) {
    return (
      <div className="p-6 text-center">
        Chargement du dashboard...
      </div>
    )
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard FNSTHS
      </h1>

      {/* CARDS STATS */}
      <div className="grid grid-cols-5 gap-4 mb-6">

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-gray-500">Total</h2>
          <p className="text-2xl font-bold">{total}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-gray-500">Certifiés</h2>
          <p className="text-2xl font-bold text-green-600">
            {certifies}
          </p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-gray-500">Suspendus</h2>
          <p className="text-2xl font-bold text-red-600">
            {suspendus}
          </p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-gray-500">Régions</h2>
          <p className="text-2xl font-bold">
            {Object.keys(byRegion).length}
          </p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-gray-500">Spécialités</h2>
          <p className="text-2xl font-bold">
            {Object.keys(bySpecialite).length}
          </p>
        </div>

      </div>

      {/* PAR RÉGION */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="font-bold mb-3">
          Répartition par région
        </h2>

        {Object.entries(byRegion).map(([region, count]) => (
          <div
            key={region}
            className="flex justify-between border-b py-1"
          >
            <span>{region}</span>
            <span className="font-bold">{count}</span>
          </div>
        ))}
      </div>

      {/* PAR SPÉCIALITÉ */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="font-bold mb-3">
          Répartition par spécialité
        </h2>

        {Object.entries(bySpecialite).map(([sp, count]) => (
          <div
            key={sp}
            className="flex justify-between border-b py-1"
          >
            <span>{sp}</span>
            <span className="font-bold">{count}</span>
          </div>
        ))}
      </div>

    </div>
  )
}