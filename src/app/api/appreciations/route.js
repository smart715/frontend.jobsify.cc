
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

// Create a singleton Prisma instance
const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient()
}

const prisma = globalForPrisma.prisma

// GET all appreciations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get company ID from session
    const userCompanyId = session.user?.companyId

    if (!userCompanyId) {
      return NextResponse.json(
        { error: 'Company ID not found in session' },
        { status: 400 }
      )
    }

    // Test database connection first
    try {
      await prisma.$connect()
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please check your DATABASE_URL environment variable.' },
        { status: 503 }
      )
    }

    const appreciations = await prisma.appreciation.findMany({
      where: {
        companyId: userCompanyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(appreciations)
  } catch (error) {
    console.error('Error fetching appreciations:', error)
    
    // Check if it's a database connection error
    if (error.code === 'P1001' || error.message.includes("Can't reach database server")) {
      return NextResponse.json(
        { error: 'Database server is unreachable. Please check your database connection.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch appreciations' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST new appreciation
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get company ID from session
    const userCompanyId = session.user?.companyId

    if (!userCompanyId) {
      return NextResponse.json(
        { error: 'Company ID not found in session' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    const appreciation = await prisma.appreciation.create({
      data: {
        award: body.award,
        givenTo: body.givenTo,
        givenOn: new Date(body.givenOn),
        summary: body.summary,
        photo: body.photo?.name || null,
        companyId: userCompanyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(appreciation)
  } catch (error) {
    console.error('Error creating appreciation:', error)
    return NextResponse.json(
      { error: 'Failed to create appreciation' },
      { status: 500 }
    )
  }
}
