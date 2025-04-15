'use client'

import { useBills } from '@/context/bill-context'
import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d0ed57']

export default function CategorySummaryChart() {
  const { bills } = useBills()
  const [showAll, setShowAll] = useState(false)

  const filteredBills = showAll ? bills : bills.filter((bill) => !bill.is_paid)

  const categoryCounts = filteredBills.reduce((acc, bill) => {
    const category = bill.category || 'Other'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }))

  const total = chartData.reduce((sum, entry) => sum + entry.value, 0)

  const topCategory = chartData.length
    ? chartData.reduce((a, b) => (a.value > b.value ? a : b)).name
    : null

  const suggestion = topCategory
    ? `You tend to have most bills under "${topCategory}" — consider reviewing them monthly.`
    : null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {showAll ? '📊 All Bills by Category' : '📊 Unpaid Bills by Category'}
        </h3>
        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          {showAll ? 'Show Unpaid Only' : 'Show All Bills'}
        </button>
      </div>

      {chartData.length === 0 ? (
        <p className="text-sm text-gray-500">No bills to visualize.</p>
      ) : (
        <>
          {/* 👇 Scroll hint (mobile only) */}
          <p className="text-xs text-center text-gray-400 md:hidden mb-2">
            ← Scroll to explore more →
          </p>

          <div className="flex flex-col md:flex-row gap-6 overflow-x-auto scroll-smooth pr-4">
            <div className="min-w-[300px] max-w-full">
              <PieChart width={320} height={320}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={5}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} bills`, `${name} (${((value / total) * 100).toFixed(1)}%)`]}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </div>

            {suggestion && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center md:text-left">
                  💡 <strong>Insight:</strong> {suggestion}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
