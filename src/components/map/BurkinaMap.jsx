import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"

// 📍 Coordonnées chefs-lieux
const regionsCoords = {
  "Centre": [12.3714, -1.5197],        // Ouagadougou
  "Hauts-Bassins": [11.1771, -4.2979], // Bobo-Dioulasso
  "Nord": [13.5828, -2.4216],          // Ouahigouya
  "Est": [12.0656, 0.3572],            // Fada N'Gourma
  "Sahel": [14.0833, -0.0167],         // Dori
  "Centre-Ouest": [12.2500, -2.3667],
  "Centre-Est": [12.0656, -0.3572],
  "Centre-Nord": [13.0667, -1.0833],
  "Centre-Sud": [11.8000, -1.3333],
  "Boucle du Mouhoun": [12.2500, -3.5000],
  "Cascades": [10.6333, -4.7667],
  "Sud-Ouest": [10.4167, -3.2500],
  "Plateau-Central": [12.5000, -1.3667]
}

export default function BurkinaMap() {
  const [praticiens, setPraticiens] = useState([])

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("praticiens")
        .select("region")

      console.log("🗺 MAP DATA:", data, error)

      setPraticiens(data || [])
    }

    load()
  }, [])

  // 📊 stats par région
  const stats = praticiens.reduce((acc, p) => {
    if (!p.region) return acc
    acc[p.region] = (acc[p.region] || 0) + 1
    return acc
  }, {})

  return (
    <div className="bg-white p-4 rounded-xl shadow relative z-0">

      {/* TITLE */}
      <h2 className="font-bold mb-3 flex items-center gap-2">
        📍 Répartition des praticiens au Burkina Faso
      </h2>

      {/* MAP */}
      <MapContainer
        center={[12.2383, -1.5616]}
        zoom={6}
        style={{
          height: "420px",
          width: "100%",
          zIndex: 0, // 👈 IMPORTANT
          position: "relative"
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {Object.entries(stats).map(([region, count]) => {
          const pos = regionsCoords[region]

          if (!pos) return null

          return (
            <Marker key={region} position={pos}>
              <Popup>
                <div className="text-center">
                  <b>{region}</b>
                  <br />
                  <span>{count} praticien(s)</span>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}