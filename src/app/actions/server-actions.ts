'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.error('[AUTH ERROR]:', error?.message || 'No user found')
    return null
  }

  return user
}

export async function emailLogin(formData: FormData) {
  const supabase = await createClient()
  const cookieStore = await cookies()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('[LOGIN ERROR]:', error.message)
      ; (await cookieStore).set('flash_error', 'Invalid email or password')
    redirect('/sign-in')
  }

  redirect('/user-homepage')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const cookieStore = await cookies()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })

  if (error) {
    console.error('[SIGNUP ERROR]:', error.message)
      ; (await cookieStore).set('flash_error', 'Error signing up. Please try again.')
    redirect('/sign-up')
  }

  revalidatePath('/', 'layout')
  redirect('/sign-in')
}

export async function signOut() {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()

  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/sign-in')
}

export async function deleteUserAccount(userId: string) {
  try {
    const supabase = await createClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    const access_token = sessionData?.session?.access_token

    if (!access_token || sessionError) {
      console.error('[DELETE ACCOUNT ERROR]: Unauthorized or session error')
      return {
        success: false,
        error: 'You are not logged in. Please log in to delete your account.',
        reason: 'not_logged_in',
      }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ user_id: userId }),
    })

    const result = await response.json()

    if (!response.ok) {
      const isUnauthorized = result.error?.toLowerCase().includes('unauthorized')

      return {
        success: false,
        error: result.error || 'Failed to delete user',
        reason: isUnauthorized ? 'user_deleted_or_invalid_token' : 'other_error',
      }
    }

    await supabase.auth.signOut()
    return { success: true }
  } catch (err: any) {
    console.error('[DELETE ACCOUNT ERROR]:', err.message)
    return {
      success: false,
      error: err.message || 'Something went wrong',
      reason: 'network_or_unknown',
    }
  }
}

export async function addBill(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()

  if (!user) {
    return { success: false, message: 'Unauthorized' }
  }

  const bill = {
    name: formData.get('name'),
    due_date: formData.get('due_date'),
    amount: parseFloat(formData.get('amount') as string),
    currency: formData.get('currency'),
    frequency: formData.get('frequency'),
    reminder_days: parseInt(formData.get('reminder_days') as string),
    category: formData.get('category'),
    is_paid: false,
    user_id: user.id,
  }

  const { data, error } = await supabase
    .from('Bills')
    .insert([bill])
    .select()
    .single()

  if (error) {
    console.error('[ADD BILL ERROR]:', error.message)
    return { success: false, message: 'Failed to add bill: ' + error.message }
  }

  revalidatePath('/user-homepage')
  return {
    success: true,
    message: 'Bill added successfully!',
    bill: data,
  }
}

export async function deleteBill(id: string) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()

  if (!user) return { success: false, message: 'Unauthorized' }

  const { error } = await supabase
    .from('Bills')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('[DELETE BILL ERROR]:', error.message)
    return { success: false, message: 'Failed to delete bill: ' + error.message }
  }

  revalidatePath('/user-homepage')
  return { success: true }
}

export async function markBillAsPaid(id: string) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()

  if (!user) return { success: false, message: 'Unauthorized' }

  const { data: billData, error: fetchError } = await supabase
    .from('Bills')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !billData) {
    console.error('[FETCH BILL ERROR]:', fetchError?.message || 'Bill not found')
    return { success: false, message: 'Bill not found or unauthorized' }
  }

  const { error: updateError } = await supabase
    .from('Bills')
    .update({ is_paid: true })
    .eq('id', id)

  if (updateError) {
    console.error('[MARK BILL PAID ERROR]:', updateError.message)
    return { success: false, message: 'Failed to mark bill as paid: ' + updateError.message }
  }

  // Handle recurrence
  if (billData.frequency === 'Monthly' || billData.frequency === 'Yearly') {
    const nextDueDate = new Date(billData.due_date)
    if (billData.frequency === 'Monthly') {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1)
    } else {
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1)
    }

    const newBill = {
      ...billData,
      due_date: nextDueDate.toISOString().split('T')[0],
      is_paid: false,
    }
    delete newBill.id

    const { error: insertError } = await supabase.from('Bills').insert([newBill])
    if (insertError) {
      console.error('[INSERT NEXT BILL ERROR]:', insertError.message)
    }
  }

  revalidatePath('/user-homepage')
  return { success: true }
}

export async function editBill(id: string, amount: string, due_date: string) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()

  if (!user) return { success: false, message: 'Unauthorized' }

  const { error } = await supabase
    .from('Bills')
    .update({
      amount: parseFloat(amount),
      due_date,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('[EDIT BILL ERROR]:', error.message)
    return { success: false, message: 'Failed to edit bill: ' + error.message }
  }

  revalidatePath('/user-homepage')
  return { success: true }
}

export async function updateUsername(newUsername: string) {
  const supabase = await createClient()
  const user = await getAuthenticatedUser()

  if (!user) return { success: false, message: 'Unauthorized' }

  const { error } = await supabase.auth.updateUser({
    data: { username: newUsername },
  })

  if (error) {
    console.error('[UPDATE USERNAME ERROR]:', error.message)
    return { success: false, message: 'Failed to update username: ' + error.message }
  }

  return { success: true, message: 'Username updated successfully!' }
}