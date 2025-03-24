'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddBillPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    amount: '',
    dueDate: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const existingBills = JSON.parse(localStorage.getItem('bills')) || []
    const newBills = [...existingBills, form]
    localStorage.setItem('bills', JSON.stringify(newBills))

    router.push('/') // Redirect to homepage
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add a New Bill</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Bill Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded"
            placeholder="e.g. Netflix"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount ($)</label>
          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            type="number"
            className="w-full mt-1 p-2 border rounded"
            placeholder="e.g. 12.99"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <input
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            type="date"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Bill
        </button>
      </form>
    </div>
  )
}
