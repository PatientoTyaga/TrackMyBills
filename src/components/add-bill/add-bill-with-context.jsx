// components/add-bill/add-bill-dialog-with-context.tsx
'use client'

import { useBills } from '@/context/bill-context'
import AddBillDialog from './add-bill-dialog'

export default function AddBillDialogWithContext({ user }) {
  const { setBills } = useBills()

  return <AddBillDialog setBills={setBills} user={user} />
}