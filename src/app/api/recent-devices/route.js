import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

export async function GET(request) {
  let prisma
  
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Session user:', session.user)

    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    // Initialize Prisma client
    prisma = new PrismaClient()

    // If companyId is provided, fetch devices for that company's users
    // Otherwise, fetch for the current user
    let whereClause
    if (companyId) {
      // For company view, get devices for all users in that company
      whereClause = {
        user: {
          companyId: companyId
        }
      }
      console.log('Fetching devices for company:', companyId)
    } else {
      // For user view, get devices for current user only
      whereClause = {
        userId: session.user.id
      }
      console.log('Fetching devices for user:', session.user.id)
    }

    console.log('Where clause:', whereClause)

    // First check if we have any devices at all
    const totalDevices = await prisma.loginDevice.count()
    console.log('Total devices in database:', totalDevices)

    // Check devices for current user specifically
    const userDevices = await prisma.loginDevice.count({
      where: { userId: session.user.id }
    })
    console.log('Devices for current user:', userDevices)

    // If checking for company, also check company-specific devices
    if (companyId) {
      const companyDevices = await prisma.loginDevice.count({
        where: {
          user: {
            companyId: companyId
          }
        }
      })
      console.log('Devices for company', companyId, ':', companyDevices)
    }

    // Add timeout and retry logic
    const devices = await Promise.race([
      prisma.loginDevice.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: {
          lastLogin: 'desc'
        },
        take: 20
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 10000)
      )
    ])

    console.log('Found devices:', devices.length)
    console.log('Device details:', devices.map(d => ({ 
      id: d.id, 
      userId: d.userId, 
      browser: d.browser, 
      lastLogin: d.lastLogin 
    })))

    return NextResponse.json(devices)
  } catch (error) {
    console.error('Error fetching recent devices:', error)
    
    // Return empty array instead of error to prevent UI breaking
    if (error.message.includes('timeout') || error.message.includes('reach database')) {
      console.log('Database connection issue, returning empty array')
      return NextResponse.json([])
    }
    
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}