'use client'

export default function BillDueAlert({ bills }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueSoon = bills
    .filter((bill) => {
      const dueDate = new Date(bill.due_date + 'T00:00:00')
      const daysLeft = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24))
      return daysLeft >= 0 && daysLeft <= 3
    })
    .slice(0, 3)

  if (dueSoon.length === 0) return null

  return (
    <div className="mb-6 bg-yellow-50 border border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700 px-4 py-3 rounded-lg">
      {dueSoon.map((bill) => {
        const dueDate = new Date(bill.due_date + 'T00:00:00')
        const daysLeft = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24))

        const dueText =
          daysLeft === 0
            ? 'is due today!'
            : daysLeft === 1
            ? 'is due tomorrow!'
            : `is due in ${daysLeft} days!`

        return (
          <div key={bill.id} className="flex items-center gap-2 mb-1 text-sm">
            <span>🔔</span>
            <span className="font-medium">{bill.name}</span> {dueText}
          </div>
        )
      })}
    </div>
  )
}
