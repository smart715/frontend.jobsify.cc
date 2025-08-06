
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const employeeId = searchParams.get('employeeId')

    // Build where clause
    const where = {
      companyId: session.user.companyId,
    }

    if (month && year) {
      const startDate = new Date(parseInt(year), new Date(Date.parse(month + ' 1, 2024')).getMonth(), 1)
      const endDate = new Date(parseInt(year), new Date(Date.parse(month + ' 1, 2024')).getMonth() + 1, 0)
      
      where.date = {
        gte: startDate,
        lte: endDate,
      }
    }

    if (employeeId) {
      where.employeeId = employeeId
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { employee: { firstName: 'asc' } },
      ],
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      employees,
      markBy,
      year,
      month,
      date,
      clockIn,
      clockInLocation,
      clockInWorkingFrom,
      clockOut,
      clockOutLocation,
      clockOutWorkingFrom,
      late,
      halfDay,
      attendanceOverwrite,
    } = body

    const attendanceRecords = []

    for (const employeeId of employees) {
      let targetDates = []

      if (markBy === 'Month') {
        // Generate all dates for the month
        const monthIndex = new Date(Date.parse(month + ' 1, 2024')).getMonth()
        const yearInt = parseInt(year)
        const lastDay = new Date(yearInt, monthIndex + 1, 0).getDate()

        for (let day = 1; day <= lastDay; day++) {
          targetDates.push(new Date(yearInt, monthIndex, day))
        }
      } else {
        targetDates = [new Date(date)]
      }

      for (const targetDate of targetDates) {
        // Skip weekends
        const dayOfWeek = targetDate.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) continue

        const attendanceData = {
          employeeId,
          companyId: session.user.companyId,
          date: targetDate,
          clockIn: clockIn || null,
          clockInLocation: clockInLocation || 'Office',
          clockInWorkingFrom: clockInWorkingFrom || 'Office',
          clockOut: clockOut || null,
          clockOutLocation: clockOutLocation || 'Office',
          clockOutWorkingFrom: clockOutWorkingFrom || 'Office',
          isLate: late === 'Yes',
          isHalfDay: halfDay === 'Yes',
          status: 'present',
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        if (attendanceOverwrite) {
          // Use upsert to overwrite existing records
          await prisma.attendance.upsert({
            where: {
              employeeId_date_companyId: {
                employeeId,
                date: targetDate,
                companyId: session.user.companyId,
              },
            },
            update: attendanceData,
            create: attendanceData,
          })
        } else {
          // Only create if doesn't exist
          const existingRecord = await prisma.attendance.findUnique({
            where: {
              employeeId_date_companyId: {
                employeeId,
                date: targetDate,
                companyId: session.user.companyId,
              },
            },
          })

          if (!existingRecord) {
            attendanceRecords.push(attendanceData)
          }
        }
      }
    }

    if (attendanceRecords.length > 0) {
      await prisma.attendance.createMany({
        data: attendanceRecords,
      })
    }

    return NextResponse.json({ 
      message: 'Attendance marked successfully',
      recordsCreated: attendanceRecords.length 
    })
  } catch (error) {
    console.error('Error marking attendance:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
