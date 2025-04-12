import { NextResponse } from 'next/server'

export function syncCookies(from: NextResponse, to: NextResponse) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie.name, cookie.value)
  }
}