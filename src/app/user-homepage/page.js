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
import SyncClientSession from '@/components/sync/sync-client-session'
import { BillProvider } from '@/context/bill-context'

export default async function UserHomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <>
      <SyncClientSession />
      <BillProvider>
        <div className="min-h-screen p-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Welcome back,{' '}
            <span className="inline-flex items-center gap-1 text-blue-600 font-semibold whitespace-nowrap capitalize">
              {user.user_metadata.username} 👋
            </span>
          </h1>

          <BillDueAlert />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <DashboardBoard />
            <BillCalendar hoverable />
          </div>

          <div className="my-6">
            <AddBillDialog user={user} />
          </div>

          <section className="mb-8">
            <BillListWrapper />
          </section>

          <section className="mb-8">
            <CategorySummaryChart />
          </section>

          <section className="mb-8">
            <MonthlyTrendChart />
          </section>
        </div>

      </BillProvider>
    </>

  )
}
