/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Utility to wrap responses with CORS
function withCORS(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Or restrict to your domain
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  })
}

// Handle preflight requests
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return withCORS({}, 200)
  }

  try {
    const { user_id } = await req.json()
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]

    if (!user_id || !token) {
      return withCORS({ error: 'Missing user ID or token' }, 400)
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    )

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || user.id !== user_id) {
      return withCORS({ error: 'Unauthorized request' }, 401)
    }

    const { error: billsError } = await supabase
      .from('Bills')
      .delete()
      .eq('user_id', user_id)

    if (billsError) {
      return withCORS({ error: billsError.message }, 500)
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id)

    if (deleteError) {
      return withCORS({ error: deleteError.message }, 500)
    }

    return withCORS({ message: 'User deleted successfully' }, 200)
  } catch (err) {
    console.error('Unexpected error in Edge Function:', err)
    return withCORS({ error: 'Internal server error' }, 500)
  }
})
