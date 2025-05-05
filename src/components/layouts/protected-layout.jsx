// components/protected-layout.jsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({ children }) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/sign-in')
    }

    return <>{typeof children === 'function' ? children(user) : children}</>
}