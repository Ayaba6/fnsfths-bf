export const generateMemberId = (lastNumber) => {
  const year = new Date().getFullYear()

  let nextNumber = 1

  if (lastNumber) {
    const parts = lastNumber.split("-")
    const last = parseInt(parts[2])
    nextNumber = last + 1
  }

  const formatted = String(nextNumber).padStart(4, "0")

  return `FNSTHS-${year}-${formatted}`
}