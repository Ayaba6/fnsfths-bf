import { supabase } from "./supabase"

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}

export async function getUserRole(userId) {
  return await supabase
    .from("user_roles")
    .select("role, organisation_id")
    .eq("user_id", userId)
    .single()
}

export async function logout() {
  return await supabase.auth.signOut()
}