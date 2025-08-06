
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const session = await getServerSession()
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    let whereClause = {}
    
    // If user has a company, filter by company
    if (session?.user?.companyId) {
      whereClause.companyId = session.user.companyId
    } else if (companyId) {
      whereClause.companyId = companyId
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            companyEmail: true,
            companyLogo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession()
    const data = await request.json()
    
    // Generate unique invoice ID
    const moduleCode = 'MD'
    const companyCode = 'CP'
    const year = new Date().getFullYear()
    const count = await prisma.invoice.count()
    const invoiceId = `${moduleCode}-${companyCode}-INV-${year}-${(count + 1).toString().padStart(4, '0')}`
    
    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        invoiceId,
        unpaidAmount: data.amount - (data.paidAmount || 0),
        companyId: session?.user?.companyId || data.companyId
      }
    })
    
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
