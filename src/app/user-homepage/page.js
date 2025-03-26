import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function UserHomePage() {
  // Await the cookies function to get the cookie store
  const cookieStore = await cookies();

  // Create the Supabase client with the awaited cookie store
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Retrieve the session data
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Handle potential errors
  if (error) {
    console.error('Error retrieving session:', error.message);
    // Optionally, redirect or handle the error as needed
    return redirect('/sign-in');
  }

  // Redirect to sign-in page if no session exists
  if (!session) {
    return redirect('/sign-in');
  }

  // Extract user email from session
  const userEmail = session.user.email;

  // Render the user homepage
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl">Welcome back, {userEmail} 👋</h1>
    </div>
  );
}
