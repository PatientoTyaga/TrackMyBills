'use client'

import { useRouter } from 'next/navigation'
import BillList from './bill-list'
import { deleteBill, markBillAsPaid, editBill } from '@/app/actions/server-actions'
import { useBills } from '@/context/bill-context'

function handleActionError(result, router) {
  if (!result.success) {
    if (result.message === 'Unauthorized') {
      router.push('/sign-in')
    } else {
      console.error(result.message)
    }
    return true
  }
  return false
}


export default function BillListWrapper() {
  const { bills, setBills } = useBills()

  const router = useRouter()

  const handleDelete = async (id) => {
    const result = await deleteBill(id)
    if (handleActionError(result, router)) return
    router.refresh()
  }

  const handleMarkAsPaid = async (id) => {
    const result = await markBillAsPaid(id)
    if (handleActionError(result, router)) return
    router.refresh()
  }

  const handleEdit = async (id, newAmount, newDueDate) => {
    const result = await editBill(id, newAmount, newDueDate)
    if (handleActionError(result, router)) return
    router.refresh()
  }

  return (
    <BillList
      bills={bills}
      setBills={setBills}
      onDelete={handleDelete}
      onMarkAsPaid={handleMarkAsPaid}
      onEdit={handleEdit}
    />
  )
}
