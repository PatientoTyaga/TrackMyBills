'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { deleteUserAccount } from '../actions/server-actions'

export default function ProfileClient({ user }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDeleteAccount = () => {
    startTransition(async () => {
      const result = await deleteUserAccount(user.id)

      if (result.success) {
        toast.success('Account deleted successfully')
        router.push('/goodbye')
      } else {
        toast.error('Failed to delete account')
        console.error('Account deletion error:', result.error)
      }
    })
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <div className="mb-6">
        <p><strong>Email:</strong> {user.email}</p>
        <p className="text-sm text-gray-500">Account management options below:</p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => setConfirmDelete(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete My Account
        </button>
      </div>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="mb-4">This action will delete your account and all associated data permanently.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 text-sm bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isPending}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
