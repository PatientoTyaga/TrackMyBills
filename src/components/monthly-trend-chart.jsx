'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'

export default function MonthlyTrendChart({ bills }) {
  // Filter unpaid bills
  const unpaidBills = bills.filter((bill) => !bill.is_paid)

  // Count bills per month (regardless of currency)
  const monthlyCounts = unpaidBills.reduce((acc, bill) => {
    const date = new Date(bill.due_date)
    const monthKey = format(date, 'yyyy-MM')
    acc[monthKey] = (acc[monthKey] || 0) + 1
    return acc
  }, {})

  // Convert to sorted array of { month, count }
  const data = Object.entries(monthlyCounts)
    .map(([month, count]) => ({
      month: format(parseISO(`${month}-01`), 'MMM yyyy'),
      count,
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">📈 Unpaid Bill Count by Month</h3>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No unpaid bills to analyze.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => `${value} bills`} />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
