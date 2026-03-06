import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-dev-secret-do-not-use-in-prod',
)
const COOKIE_NAME = 'kaqs_session'

const PROTECTED_PATHS = ['/app', '/admin']
const AUTH_PATHS = ['/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isAuth = AUTH_PATHS.some((p) => pathname.startsWith(p))

  let session = null
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      session = payload
    } catch {
      // invalid / expired token — treat as logged out
    }
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !session) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth page
  if (isAuth && session) {
    const url = request.nextUrl.clone()
    url.pathname = '/app'
    return NextResponse.redirect(url)
  }

  // Admin-only routes
  if (pathname.startsWith('/admin') && session?.role !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/app'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*', '/auth'],
}
