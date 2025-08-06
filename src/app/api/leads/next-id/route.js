
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const moduleCode = 'MD'
    const companyCode = 'CP'
    const year = new Date().getFullYear()
    const count = await prisma.lead.count()
    const nextId = `${moduleCode}-${companyCode}-LD-${year}-${(count + 1).toString().padStart(4, '0')}`
    
    return NextResponse.json({ nextId })
  } catch (error) {
    console.error('Error generating lead ID:', error)
    return NextResponse.json({ error: 'Failed to generate lead ID' }, { status: 500 })
  }
}
