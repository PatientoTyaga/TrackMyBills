import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 py-4 mt-12 border-t dark:border-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} TrackMyBills. All rights reserved.
        </div>
        <Link
          href="/contact"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Contact Us
        </Link>
      </div>
    </footer>
  )
}