'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function ProfilePage() {
  const supabase = createPagesBrowserClient()
  const [session, setSession] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) router.push('/sign-in')
      setSession(session)
    }
    getSession()
  }, [router, supabase])

  const handleDeleteAccount = async () => {
    if (!session) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`, // Auth token to verify identity
        },
        body: JSON.stringify({ user_id: session.user.id }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user')
      }

      await supabase.auth.signOut()
      toast.success('Account deleted successfully')
      router.push('/goodbye')
    } catch (error) {
      console.error('Account deletion error:', error.message)
      toast.error('Failed to delete account')
    }
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <div className="mb-6">
        <p><strong>Email:</strong> {session?.user?.email}</p>
        <p className="text-sm text-gray-500">Account management options below:</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Future: Add more editable fields here */}

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
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Yes, Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}