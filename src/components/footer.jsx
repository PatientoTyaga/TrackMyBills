// app/components/layout/Footer.jsx
export default function Footer() {
    return (
      <footer className="w-full bg-gray-100 dark:bg-gray-800 py-4 mt-12 border-t dark:border-gray-700">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600 dark:text-gray-300">
          &copy; {new Date().getFullYear()} TrackMyBills. All rights reserved.
        </div>
      </footer>
    )
  }
  