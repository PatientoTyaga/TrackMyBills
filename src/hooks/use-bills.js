'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function useBills() {
  const supabase = createClientComponentClient()
  const [bills, setBills] = useState([])

  useEffect(() => {
    const fetchBills = async () => {
      const { data } = await supabase
        .from('bills')
        .select('*')
        .order('due_date', { ascending: true })
      setBills(data)
    }

    fetchBills()

    const channel = supabase
      .channel('bills-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bills',
        },
        () => {
          fetchBills()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return { bills, setBills }
}