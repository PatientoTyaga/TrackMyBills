'use client'

const categoryColors = {
  Rent: 'bg-purple-100 text-purple-800',
  Utilities: 'bg-yellow-100 text-yellow-800',
  Subscriptions: 'bg-blue-100 text-blue-800',
  Groceries: 'bg-green-100 text-green-800',
  Insurance: 'bg-red-100 text-red-800',
  Other: 'bg-gray-200 text-gray-800',
}

export default function CategoryTag({ category = 'Other' }) {
  const classes = categoryColors[category] || categoryColors.Other

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${classes}`}>
      {category}
    </span>
  )
}
