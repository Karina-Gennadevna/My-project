import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken, createSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) {
      // Same error for security — don't reveal whether email exists
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
    }

    const valid = await compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
    }

    const token = await signToken({ id: user.id, email: user.email, role: user.role })
    const cookie = createSessionCookie(token)

    const response = NextResponse.json({ success: true })
    response.cookies.set(cookie.name, cookie.value, cookie.options)
    return response
  } catch (error) {
    console.error('[login]', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
