'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import AddBillForm from './add-bill-form'

export default function AddBillDialog({ setBills = () => { }, user }) {
  const isAuthenticated = !!user
  
  return (
    <Dialog>
      <DialogTrigger className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
        Add a Bill
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Bill</DialogTitle>
          <DialogDescription>Enter the bill details below.</DialogDescription>
        </DialogHeader>
        <AddBillForm setBills={setBills} isAuthenticated={isAuthenticated} />
      </DialogContent>
    </Dialog>
  )
}
