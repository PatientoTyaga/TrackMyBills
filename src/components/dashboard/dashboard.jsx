'use client'

import { useEffect, useState } from 'react'
import currencies from '@/app/utils/currencies'

export default function DashboardBoard({ bills }) {
  const [currentPage, setCurrentPage] = useState(0)
  const billsPerPage = 4

  const unpaidUpcoming = bills
    .filter((bill) => !bill.is_paid)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))

  const totalPages = Math.ceil(unpaidUpcoming.length / billsPerPage)

  useEffect(() => {
    setCurrentPage(0)
  }, [bills])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, 6000)
    return () => clearInterval(interval)
  }, [totalPages])

  const displayedBills = unpaidUpcoming.slice(
    currentPage * billsPerPage,
    (currentPage + 1) * billsPerPage
  )

  return (
    <section className="space-y-6">
      {/* Airport Board */}
      <div className="bg-black dark:bg-gray-800 text-green-500 font-mono p-6 rounded-lg shadow-md overflow-hidden h-[380px]">
        <h2 className="text-xl font-bold mb-2 border-b border-green-500 pb-2">
          Upcoming Payments
        </h2>

        <ul className="flex-1 overflow-y-auto space-y-2 pr-1">
          {displayedBills.length > 0 ? (
            displayedBills.map((bill, idx) => {
              const currency = currencies.find((c) => c.code === bill.currency)
              const symbol = currency?.symbol || bill.currency

              return (
                <li
                  key={idx}
                  className="flex justify-between border-b border-green-700 pb-1"
                >
                  <span className="w-1/3 truncate">{bill.name}</span>
                  <span className="inline-flex gap-1 w-24 justify-end font-mono">
                    <span className="shrink-0">{symbol}</span>
                    <span>{bill.amount}</span>
                  </span>
                  <span className="w-24 text-right text-xs">
                    {new Date(bill.due_date + 'T12:00:00').toLocaleDateString()}
                  </span>
                </li>
              )
            })
          ) : (
            <li className="text-green-400">No upcoming bills yet.</li>
          )}
        </ul>

        <div className="flex justify-end gap-4 mt-4 text-sm text-green-400">
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev === 0 ? totalPages - 1 : prev - 1
              )
            }
          >
            ⬅️ Prev
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev + 1) % totalPages)
            }
          >
            Next ➡️
          </button>
        </div>
      </div>
    </section>
  )
}
