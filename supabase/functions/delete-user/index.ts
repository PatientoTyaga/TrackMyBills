/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const origin = req.headers.get('Origin') ?? ''
    const allowedOrigins = ['http://localhost:3000', 'https://trackmybills.vercel.app']

    if (!allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ error: 'Forbidden origin' }), {
        status: 403,
        headers: {
          'Access-Control-Allow-Origin': 'null',
          'Content-Type': 'application/json',
        },
      })
    }

    const { user_id } = await req.json()
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.split(' ')[1]

    if (!user_id || !token) {
      return new Response(JSON.stringify({ error: 'Missing user ID or token' }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Content-Type': 'application/json',
        },
      })
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
      return new Response(JSON.stringify({ error: 'Unauthorized request' }), {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Content-Type': 'application/json',
        },
      })
    }

    const { error: billsError } = await supabase
      .from('Bills')
      .delete()
      .eq('user_id', user_id)

    if (billsError) {
      return new Response(JSON.stringify({ error: billsError.message }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Content-Type': 'application/json',
        },
      })
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id)

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Content-Type': 'application/json',
        },
      })
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    console.error('Unexpected error in Edge Function:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // fallback in case Origin is not known
        'Content-Type': 'application/json',
      },
    })
  }
})
