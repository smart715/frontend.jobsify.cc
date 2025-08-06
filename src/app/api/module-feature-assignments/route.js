
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch module-feature assignments for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const companyId = searchParams.get('companyId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const assignments = await prisma.moduleFeatureAssignment.findMany({
      where: {
        userId: userId,
        ...(companyId && { companyId })
      },
      include: {
        module: true,
        feature: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}

// POST - Create a new module-feature assignment
export async function POST(request) {
  try {
    const data = await request.json()
    
    const assignment = await prisma.moduleFeatureAssignment.create({
      data: {
        moduleId: data.moduleId,
        featureId: data.featureId,
        userId: data.userId,
        companyId: data.companyId || null,
        enabled: data.enabled !== undefined ? data.enabled : true,
        sortOrder: data.sortOrder || null,
        permissions: data.permissions || null,
        customLabel: data.customLabel || null
      },
      include: {
        module: true,
        feature: true
      }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}

// PUT - Bulk update assignments
export async function PUT(request) {
  try {
    const { assignments } = await request.json()
    
    const updatePromises = assignments.map(assignment => 
      prisma.moduleFeatureAssignment.update({
        where: { id: assignment.id },
        data: {
          enabled: assignment.enabled,
          sortOrder: assignment.sortOrder,
          permissions: assignment.permissions || null,
          customLabel: assignment.customLabel || null
        }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ message: 'Assignments updated successfully' })
  } catch (error) {
    console.error('Error updating assignments:', error)
    return NextResponse.json(
      { error: 'Failed to update assignments' },
      { status: 500 }
    )
  }
}
