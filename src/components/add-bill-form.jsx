'use client'

import currencies from '@/app/utils/currencies'
import { useState } from 'react'

export default function AddBillForm({ setBills }) {
  const [form, setForm] = useState({
    name: '',
    dueDate: '',
    amount: '',
    currency: 'USD',
    frequency: 'One-time',
    reminderDays: 3,
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newBill = {
      ...form,
      id: Date.now(),
      amount: parseFloat(form.amount).toFixed(2),
      isPaid: false,
    }

    const stored = JSON.parse(localStorage.getItem('bills')) || []
    const updated = [...stored, newBill]
    localStorage.setItem('bills', JSON.stringify(updated))
    setBills(updated)
    setForm({
      name: '',
      dueDate: '',
      amount: '',
      currency: 'USD',
      frequency: 'One-time',
      reminderDays: 3,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm">Bill Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
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
            value={form.amount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
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
          <label className="block mb-1 text-sm">Frequency</label>
          <select
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="One-time">One-time</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm">Reminder Days</label>
          <input
            type="number"
            name="reminderDays"
            value={form.reminderDays}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min="0"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Bill
      </button>
    </form>
  )
}
