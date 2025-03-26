import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function UserHomePage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    console.error('Error retrieving session:', error.message)
    return redirect('/sign-in')
  }

  if (!session) {
    return redirect('/sign-in')
  }

  const { data: bills, error: billsError } = await supabase
    .from('Bills')
    .select('*')
    .order('due_date', { ascending: true })

  if (billsError) {
    console.error('Error fetching bills:', billsError.message)
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-6">Welcome back, {session.user.email} 👋</h1>

      <h2 className="text-lg font-medium mb-2">Your Bills:</h2>

      {bills?.length ? (
        <ul className="space-y-3">
          {bills.map((bill) => (
            <li key={bill.id} className="border p-4 rounded shadow-sm">
              <div className="font-bold text-blue-600">{bill.name}</div>
              <div className="text-sm text-gray-600">
                Due: {new Date(bill.due_date).toLocaleDateString()} | {bill.amount} {bill.currency}
              </div>
              <div className="text-sm text-gray-500">Frequency: {bill.frequency}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No bills found.</p>
      )}
    </div>
  )
}
