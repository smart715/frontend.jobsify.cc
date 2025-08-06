
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

// GET appreciation by ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userCompanyId = session.user?.companyId
    if (!userCompanyId) {
      return NextResponse.json(
        { error: 'Company ID not found in session' },
        { status: 400 }
      )
    }

    const { id } = params
    
    const appreciation = await prisma.appreciation.findFirst({
      where: {
        id: parseInt(id),
        companyId: userCompanyId,
      },
    })

    if (!appreciation) {
      return NextResponse.json(
        { error: 'Appreciation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(appreciation)
  } catch (error) {
    console.error('Error fetching appreciation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appreciation' },
      { status: 500 }
    )
  }
}

// PUT update appreciation
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userCompanyId = session.user?.companyId
    if (!userCompanyId) {
      return NextResponse.json(
        { error: 'Company ID not found in session' },
        { status: 400 }
      )
    }

    const { id } = params
    const body = await request.json()
    
    // First check if the appreciation exists and belongs to the user's company
    const existingAppreciation = await prisma.appreciation.findFirst({
      where: {
        id: parseInt(id),
        companyId: userCompanyId,
      },
    })

    if (!existingAppreciation) {
      return NextResponse.json(
        { error: 'Appreciation not found or access denied' },
        { status: 404 }
      )
    }
    
    const appreciation = await prisma.appreciation.update({
      where: {
        id: parseInt(id),
      },
      data: {
        award: body.award,
        givenTo: body.givenTo,
        givenOn: new Date(body.givenOn),
        summary: body.summary,
        photo: body.photo?.name || body.photo,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(appreciation)
  } catch (error) {
    console.error('Error updating appreciation:', error)
    return NextResponse.json(
      { error: 'Failed to update appreciation' },
      { status: 500 }
    )
  }
}

// DELETE appreciation
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    await prisma.appreciation.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ message: 'Appreciation deleted successfully' })
  } catch (error) {
    console.error('Error deleting appreciation:', error)
    return NextResponse.json(
      { error: 'Failed to delete appreciation' },
      { status: 500 }
    )
  }
}
