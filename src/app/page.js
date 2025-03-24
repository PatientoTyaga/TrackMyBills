'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import DashboardBoard from '@/components/dashboard'
import AddBillForm from '@/components/add-bill-form'

export default function Home() {
  const [bills, setBills] = useState([])

  useEffect(() => {
    const storedBills = JSON.parse(localStorage.getItem('bills')) || []
    setBills(storedBills)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-8 max-w-6xl mx-auto">
      {/* Left side */}
      <section className="flex flex-col justify-center space-y-6">
        <h1 className="text-4xl font-bold leading-tight">
          Welcome to <span className="text-blue-600">TrackMyBills</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Keep track of all your subscriptions and bill payments in one place.
        </p>

        {/* Dialog Button */}
        <Dialog>
          <DialogTrigger className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            Add a Bill
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Bill</DialogTitle>
              <DialogDescription>Enter the bill details below.</DialogDescription>
            </DialogHeader>
            <AddBillForm setBills={setBills} />
          </DialogContent>
        </Dialog>
      </section>

      {/* Right side */}
      <DashboardBoard />

      {/* Sign Up CTA */}
      <section className="mt-12 border-t pt-8 text-center space-y-4 md:col-span-2">
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
          href="/signup"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Create a Free Account
        </a>
      </section>
    </div>
  )
}
