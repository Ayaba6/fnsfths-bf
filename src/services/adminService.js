import { supabase } from "./supabase"

export const updateStatutPraticien = async (id, statut) => {
  return await supabase
    .from("praticiens")
    .update({ statut })
    .eq("id", id)
}