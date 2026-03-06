import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { SessionUser } from '@/types'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-dev-secret-do-not-use-in-prod',
)
const COOKIE_NAME = 'kaqs_session'
const TOKEN_EXPIRY = '7d'

// ─── Token ────────────────────────────────────────────────────────────────────

export async function signToken(user: SessionUser): Promise<string> {
  return new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (
      typeof payload.id === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string'
    ) {
      return { id: payload.id, email: payload.email, role: payload.role }
    }
    return null
  } catch {
    return null
  }
}

// ─── Session helpers (server-side) ───────────────────────────────────────────

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession()
  if (session.role !== 'admin') throw new Error('Forbidden')
  return session
}

export function createSessionCookie(token: string): {
  name: string
  value: string
  options: {
    httpOnly: boolean
    secure: boolean
    sameSite: 'lax'
    maxAge: number
    path: string
  }
} {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    },
  }
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/',
    },
  }
}
