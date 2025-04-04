// app/user-homepage/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardBoard from '@/components/dashboard/dashboard'
import BillCalendar from '@/components/bill/bill-calendar'
import MonthlyTrendChart from '@/components/monthly-trend-chart'
import AddBillDialog from '@/components/add-bill/add-bill-dialog'
import CategorySummaryChart from '@/components/category/category-summary-chart-wrapper'
import BillListWrapper from '@/components/bill/bill-list-wrapper'
import BillDueAlert from '@/components/alerts/bill-due-alert'

export default async function UserHomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const { data: bills = [] } = await supabase
    .from('Bills')
    .select('*')
    .eq('user_id', user.id)
    .order('due_date', { ascending: true })

  const unpaidBills = bills.filter((bill) => !bill.is_paid)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const reminders = unpaidBills.filter((bill) => {
    const dueDate = new Date(bill.due_date + 'T00:00:00')
    const daysBeforeDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24))
    return daysBeforeDue >= 0 && daysBeforeDue <= (bill.reminder_days || 0)
  })


  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.email} 👋</h1>

      <BillDueAlert bills={reminders} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DashboardBoard bills={bills} />
        <BillCalendar bills={bills} hoverable />
      </div>

      <div className="my-6">
        <AddBillDialog user={user} />
      </div>

      <section className="mb-8">
        <BillListWrapper bills={bills} />
      </section>

      <section className="mb-8">
        <CategorySummaryChart bills={bills} />
      </section>

      <section className="mb-8">
        <MonthlyTrendChart bills={bills} />
      </section>
    </div>
  )
}
