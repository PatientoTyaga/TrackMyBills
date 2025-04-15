'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SyncClientSession() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      console.log('[Auth Change]', event)

      if (event === 'SIGNED_OUT') {
        console.log('[SyncClientSession] User signed out in another tab')
        router.push('/sign-in')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return null
}
