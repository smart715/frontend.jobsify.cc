
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

// GET - Fetch department by ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const department = await prisma.department.findUnique({
      where: {
        id,
        companyId: session.user.companyId
      }
    })

    if (!department) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(department)
  } catch (error) {
    console.error('Error fetching department:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update department
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { name, description, status } = await request.json()

    if (!name) {
      return NextResponse.json(
        { message: 'Department name is required' },
        { status: 400 }
      )
    }

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: {
        id,
        companyId: session.user.companyId
      }
    })

    if (!existingDepartment) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      )
    }

    // Check if another department with the same name exists
    const duplicateDepartment = await prisma.department.findFirst({
      where: {
        name,
        companyId: session.user.companyId,
        id: { not: id }
      }
    })

    if (duplicateDepartment) {
      return NextResponse.json(
        { message: 'Department with this name already exists' },
        { status: 400 }
      )
    }

    const department = await prisma.department.update({
      where: { id },
      data: {
        name,
        description: description || '',
        status: status || 'Active'
      }
    })

    return NextResponse.json(department)
  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete department
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if department exists
    const existingDepartment = await prisma.department.findUnique({
      where: {
        id,
        companyId: session.user.companyId
      }
    })

    if (!existingDepartment) {
      return NextResponse.json(
        { message: 'Department not found' },
        { status: 404 }
      )
    }

    // Check if any employees are assigned to this department
    const employeesInDepartment = await prisma.employee.findMany({
      where: {
        departmentId: id
      }
    })

    if (employeesInDepartment.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete department with assigned employees' },
        { status: 400 }
      )
    }

    await prisma.department.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Department deleted successfully' })
  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
