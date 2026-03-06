import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// GET /api/report/[id]/pdf
// Triggers browser print dialog via redirect to the report page with ?print=1
// For true server-side PDF: install puppeteer and uncomment the puppeteer block below.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const assessment = await db.assessment.findFirst({
      where: { id, userId: session.id, status: 'completed' },
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // ── Server-side PDF via puppeteer (optional) ──────────────────────────────
    // Uncomment after: npm install puppeteer
    //
    // const puppeteer = (await import('puppeteer')).default
    // const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    // const page = await browser.newPage()
    // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:3000`
    // await page.goto(`${baseUrl}/app/report/${id}?print=1`, { waitUntil: 'networkidle0' })
    // const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } })
    // await browser.close()
    // return new NextResponse(pdf, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename="kaqs-report-${id}.pdf"`,
    //   },
    // })
    // ──────────────────────────────────────────────────────────────────────────

    // Default: redirect to print-ready report page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    return NextResponse.redirect(`${baseUrl}/app/report/${id}?print=1`)
  } catch (error) {
    console.error('[pdf]', error)
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 })
  }
}
