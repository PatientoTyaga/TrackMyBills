'use client'
import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function SyncClientSession() {
  const supabase = createClient()

  useEffect(() => {
    const sync = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.warn('[SyncClientSession] Error:', error.message)
      }

      if (session) {
        console.log('[SyncClientSession] Hydrating session:', session)
        await supabase.auth.setSession(session)
      } else {
        console.log('[SyncClientSession] No session found.')
      }
    }

    sync()
  }, [])

  return null
}
