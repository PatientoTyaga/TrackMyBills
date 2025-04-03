'use client'

import dynamic from 'next/dynamic'

// Dynamically import the chart with no SSR
const CategorySummaryChart = dynamic(
  () => import('./category-summary-chart'),
  { ssr: false }
)

export default function CategorySummaryChartWrapper({ bills }) {
  return <CategorySummaryChart bills={bills} />
}
