export default function BadgeStatut({ statut }) {
  let color = ""
  let label = ""

  switch (statut) {
    case "certifie":
      color = "bg-green-600"
      label = "✔ Certifié FNSTHS"
      break

    case "suspendu":
      color = "bg-red-600"
      label = "✖ Suspendu"
      break

    case "inactif":
      color = "bg-gray-500"
      label = "⚠ Inactif"
      break

    default:
      color = "bg-gray-400"
      label = "Non défini"
  }

  return (
    <span className={`${color} text-white text-xs px-2 py-1 rounded`}>
      {label}
    </span>
  )
}