'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleReset = async (e) => {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/update-password`,
    })

    if (error) {
      setMessage('Failed to send reset email. Please try again.')
    } else {
      setMessage('Password reset email sent! Check your inbox.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleReset}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Reset Password</h1>

        {message && (
          <p className="text-sm text-center mb-4 text-blue-600">{message}</p>
        )}

        <input
          type="email"
          placeholder="Your email"
          className="w-full px-4 py-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Send Reset Email
        </button>
      </form>
    </div>
  )
}
