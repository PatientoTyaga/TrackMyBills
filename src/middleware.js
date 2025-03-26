import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const isAuthPage = ['/sign-in', '/sign-up'].includes(req.nextUrl.pathname)
  const isProtectedPage = ['/user-homepage'].includes(req.nextUrl.pathname)

  if (!session && isProtectedPage) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/user-homepage', req.url))
  }

  return res
}

export const config = {
  matcher: ['/user-homepage', '/sign-in', '/sign-up'],
}
