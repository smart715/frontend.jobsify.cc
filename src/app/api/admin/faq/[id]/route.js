
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const faq = await prisma.adminFAQ.update({
      where: { id },
      data: {
        title,
        description,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error updating admin FAQ:', error)
    return NextResponse.json(
      { error: 'Failed to update admin FAQ' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    await prisma.adminFAQ.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'FAQ deleted successfully' })
  } catch (error) {
    console.error('Error deleting admin FAQ:', error)
    return NextResponse.json(
      { error: 'Failed to delete admin FAQ' },
      { status: 500 }
    )
  }
}
