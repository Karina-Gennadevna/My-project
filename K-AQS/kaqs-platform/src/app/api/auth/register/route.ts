import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken, createSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Некорректный email' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Пароль должен содержать не менее 8 символов' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 })
    }

    const passwordHash = await hash(password, 12)
    const isAdmin = email.toLowerCase() === (process.env.ADMIN_EMAIL ?? '').toLowerCase()

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: isAdmin ? 'admin' : 'user',
      },
    })

    const token = await signToken({ id: user.id, email: user.email, role: user.role })
    const cookie = createSessionCookie(token)

    const response = NextResponse.json({ success: true }, { status: 201 })
    response.cookies.set(cookie.name, cookie.value, cookie.options)
    return response
  } catch (error) {
    console.error('[register]', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
