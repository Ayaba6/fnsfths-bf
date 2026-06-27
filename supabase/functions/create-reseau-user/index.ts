import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const body = await req.json()

  const {
    email,
    password,
    nom,
    responsable_nom,
    telephone,
    region,
    description
  } = body

  // 1️⃣ CREATE AUTH USER
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

  if (authError) {
    return new Response(JSON.stringify({ error: authError.message }), { status: 400 })
  }

  const userId = authUser.user.id

  // 2️⃣ CREATE ORGANISATION
  const { data: org, error: orgError } = await supabase
    .from("organisations")
    .insert([
      {
        nom,
        responsable_nom,
        email,
        telephone,
        region,
        description,
        type: "reseau",
        user_id: userId,
        statut: "actif"
      }
    ])
    .select()
    .single()

  if (orgError) {
    return new Response(JSON.stringify({ error: orgError.message }), { status: 400 })
  }

  // 3️⃣ CREATE ROLE
  const { error: roleError } = await supabase
    .from("user_roles")
    .insert([
      {
        user_id: userId,
        role: "reseau"
      }
    ])

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), { status: 400 })
  }

  return new Response(
    JSON.stringify({ success: true, userId, org }),
    { headers: { "Content-Type": "application/json" } }
  )
})