'use client'

export default function BillDueAlert({ bills }) {
  if (!bills || bills.length === 0) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueSoonOrOverdue = bills
    .filter((bill) => {
      if (bill.is_paid) return false

      const dueDate = new Date(bill.due_date + 'T00:00:00')
      const daysLeft = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24))

      return daysLeft <= bill.reminder_days || daysLeft < 0
    })
    .slice(0, 5)


  if (dueSoonOrOverdue.length === 0) return null

  return (
    <div className="mb-6 px-4 py-3 rounded-lg border bg-yellow-50 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700">
      {dueSoonOrOverdue.map((bill) => {
        const dueDate = new Date(bill.due_date + 'T00:00:00')
        const daysLeft = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24))

        const isOverdue = daysLeft < 0
        const alertColor = isOverdue ? 'text-red-600 dark:text-red-400' : 'text-yellow-800 dark:text-yellow-100'
        const icon = isOverdue ? '⚠️' : '🔔'

        const dueText = isOverdue
          ? `was due ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} ago!`
          : daysLeft === 0
            ? 'is due today!'
            : daysLeft === 1
              ? 'is due tomorrow!'
              : `is due in ${daysLeft} days!`

        return (
          <div key={bill.id} className={`flex items-center gap-2 mb-1 text-sm ${alertColor}`}>
            <span>{icon}</span>
            <span className="font-medium">{bill.name}</span> {dueText}
          </div>
        )
      })}
    </div>
  )
}
