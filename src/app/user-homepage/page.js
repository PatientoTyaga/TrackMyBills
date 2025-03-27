'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import AddBillDialog from '@/components/add-bill-dialog'
import DashboardBoard from '@/components/dashboard'
import BillList from '@/components/bill-list'
import BillCalendar from '@/components/bill-calendar'
import { toast } from 'sonner'
import CategorySummaryChart from '@/components/category-summary-chart'

export default function UserHomePage() {
  const [session, setSession] = useState(null)
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createPagesBrowserClient()

  useEffect(() => {
    const fetchSessionAndBills = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        router.push('/sign-in')
        return
      }

      setSession(session)

      const { data: bills, error: billsError } = await supabase
        .from('Bills')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true })

      if (billsError) {
        console.error('Error fetching bills:', billsError.message)
      } else {
        console.log('Fetched due dates:', bills.map((b) => ({
          id: b.id,
          name: b.name,
          due_date: b.due_date,
        })))
        setBills(bills || [])
      }

      setLoading(false)
    }

    fetchSessionAndBills()
  }, [router, supabase])

  const refreshBills = async () => {
    if (!session) return
    const { data: bills, error } = await supabase
      .from('Bills')
      .select('*')
      .eq('user_id', session.user.id)
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Failed to refresh bills:', error.message)
    } else {
      setBills(bills || [])
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('Bills').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete bill:', error.message)
      toast.error('Failed to delete bill')
    } else {
      toast.success('Bill removed successfully')
      refreshBills()
    }
  }

  const handleMarkAsPaid = async (id) => {
    const { error } = await supabase
      .from('Bills')
      .update({ is_paid: true })
      .eq('id', id)

    if (error) {
      console.error('Failed to mark bill as paid:', error.message)
      toast.error('Failed to mark bill as paid')
    } else {
      toast.success('Bill marked as paid')
      refreshBills()
    }
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>

  const unpaidBills = bills.filter((bill) => !bill.is_paid)
  const paidBills = bills.filter((bill) => bill.is_paid)

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {session.user.email} 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Dashboard Summary */}
        <DashboardBoard bills={bills} />

        {/* Calendar View with Hover Tooltips */}
        <BillCalendar bills={bills} hoverable />
      </div>

      {/* Add Bill */}
      <div className="my-6">
        <AddBillDialog setBills={refreshBills} />
      </div>

      {/* Bills */}
      <section className="mb-8">
        <BillList
          bills={bills}
          setBills={refreshBills}
          onDelete={handleDelete}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </section>

      {/* bills summary chart */}
      <section className="mb-8">
        <CategorySummaryChart bills={bills} />
      </section>

    </div>
  )
}
