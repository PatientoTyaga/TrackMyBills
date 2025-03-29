'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function GoodbyePage() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center text-center p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.h1
        className="text-3xl font-bold mb-4 text-red-600"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Account Deleted
      </motion.h1>
      <motion.p
        className="text-gray-600 dark:text-gray-300 max-w-lg mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        We're sorry to see you go. If you change your mind, you're always welcome to come back. Take care! 👋
      </motion.p>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Return to Homepage
        </Link>
      </motion.div>
    </motion.div>
  )
}
