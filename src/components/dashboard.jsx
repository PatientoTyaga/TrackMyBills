'use client'

import { useEffect, useState } from 'react'

function BillCard({ bill }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold text-gray-800 dark:text-white">{bill.name}</h3>
        <span className="text-sm text-gray-600 dark:text-gray-300">${bill.amount}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
        <span>Status: {new Date(bill.dueDate) < new Date() ? 'Paid' : 'Unpaid'}</span>
      </div>
    </div>
  )
}

export default function DashboardBoard() {
  const [bills, setBills] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const billsPerPage = 4

  useEffect(() => {
    const storedBills = JSON.parse(localStorage.getItem('bills')) || []
    const upcoming = storedBills
      .filter((bill) => new Date(bill.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    setBills(upcoming)
  }, [])

  const totalPages = Math.ceil(bills.length / billsPerPage)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, 4000)
    return () => clearInterval(interval)
  }, [totalPages])

  const displayedBills = bills.slice(
    currentPage * billsPerPage,
    (currentPage + 1) * billsPerPage
  )

  return (
    <section className="space-y-6">
      {/* Airport Board */}
      <div className="bg-black dark:bg-gray-800 text-green-500 font-mono p-6 rounded-lg shadow-md overflow-hidden h-[250px]">
        <h2 className="text-xl font-bold mb-2 border-b border-green-500 pb-2">
          Upcoming Payments
        </h2>

        <ul className="flex-1 overflow-y-auto space-y-2 pr-1">
          {displayedBills.length > 0 ? (
            displayedBills.map((bill, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b border-green-700 pb-1"
              >
                <span>{bill.name}</span>
                <span>${bill.amount}</span>
                <span className="text-xs">
                  {new Date(bill.dueDate).toLocaleDateString()}
                </span>
              </li>
            ))
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

      {/* Bill Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bills.length > 0 ? (
          bills.map((bill) => <BillCard key={bill.id} bill={bill} />)
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No bills saved yet.</p>
        )}
      </div>
    </section>
  )
}