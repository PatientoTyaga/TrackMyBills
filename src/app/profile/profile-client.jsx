'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { deleteUserAccount, updateUsername } from '../actions/server-actions'

export default function ProfileClient({ user }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [inputUsername, setInputUsername] = useState(user.user_metadata.username || '')
  const [displayName, setDisplayName] = useState(user.user_metadata.username || '')
  const [isPending, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleDeleteAccount = () => {
    startTransition(async () => {
      const result = await deleteUserAccount(user.id)

      if (result.success) {
        toast.success('Account deleted successfully')
        router.push('/goodbye')
      } else {
        console.error('Account deletion error:', result.error)

        if (result.reason === 'not_logged_in') {
          toast.error('You must be logged in to delete your account.')
          router.push('/sign-in')
        } else if (result.reason === 'user_deleted_or_invalid_token') {
          toast.error('Your session is no longer valid. Please log in again.')
          router.push('/sign-in')
        } else {
          toast.error('Something went wrong deleting your account.')
        }
      }
    })
  }

  const handleUsernameUpdate = async () => {
    if (!inputUsername.trim()) return toast.error('Username cannot be empty')

    setSaving(true)
    const result = await updateUsername(inputUsername.trim())
    setSaving(false)

    if (result.success) {
      toast.success('Username updated')
      setDisplayName(inputUsername.trim())
      setInputUsername('')
      router.refresh()
    } else {
      toast.error(result.message || 'Update failed')

      if (result.message === 'Unauthorized') {
        router.push('/sign-in')
      } else {
        console.error('Username update error:', result.message)
      }
    }
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">{displayName}'s Profile</h1>

      <div className="mb-6">
        <p><strong>Email:</strong> {user.email}</p>
        <label className="block mt-4 text-sm font-semibold">Username</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={handleUsernameUpdate}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Edit your display name above.</p>
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
