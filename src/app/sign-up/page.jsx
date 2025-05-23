// app/signup/page.jsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { signup } from '../actions/server-actions'
import { SubmitButton } from '@/components/submit-btn'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const flash = document.cookie
      .split('; ')
      .find((row) => row.startsWith('flash_error='))
    if (flash) {
      const msg = decodeURIComponent(flash.split('=')[1])
      setMessage(msg)

      // Clear the cookie
      document.cookie = 'flash_error=; Max-Age=0; path=/'

      // Auto-clear from state after 3 seconds
      setTimeout(() => setMessage(''), 3000)
    }
  }, [])

  const handleSubmit = (e) => {
    if (password.length < 6) {
      e.preventDefault()
      setMessage('Password must be at least 6 characters long')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        action={signup}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Sign Up</h1>

        {message && <p className="text-red-500 text-sm mb-4 text-center">{message}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full px-4 py-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 pr-10 border rounded bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {password.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        <SubmitButton type={"Up"} />

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}