'use client'

import { useRouter } from 'next/navigation'
import BillList from './bill-list'
import { deleteBill, markBillAsPaid, editBill } from '@/app/actions/server-actions'
import { useBills } from '@/context/bill-context'

export default function BillListWrapper({ bills: billsProp }) {
  const { bills: billsFromHook } = useBills()
  const bills = billsProp ?? billsFromHook

  const router = useRouter()

  const handleDelete = async (id) => {
    const result = await deleteBill(id)
    if (!result.success) {
      console.error(result.message)
    } else {
      router.refresh()
    }
  }

  const handleMarkAsPaid = async (id) => {
    const result = await markBillAsPaid(id)
    if (!result.success) {
      console.error(result.message)
    } else {
      router.refresh()
    }
  }

  const handleEdit = async (id, newAmount, newDueDate) => {
    const result = await editBill(id, newAmount, newDueDate)
    if (!result.success) {
      console.error(result.message)
    } else {
      router.refresh()
    }
  }

  return (
    <BillList
      bills={bills}
      onDelete={handleDelete}
      onMarkAsPaid={handleMarkAsPaid}
      onEdit={handleEdit}
    />
  )
}
