'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function NotFound() {
  const [homeHref, setHomeHref] = useState('/')
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setHomeHref('/user-homepage')
      }
    }
    checkSession()
  }, [])

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col justify-center items-center text-center space-y-6 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-600">404 - Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg">
        The page you’re looking for doesn’t exist or hasn’t been created yet.
      </p>
      <Link
        href={homeHref}
        className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition font-semibold"
      >
        Return to Homepage
      </Link>
    </div>
  )
}
