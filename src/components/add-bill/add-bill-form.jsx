'use client'

import { addBill } from '@/app/actions/server-actions'
import currencies from '@/app/utils/currencies'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'

export default function AddBillForm({ isAuthenticated, setBills }) {
  const [formKey, setFormKey] = useState(Date.now())
  const [formState, formAction] = useActionState(addBill, { success: null, message: '' })
  const [visibleMessage, setVisibleMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (formState.message) {
      if (formState.message === 'Unauthorized') {
        router.push('/sign-in')
        router.refresh()
        return
      }

      setVisibleMessage(formState.message)

      const timeout = setTimeout(() => {
        setVisibleMessage('')
        setFormKey(Date.now()) // Re-render form to reset state and formState
      }, 4000)

      return () => clearTimeout(timeout)
    }
  }, [formState])

  const handleLocalSubmit = (e) => {
    if (isAuthenticated) return

    e.preventDefault()
    const form = e.target

    const newBill = {
      id: Date.now(),
      name: form.name.value,
      due_date: form.due_date.value,
      amount: parseFloat(form.amount.value),
      currency: form.currency.value,
      frequency: form.frequency.value,
      reminder_days: parseInt(form.reminder_days.value),
      category: form.category.value,
      is_paid: false,
    }

    const stored = JSON.parse(localStorage.getItem('bills')) || []
    const updated = [...stored, newBill]
    localStorage.setItem('bills', JSON.stringify(updated))
    if (setBills) setBills(updated)

    setVisibleMessage('Bill added locally!')
    setFormKey(Date.now())
    setTimeout(() => setVisibleMessage(''), 4000)
  }

  return (
    <form
      key={formKey}
      action={isAuthenticated ? formAction : undefined}
      onSubmit={isAuthenticated ? undefined : handleLocalSubmit}
      className="space-y-4"
    >
      <div>
        <label className="block mb-1 text-sm">Bill Name</label>
        <input
          type="text"
          name="name"
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Due Date</label>
        <input
          type="date"
          name="due_date"
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm">Amount</label>
          <input
            type="number"
            name="amount"
            className="w-full border px-3 py-2 rounded"
            min="0"
            step="0.01"
            required
            defaultValue={0}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Currency</label>
          <select name="currency" className="w-full border px-3 py-2 rounded">
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.flag} {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm" defaultValue="One-time">Frequency</label>
          <select name="frequency" className="w-full border px-3 py-2 rounded">
            <option value="One-time">One-time</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Reminder Days</label>
          <input
            type="number"
            name="reminder_days"
            className="w-full border px-3 py-2 rounded"
            min="0"
            defaultValue={3}
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm">Category</label>
        <select name="category" className="w-full border px-3 py-2 rounded" defaultValue="Other">
          {['Rent', 'Utilities', 'Subscriptions', 'Groceries', 'Insurance', 'Other'].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Bill
      </button>

      {/* Feedback message */}
      {visibleMessage && (
        <p className={`text-sm mt-2 ${formState.success ? 'text-green-600' : 'text-red-600'}`}>
          {visibleMessage}
        </p>
      )}
    </form>
  )
}
