'use client'

import { useEffect, useState } from 'react'
import currencies from '@/app/utils/currencies'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function BillList({ bills, setBills, onDelete, onMarkAsPaid, onEdit }) {

  const [localBills, setLocalBills] = useState(bills)
  const [selectedBill, setSelectedBill] = useState(null)
  const [editingBill, setEditingBill] = useState(null)
  const [filter, setFilter] = useState('All')
  const [editedAmount, setEditedAmount] = useState('')
  const [editedDueDate, setEditedDueDate] = useState('')

  useEffect(() => {
    setLocalBills(bills)
  }, [bills])

  const markAsPaid = async (id) => {
    const isAuthenticated = typeof onMarkAsPaid === 'function'

    if (isAuthenticated) {
      const updated = await onMarkAsPaid(id)
      if (updated) setLocalBills(updated)
    } else {
      const updatedBills = []

      for (const bill of localBills) {
        if (bill.id === id) {
          const updatedBill = { ...bill, is_paid: true }
          updatedBills.push(updatedBill)

          // Handle recurrence
          if (bill.frequency === 'Monthly' || bill.frequency === 'Yearly') {
            const dueDate = new Date(bill.due_date + 'T00:00:00')
            const nextDueDate = new Date(dueDate)

            if (bill.frequency === 'Monthly') nextDueDate.setMonth(nextDueDate.getMonth() + 1)
            if (bill.frequency === 'Yearly') nextDueDate.setFullYear(nextDueDate.getFullYear() + 1)

            const nextDueDateStr = nextDueDate.toISOString().split('T')[0]

            const alreadyExists = localBills.some(
              (b) => b.name === bill.name && b.due_date === nextDueDateStr
            )

            if (!alreadyExists) {
              const newRecurring = {
                ...bill,
                is_paid: false,
                due_date: nextDueDateStr,
                id: Date.now() + Math.random(),
              }
              updatedBills.push(newRecurring)
            }
          }
        } else {
          updatedBills.push(bill)
        }
      }

      localStorage.setItem('bills', JSON.stringify(updatedBills))
      setLocalBills(updatedBills)
      if (setBills) setBills(updatedBills)
    }

    setSelectedBill(null)
  }

  const deleteBill = async (id) => {
    const isAuthenticated = typeof onDelete === 'function'

    if (isAuthenticated) {
      await onDelete(id)
    } else {
      const updatedBills = localBills.filter((bill) => bill.id !== id)
      localStorage.setItem('bills', JSON.stringify(updatedBills))
      setLocalBills(updatedBills)
      if (setBills) {
        setBills(updatedBills)
      }
    }
  }

  const editBill = async () => {
    if (!editedAmount || isNaN(editedAmount) || !editedDueDate) return
    const isAuthenticated = typeof onEdit === 'function'
    const updatedAmount = parseFloat(editedAmount)

    if (isAuthenticated) {
      const updated = await onEdit(editingBill.id, updatedAmount, editedDueDate)
      if (updated) setLocalBills(updated)
    } else {
      const updatedBills = localBills.map((bill) =>
        bill.id === editingBill.id
          ? { ...bill, amount: updatedAmount, due_date: editedDueDate }
          : bill
      )
      localStorage.setItem('bills', JSON.stringify(updatedBills))
      setLocalBills(updatedBills)
      if (setBills) {
        setBills(updatedBills)
      }
    }

    setEditingBill(null)
    setEditedAmount('')
    setEditedDueDate('')
  }

  const filteredBills = localBills.filter((bill) => {
    if (filter === 'All') return true
    return bill.frequency === filter
  })

  const unpaidBills = filteredBills.filter((bill) => !bill.is_paid)
  const paidBills = filteredBills.filter((bill) => bill.is_paid)

  const renderSection = (title, list, emptyMessage, isUnpaid = false) => (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3
          className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full w-fit ${title === 'Paid Bills'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
            }`}
        >
          {title === 'Paid Bills' ? <span className='mr-1'>✅</span> : <span className='mr-1'>⏰</span>} {title}
        </h3>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-80 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        {list.length > 0 ? (
          list.map((bill) => {
            const currency = currencies.find((c) => c.code === bill.currency)
            const symbol = currency?.symbol || bill.currency

            return (
              <div
                key={bill.id}
                className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between flex-wrap gap-y-1 mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-white break-words max-w-[70%]">
                    {bill.name}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {symbol} {bill.amount}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    Due: {new Date(bill.due_date + 'T12:00:00').toLocaleDateString()}
                  </span>
                  <span>
                    Status: {bill.is_paid ? 'Paid' : 'Unpaid'}
                    {!bill.is_paid && new Date(bill.due_date + 'T00:00:00') < new Date(new Date().setHours(0, 0, 0, 0)) && (
                      <span className="text-red-500 text-xs ml-2">(Overdue)</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap justify-between items-center mt-2 text-sm gap-y-2">
                  <div className="flex flex-wrap gap-4">
                    {isUnpaid && (
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="text-blue-600 hover:underline"
                      >
                        Mark as Paid
                      </button>
                    )}
                    <button
                      onClick={() => deleteBill(bill.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remove Bill
                    </button>
                    {isUnpaid && (
                      <button
                        onClick={() => {
                          setEditingBill(bill)
                          setEditedAmount(bill.amount.toString())
                          setEditedDueDate(bill.due_date)
                        }}
                        className="text-yellow-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded mt-1 sm:mt-0">
                    {bill.frequency}
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-gray-500 dark:text-gray-300 text-sm">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <select
          className="text-sm border px-2 py-1 rounded shadow dark:bg-gray-800 dark:text-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="One-time">One-time</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
        {renderSection('Unpaid Bills', unpaidBills, "No unpaid bills. You're all caught up! 🎉", true)}
        {renderSection('Paid Bills', paidBills, 'No paid bills.')}
      </div>

      {/* Mark as Paid Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Paid</DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to mark <strong>{selectedBill?.name}</strong> as paid?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setSelectedBill(null)}
              className="px-4 py-2 text-sm bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => markAsPaid(selectedBill.id)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingBill} onOpenChange={() => setEditingBill(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bill</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">New Amount</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
              value={editedAmount}
              onChange={(e) => setEditedAmount(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">New Due Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setEditingBill(null)}
              className="px-4 py-2 text-sm bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={editBill}
              className="px-4 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}