'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check current theme on initial load
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
        <Link href="/">
          <span className="text-xl font-bold text-blue-600">TrackMyBills</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/add-bill" className="text-sm hover:underline">
            Add Bill
          </Link>

          <button
            onClick={toggleTheme}
            className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <Link href="/signin" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
            Sign In
          </Link>

          <Link
            href="/signup"
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}
