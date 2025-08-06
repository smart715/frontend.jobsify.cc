import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch a specific feature
export async function GET(request, { params }) {
  try {
    const feature = await prisma.feature.findUnique({
      where: { id: params.id }
    })

    if (!feature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(feature)
  } catch (error) {
    console.error('Error fetching feature:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature' },
      { status: 500 }
    )
  }
}

// PUT - Update a feature
export async function PUT(request, { params }) {
  try {
    const data = await request.json()

    const feature = await prisma.feature.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description || null,
        category: data.category || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: data.sortOrder || null
      }
    })

    return NextResponse.json(feature)
  } catch (error) {
    console.error('Error updating feature:', error)
    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a feature
export async function DELETE(request, { params }) {
  try {
    await prisma.feature.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Feature deleted successfully' })
  } catch (error) {
    console.error('Error deleting feature:', error)
    return NextResponse.json(
      { error: 'Failed to delete feature' },
      { status: 500 }
    )
  }
}