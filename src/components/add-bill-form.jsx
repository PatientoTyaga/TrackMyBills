'use client'

import currencies from '@/app/utils/currencies'
import { useState } from 'react'

const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD', 'BIF', 'KES']

export default function AddBillForm({ setBills }) {
  const [form, setForm] = useState({
    name: '',
    dueDate: '',
    amount: '',
    currency: 'USD',
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
    }

    const stored = JSON.parse(localStorage.getItem('bills')) || []
    const updated = [...stored, newBill]
    localStorage.setItem('bills', JSON.stringify(updated))
    setBills(updated)
    setForm({ name: '', dueDate: '', amount: '', currency: 'USD' })
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

          <select>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.flag} {currency.code} - {currency.name}
              </option>
            ))}
          </select>

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
