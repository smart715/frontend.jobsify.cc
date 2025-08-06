
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch a specific assignment
export async function GET(request, { params }) {
  try {
    const assignment = await prisma.moduleFeatureAssignment.findUnique({
      where: { id: params.id },
      include: {
        module: true,
        feature: true,
        user: true
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignment' },
      { status: 500 }
    )
  }
}

// PUT - Update a specific assignment
export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    
    const assignment = await prisma.moduleFeatureAssignment.update({
      where: { id: params.id },
      data: {
        enabled: data.enabled !== undefined ? data.enabled : undefined,
        sortOrder: data.sortOrder !== undefined ? data.sortOrder : undefined,
        permissions: data.permissions !== undefined ? data.permissions : undefined,
        customLabel: data.customLabel !== undefined ? data.customLabel : undefined
      },
      include: {
        module: true,
        feature: true
      }
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an assignment
export async function DELETE(request, { params }) {
  try {
    await prisma.moduleFeatureAssignment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Assignment deleted successfully' })
  } catch (error) {
    console.error('Error deleting assignment:', error)
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    )
  }
}
