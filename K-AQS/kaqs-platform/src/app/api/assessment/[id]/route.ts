import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { calculateResult } from '@/lib/scoring'
import { generateAIReport } from '@/lib/ai-report'
import type { Module } from '@/types'

// GET /api/assessment/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const assessment = await db.assessment.findFirst({
      where: { id, userId: session.id },
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...assessment,
      answers: JSON.parse(assessment.answers),
      scores: assessment.scores ? JSON.parse(assessment.scores) : null,
      risks: assessment.risks ? JSON.parse(assessment.risks) : null,
    })
  } catch (error) {
    console.error('[assessment GET id]', error)
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 })
  }
}

// PATCH /api/assessment/[id] — save answers and progress
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const { answers, currentStep, submit } = body as {
      answers?: Record<string, number>
      currentStep?: number
      submit?: boolean
    }

    const assessment = await db.assessment.findFirst({
      where: { id, userId: session.id },
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (assessment.status === 'completed' && !submit) {
      return NextResponse.json({ error: 'Assessment already completed' }, { status: 400 })
    }

    const currentAnswers = JSON.parse(assessment.answers) as Record<string, number>
    const mergedAnswers = { ...currentAnswers, ...(answers ?? {}) }

    const updateData: Record<string, unknown> = {
      answers: JSON.stringify(mergedAnswers),
    }

    if (currentStep !== undefined) updateData.currentStep = currentStep

    // If submitting — calculate results and generate AI report
    if (submit) {
      const result = calculateResult(mergedAnswers)
      const aiReport = await generateAIReport(result, mergedAnswers)

      updateData.status = 'completed'
      updateData.currentStep = 5
      updateData.maturityLevel = result.maturityLevel
      updateData.scores = JSON.stringify({
        K: result.modules.K.score,
        A: result.modules.A.score,
        Q: result.modules.Q.score,
        S: result.modules.S.score,
        total: result.totalScore,
        modules: result.modules,
        maturityLevel: result.maturityLevel,
        maturityLabel: result.maturityLabel,
        executiveSummary: aiReport.executiveSummary,
        moduleInterpretations: aiReport.moduleInterpretations,
        roadmap: aiReport.roadmap,
        aiLayerRecommendations: aiReport.aiLayerRecommendations,
      })
      updateData.risks = JSON.stringify(result.risks)
    }

    const updated = await db.assessment.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      id: updated.id,
      status: updated.status,
      currentStep: updated.currentStep,
    })
  } catch (error) {
    console.error('[assessment PATCH]', error)
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 })
  }
}
