// src/hooks/useUserSession.js
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

export default function useUserSession() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return session
}
