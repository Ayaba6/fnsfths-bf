import { supabase } from "./supabase"

// LISTE
export const getPraticiens = async () => {
  return await supabase
    .from("praticiens")
    .select("*")
    .order("created_at", { ascending: false })
}

// AJOUT
export const addPraticien = async (data) => {
  return await supabase
    .from("praticiens")
    .insert([data])
}

// SUPPRESSION
export const deletePraticien = async (id) => {
  return await supabase
    .from("praticiens")
    .delete()
    .eq("id", id)
}
// récupérer dernier praticien
export const getLastPraticien = async () => {
  return await supabase
    .from("praticiens")
    .select("numero_adherent")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()
}
// modifier  praticien
export const updatePraticien = async (id, data) => {
  return await supabase
    .from("praticiens")
    .update(data)
    .eq("id", id)
}