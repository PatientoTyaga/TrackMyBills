// components/dashboard/dashboard-board-with-context.tsx
'use client'

import { useBills } from '@/context/bill-context'
import DashboardBoard from './dashboard'

export default function DashboardBoardWithContext() {
  const { bills } = useBills()
  return <DashboardBoard bills={bills} />
}