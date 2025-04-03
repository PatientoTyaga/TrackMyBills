'use client'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ type }) {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={pending}
        >
            {pending ? `Signing ${type}...` : `Sign ${type}`}
        </button>
    )
}
