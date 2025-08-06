
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const leave = await prisma.leave.findUnique({
      where: { id: params.id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    if (!leave) {
      return NextResponse.json({ error: 'Leave not found' }, { status: 404 })
    }
    
    return NextResponse.json(leave)
  } catch (error) {
    console.error('Error fetching leave:', error)
    return NextResponse.json({ error: 'Failed to fetch leave' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    
    const leave = await prisma.leave.update({
      where: { id: params.id },
      data: {
        employeeId: data.employeeId,
        leaveDate: new Date(data.leaveDate),
        duration: data.duration,
        leaveType: data.leaveType,
        status: data.status,
        paid: data.paid
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(leave)
  } catch (error) {
    console.error('Error updating leave:', error)
    return NextResponse.json({ error: 'Failed to update leave' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.leave.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Leave deleted successfully' })
  } catch (error) {
    console.error('Error deleting leave:', error)
    return NextResponse.json({ error: 'Failed to delete leave' }, { status: 500 })
  }
}
