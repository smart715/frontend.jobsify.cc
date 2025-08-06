
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Generate unique report ID
    const moduleCode = 'MD'
    const companyCode = 'CP'
    const year = new Date().getFullYear()
    const count = await prisma.report.count()
    const reportId = `${moduleCode}-${companyCode}-RPT-${year}-${(count + 1).toString().padStart(4, '0')}`
    
    const report = await prisma.report.create({
      data: {
        ...data,
        reportId
      }
    })
    
    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 })
  }
}
