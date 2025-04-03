'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signOut } from '@/app/actions/server-actions'

export default function Navbar({ user }) {
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const root = document.documentElement
    setIsDark(root.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    root.classList.toggle('dark')
    setIsDark(!isDark)
  }

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href={user ? '/user-homepage' : '/'}>
          <span className="text-xl font-bold text-blue-600">TrackMyBills</span>
        </Link>

        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="text-sm text-gray-600 dark:text-gray-300 hover:underline">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          {user ? (
            <>
              {/* Avatar linking to profile */}
              <Link href="/profile" className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-semibold hover:opacity-90 transition">
                {user.email?.charAt(0).toUpperCase()}
              </Link>

              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:underline"
                >
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}