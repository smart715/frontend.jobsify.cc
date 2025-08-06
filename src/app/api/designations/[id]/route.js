
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Check if designation exists and belongs to user's company
    const existingDesignation = await prisma.designation.findFirst({
      where: {
        id: id,
        companyId: session.user.companyId
      }
    })

    if (!existingDesignation) {
      return NextResponse.json({ error: 'Designation not found' }, { status: 404 })
    }

    const designation = await prisma.designation.update({
      where: {
        id: id
      },
      data: {
        name: body.name,
        description: body.description,
        department: body.department,
        level: body.level,
        status: body.status || 'Active'
      }
    })

    return NextResponse.json(designation)
  } catch (error) {
    console.error('Error updating designation:', error)
    return NextResponse.json(
      { error: 'Failed to update designation' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if designation exists and belongs to user's company
    const existingDesignation = await prisma.designation.findFirst({
      where: {
        id: id,
        companyId: session.user.companyId
      }
    })

    if (!existingDesignation) {
      return NextResponse.json({ error: 'Designation not found' }, { status: 404 })
    }

    await prisma.designation.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: 'Designation deleted successfully' })
  } catch (error) {
    console.error('Error deleting designation:', error)
    return NextResponse.json(
      { error: 'Failed to delete designation' },
      { status: 500 }
    )
  }
}
