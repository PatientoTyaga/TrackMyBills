'use client'

import { useBills } from '@/context/bill-context'
import BillDueAlert from './bill-due-alert'

export default function BillDueAlertWithContext() {
  const { bills } = useBills()
  return <BillDueAlert bills={bills} />
}