import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// POST /api/assessment — create or return existing draft
export async function POST(_request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check for existing draft
    const existing = await db.assessment.findFirst({
      where: { userId: session.id, status: 'draft' },
      orderBy: { createdAt: 'desc' },
    })

    if (existing) {
      return NextResponse.json({ id: existing.id, status: existing.status, currentStep: existing.currentStep })
    }

    const assessment = await db.assessment.create({
      data: { userId: session.id },
    })

    return NextResponse.json(
      { id: assessment.id, status: assessment.status, currentStep: assessment.currentStep },
      { status: 201 },
    )
  } catch (error) {
    console.error('[assessment POST]', error)
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 })
  }
}

// GET /api/assessment — list user's assessments
export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const assessments = await db.assessment.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        currentStep: true,
        maturityLevel: true,
        scores: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(assessments)
  } catch (error) {
    console.error('[assessment GET]', error)
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 })
  }
}
