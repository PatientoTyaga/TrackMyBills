'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleUpdate = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      if(error.message?.toLowerCase().includes('different from the old password')) {
        setMessage(error.message)
      }else {
        setMessage('Failed to update password.')
      }
    } else {
      setMessage('Password updated! Redirecting...')
      setTimeout(() => router.push('/user-homepage'), 2000)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleUpdate}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Update Password</h1>

        {message && (
          <p className="text-sm text-center mb-4 text-blue-600">{message}</p>
        )}

        <input
          type="password"
          placeholder="New password"
          className="w-full px-4 py-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Update Password
        </button>
      </form>
    </div>
  )
}
