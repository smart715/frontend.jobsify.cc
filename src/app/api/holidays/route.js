import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const holidays = await prisma.holiday.findMany({
      where: {
        companyId: session.user.companyId
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json({ holidays }, { status: 200 })
  } catch (error) {
    console.error('Error fetching holidays:', error)
    return NextResponse.json({ error: 'Failed to fetch holidays' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, date, type, description, status } = await request.json()

    if (!name || !date || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const holiday = await prisma.holiday.create({
      data: {
        name,
        date: new Date(date),
        type,
        description: description || '',
        status: status || 'Active',
        companyId: session.user.companyId
      }
    })

    return NextResponse.json({ holiday }, { status: 201 })
  } catch (error) {
    console.error('Error creating holiday:', error)
    return NextResponse.json({ error: 'Failed to create holiday' }, { status: 500 })
  }
}