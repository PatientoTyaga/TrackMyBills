'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { emailLogin } from '../actions/server-actions'
import { SubmitButton } from '@/components/submit-btn'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const errorFlash = document.cookie
      .split('; ')
      .find((row) => row.startsWith('flash_error='))
    if (errorFlash) {
      const msg = decodeURIComponent(errorFlash.split('=')[1])
      setMessage(msg)
      setIsSuccess(false)

      // Clear the cookie
      document.cookie = 'flash_error=; Max-Age=0; path=/'

      // Auto-clear from state after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    }

    const successFlash = document.cookie
      .split('; ')
      .find((row) => row.startsWith('flash_success='))

    if (successFlash) {
      const msg = decodeURIComponent(successFlash.split('=')[1])
      setMessage(msg)
      setIsSuccess(true)
      document.cookie = 'flash_success=; Max-Age=0; path=/'
      setTimeout(() => setMessage(''), 4000)
    }
  }, [])

  return (

    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        action={emailLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Sign In</h1>

        {message && (
          <p className={`text-sm mb-4 text-center ${isSuccess ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-6 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <SubmitButton type={"In"} />

        <p className="mt-2 text-sm text-center">
          <Link href="/reset-password" className="text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </p>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  )
}
