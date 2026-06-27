import { supabase } from "./supabase"

// TOTAL PRATICIENS
export const getTotalPraticiens = async () => {
  return await supabase
    .from("praticiens")
    .select("*", { count: "exact", head: true })
}

// LISTE POUR STATS
export const getAllPraticiens = async () => {
  return await supabase
    .from("praticiens")
    .select("*")
}