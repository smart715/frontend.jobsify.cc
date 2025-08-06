import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const holiday = await prisma.holiday.findFirst({
      where: {
        id: parseInt(id),
        companyId: session.user.companyId
      }
    })

    if (!holiday) {
      return NextResponse.json({ error: 'Holiday not found' }, { status: 404 })
    }

    return NextResponse.json({ holiday }, { status: 200 })
  } catch (error) {
    console.error('Error fetching holiday:', error)
    return NextResponse.json({ error: 'Failed to fetch holiday' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { name, date, type, description, status } = await request.json()

    if (!name || !date || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const holiday = await prisma.holiday.updateMany({
      where: {
        id: parseInt(id),
        companyId: session.user.companyId
      },
      data: {
        name,
        date: new Date(date),
        type,
        description: description || '',
        status: status || 'Active'
      }
    })

    if (holiday.count === 0) {
      return NextResponse.json({ error: 'Holiday not found' }, { status: 404 })
    }

    const updatedHoliday = await prisma.holiday.findFirst({
      where: {
        id: parseInt(id),
        companyId: session.user.companyId
      }
    })

    return NextResponse.json({ holiday: updatedHoliday }, { status: 200 })
  } catch (error) {
    console.error('Error updating holiday:', error)
    return NextResponse.json({ error: 'Failed to update holiday' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const deletedHoliday = await prisma.holiday.deleteMany({
      where: {
        id: parseInt(id),
        companyId: session.user.companyId
      }
    })

    if (deletedHoliday.count === 0) {
      return NextResponse.json({ error: 'Holiday not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Holiday deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting holiday:', error)
    return NextResponse.json({ error: 'Failed to delete holiday' }, { status: 500 })
  }
}