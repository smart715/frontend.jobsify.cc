import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const {
      employeeId,
      salutation,
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      dateOfJoining,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      postalCode,
      country,
      emergencyFirstName,
      emergencyLastName,
      emergencyContactPhone,
      salary,
      status,
      employeeType,
      reportingManager,
      notes
    } = await request.json()

    // Generate unique employee ID
    const moduleCode = 'MD'
    const companyCode = 'CP'
    const year = new Date().getFullYear()
    const count = await prisma.employee.count()
    const employeeIdGeneratedValue = `${moduleCode}-${companyCode}-EMP-${year}-${(count + 1).toString().padStart(4, '0')}`

    const employee = await prisma.employee.create({
      data: {
        employeeId: employeeIdGeneratedValue,
        ...(salutation && { salutation }),
        firstName,
        lastName,
        email,
        ...(phone && { phone }),
        ...(department && { department }),
        ...(designation && { designation }),
        ...(dateOfJoining && { dateOfJoining: new Date(dateOfJoining) }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender && { gender }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(postalCode && { postalCode }),
        ...(country && { country }),
        emergencyContactName: emergencyFirstName && emergencyLastName ? `${emergencyFirstName} ${emergencyLastName}` : emergencyFirstName || emergencyLastName || '',
        emergencyContactPhone,
        ...(salary && { salary: parseFloat(salary) }),
        ...(status && { status }),
        ...(employeeType && { employeeType }),
        ...(reportingManager && { reportingManager }),
        ...(notes && { notes }),
        //companyId: session.user.companyId // commenting out as session is not available here
      }
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 })
  }
}