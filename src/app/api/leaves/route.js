
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const leaves = await prisma.leave.findMany({
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to include employee name
    const transformedLeaves = leaves.map(leave => ({
      ...leave,
      employee: {
        ...leave.employee,
        name: `${leave.employee.firstName} ${leave.employee.lastName}`
      }
    }))

    return NextResponse.json(transformedLeaves)
  } catch (error) {
    console.error('Error fetching leaves:', error)
    return NextResponse.json({ error: 'Failed to fetch leaves' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const {
      employeeId,
      leaveType,
      leaveDate,
      duration,
      status,
      reason,
      paid,
      attachment
    } = await request.json()

    const leave = await prisma.leave.create({
      data: {
        employeeId,
        leaveType,
        leaveDate: new Date(leaveDate),
        duration: duration || 'Full Day',
        status: status || 'Pending',
        reason,
        paid: paid || false,
        attachment
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      }
    })

    return NextResponse.json(leave, { status: 201 })
  } catch (error) {
    console.error('Error creating leave:', error)
    return NextResponse.json({ error: 'Failed to create leave' }, { status: 500 })
  }
}
