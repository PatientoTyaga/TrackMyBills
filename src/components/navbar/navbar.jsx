'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signOut } from '@/app/actions/server-actions'
import { Menu, X } from 'lucide-react' // icons for hamburger and close

export default function Navbar({ user }) {
  const [isDark, setIsDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[Navbar] Tab became visible, refreshing')
        router.refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [router])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const root = document.documentElement

    if (savedTheme === 'dark') {
      root.classList.add('dark')
      setIsDark(true)
    } else {
      root.classList.remove('dark')
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const nowDark = root.classList.toggle('dark')
    localStorage.setItem('theme', nowDark ? 'dark' : 'light')
    setIsDark(nowDark)
  }

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href={user ? '/user-homepage' : '/'}>
          <span className="text-xl font-bold text-blue-600">TrackMyBills</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="text-sm px-3 py-1.5 rounded hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition cursor-pointer"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          {user ? (
            <>
              <Link href="/profile" className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-semibold hover:opacity-90 transition">
                {user.email?.charAt(0).toUpperCase()}
              </Link>
              <form action={signOut}>
                <button type="submit" className="text-sm text-red-600 hover:underline">
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm px-3 py-1.5 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden text-gray-600 dark:text-gray-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu with animation */}
      <div
        className={`sm:hidden px-4 transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="space-y-3">
          <button
            onClick={toggleTheme}
            className="block w-full text-left text-sm px-3 py-1.5 rounded hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition cursor-pointer"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          {user ? (
            <>
              <Link href="/profile" className="block text-sm text-blue-600 font-semibold">
                Profile
              </Link>
              <form action={signOut}>
                <button type="submit" className="block text-sm text-red-600 hover:underline">
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="block text-sm px-3 py-1.5 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="block text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition w-fit"
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
