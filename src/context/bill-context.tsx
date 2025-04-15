'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

const BillContext = createContext(null)

export function BillProvider({ children }) {
    const supabase = createClient()
    const [bills, setBills] = useState([])

    const refetchBills = useCallback(async () => {
        const { data, error } = await supabase
            .from('Bills')
            .select('*')
            .order('due_date', { ascending: true })

        if (error) console.error('[refetchBills error]', error)
        setBills(data || [])
    }, [supabase])

    useEffect(() => {
        refetchBills()

        const channel = supabase
            .channel('bills-changes', {
                config: { broadcast: { self: true } },
            })
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Bills' },
                () => refetchBills()
            )
            .subscribe()

        return () => {
            channel.unsubscribe()
                .then((status) => console.log('[Unsubscribed]', status))
                .catch((err) => console.error('[Unsubscribe error]', err))
        }
    }, [refetchBills, supabase])

    return (
        <BillContext.Provider value={{ bills, setBills, refetchBills }}>
            {children}
        </BillContext.Provider>
    )
}

export function useBills() {
    const context = useContext(BillContext)
    if (!context) throw new Error('useBills must be used within a BillProvider')
    return context
}
