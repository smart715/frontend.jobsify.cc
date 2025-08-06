
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    
    const whereClause = companyId ? { companyId } : {}
    
    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Generate unique lead ID
    const moduleCode = 'MD'
    const companyCode = 'CP'
    const year = new Date().getFullYear()
    const count = await prisma.lead.count()
    const leadId = `${moduleCode}-${companyCode}-LD-${year}-${(count + 1).toString().padStart(4, '0')}`
    
    const lead = await prisma.lead.create({
      data: {
        leadId,
        companyId: data.companyId,
        contactName: data.contactName || data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        leadSource: data.source || data.leadSource,
        leadOwner: data.leadOwner,
        status: data.status || 'New',
        notes: data.notes,
        image: data.image
      }
    })
    
    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
