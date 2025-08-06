
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const moduleCode = 'MD'
    const companyCode = 'CP'
    const year = new Date().getFullYear()
    const count = await prisma.employee.count()
    const nextId = `${moduleCode}-${companyCode}-EMP-${year}-${(count + 1).toString().padStart(4, '0')}`
    
    return NextResponse.json({ nextId })
  } catch (error) {
    console.error('Error generating employee ID:', error)
    return NextResponse.json({ error: 'Failed to generate employee ID' }, { status: 500 })
  }
}
