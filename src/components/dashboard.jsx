'use client'

import { useEffect, useState } from 'react'

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
    <section className="bg-black dark:bg-gray-800 text-green-500 font-mono p-6 rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-bold mb-4 border-b border-green-500 pb-2">
        Upcoming Payments
      </h2>

      <ul className="space-y-2 transition-opacity duration-500 ease-in-out">
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
    </section>
  )
}
