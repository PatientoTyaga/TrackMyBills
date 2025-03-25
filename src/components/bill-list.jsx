'use client'

import { useEffect, useState } from 'react'
import currencies from '@/app/utils/currencies'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function BillList({ bills, setBills }) {
  const [localBills, setLocalBills] = useState(bills)
  const [selectedBill, setSelectedBill] = useState(null)

  useEffect(() => {
    setLocalBills(bills)
  }, [bills])

  const unpaidBills = localBills.filter((bill) => !bill.isPaid)
  const paidBills = localBills.filter((bill) => bill.isPaid)

  const markAsPaid = (id) => {
    const updatedBills = localBills.map((bill) =>
      bill.id === id ? { ...bill, isPaid: true } : bill
    )
    localStorage.setItem('bills', JSON.stringify(updatedBills))
    setLocalBills(updatedBills)

    if (setBills) {
      setBills(updatedBills)
    }

    setSelectedBill(null)
  }

  const deleteBill = (id) => {
    const updatedBills = localBills.filter((bill) => bill.id !== id)
    localStorage.setItem('bills', JSON.stringify(updatedBills))
    setLocalBills(updatedBills)

    if (setBills) {
      setBills(updatedBills)
    }
  }

  const renderSection = (title, list, emptyMessage, isUnpaid = false) => (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
        {title}
      </h3>
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
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {bill.name}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {symbol} {bill.amount}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    Due: {new Date(bill.dueDate).toLocaleDateString()}
                  </span>
                  <span>
                    Status: {bill.isPaid ? 'Paid' : 'Unpaid'}
                    {!bill.isPaid && new Date(bill.dueDate) < new Date() && (
                      <span className="text-red-500 text-xs ml-2">(Overdue)</span>
                    )}
                  </span>
                </div>
                <div className="flex gap-4 mt-2 text-sm">
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 w-full">
      {renderSection('Unpaid Bills', unpaidBills, 'No unpaid bills.', true)}
      {renderSection('Paid Bills', paidBills, 'No paid bills.')}

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
    </div>
  )
}
