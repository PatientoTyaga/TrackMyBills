'use client'

import { useEffect, useState } from 'react'
import DashboardBoard from '@/components/dashboard'
import BillList from '@/components/bill-list'
import AddBillDialog from '@/components/add-bill-dialog'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [bills, setBills] = useState([])
  const [checkingSession, setCheckingSession] = useState(true)
  const supabase = createPagesBrowserClient()
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/user-homepage')
      } else {
        const storedBills = JSON.parse(localStorage.getItem('bills')) || []
        setBills(storedBills)
        setCheckingSession(false)
      }
    }

    init()
  }, [router, supabase])

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-8 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <section className="flex flex-col justify-center space-y-6">
        <h1 className="text-4xl font-bold leading-tight">
          Welcome to <span className="text-blue-600">TrackMyBills</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Keep track of all your subscriptions and bill payments in one place.
        </p>

        <AddBillDialog setBills={setBills} />
      </section>

      {/* Dashboard */}
      <DashboardBoard bills={bills} />

      {/* Bill List Section (Unpaid + Paid) */}
      <section className="md:col-span-2">
        <BillList bills={bills} setBills={setBills} />
      </section>

      {/* Sign Up CTA */}
      <section className="md:col-span-2 mt-12 border-t pt-8 text-center space-y-4">
        <h2 className="text-xl font-semibold">
          Want to access your bills from anywhere?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Sign up to securely save your bills and access them across all your devices.
          It’s completely free — no payment information needed.
        </p>

        <div className="mt-4 max-w-md mx-auto rounded-lg overflow-hidden shadow-lg">
          <video controls autoPlay loop muted className="w-full h-auto">
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <a
          href="/sign-up"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Create a Free Account
        </a>
      </section>
    </div>
  )
}
