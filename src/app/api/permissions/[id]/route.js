
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { name, description, category, isActive } = await request.json()

    const updatedPermission = await prisma.feature.update({
      where: { id },
      data: {
        name,
        description,
        category,
        isActive
      }
    })

    return NextResponse.json(updatedPermission)
  } catch (error) {
    console.error('Error updating permission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    await prisma.feature.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Permission deleted successfully' })
  } catch (error) {
    console.error('Error deleting permission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
