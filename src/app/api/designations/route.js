
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const designation = await prisma.designation.create({
      data: {
        name: body.name,
        description: body.description,
        department: body.department,
        level: body.level,
        companyId: session.user.companyId,
        status: body.status || 'Active'
      }
    })

    return NextResponse.json(designation, { status: 201 })
  } catch (error) {
    console.error('Error creating designation:', error)
    return NextResponse.json(
      { error: 'Failed to create designation' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const designations = await prisma.designation.findMany({
      where: {
        companyId: session.user.companyId
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ designations })
  } catch (error) {
    console.error('Error fetching designations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch designations' },
      { status: 500 }
    )
  }
}
