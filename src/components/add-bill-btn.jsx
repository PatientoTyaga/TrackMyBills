'use client'

import Link from 'next/link'

export default function AddBillBtn() {
    return (
        <Link href="/add-bill">
            <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                + Add New Bill
            </button>
        </Link>
    )
}
