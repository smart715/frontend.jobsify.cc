import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateClientIdWithDB } from '@/utils/clientUtils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import bcrypt from 'bcryptjs'

// Create a singleton Prisma instance
const globalForPrisma = globalThis

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient()
}

const prisma = globalForPrisma.prisma

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const clients = await prisma.client.findMany({
      where: {
        companyId: session.user.companyId // Only get clients for user's company
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Debug logging to check session data
    console.log('Session user data:', session.user)
    console.log('Session user companyId:', session.user?.companyId)

    const body = await request.json()
    const { companyId, ...clientData } = body

    // Use the logged-in user's company ID if available, otherwise use the provided companyId
    let userCompanyId = session.user?.companyId || companyId

    // Ensure we have a valid companyId
    if (!userCompanyId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Company ID is required. User session may not contain company information.',
          type: 'validation'
        },
        { status: 400 }
      )
    }

    console.log('Using companyId for client:', userCompanyId)

    // Default values in case company lookup fails
    let moduleCode = 'MD'
    let companyCode = '0001'

    // Get module and company codes from the company table
    if (userCompanyId) {
      try {
        const company = await prisma.company.findUnique({
          where: { id: userCompanyId },
          select: {
            moduleCode: true,
            companyCode: true
          }
        })

        if (company) {
          moduleCode = company.moduleCode || 'MD'
          companyCode = company.companyCode || '0001'
        }
      } catch (companyError) {
        console.error('Error fetching company details:', companyError)
        // Continue with default values
      }
    }

    // Generate client ID with the retrieved or default codes
    const clientId = await generateClientIdWithDB(
      prisma,
      moduleCode,
      companyCode
    )

    // Use transaction to ensure both client and user (if needed) are created together
    const result = await prisma.$transaction(async (tx) => {
      // Create the client
      const client = await tx.client.create({
        data: {
          clientId,
          companyId: userCompanyId, // Link client to user's company
          ...clientData,
        },
      })

      console.log('Client created with companyId:', client.companyId)

      // Create user account if login is allowed
      let clientUser = null
      if (clientData.loginAllowed && clientData.email) {
        // Generate a default password (in production, you might want to send this via email)
        const defaultPassword = `${clientData.firstName}${Math.floor(Math.random() * 1000)}`
        const hashedPassword = await bcrypt.hash(defaultPassword, 12)

        // Check if user with this email already exists
        const existingUser = await tx.user.findUnique({
          where: { email: clientData.email }
        })

        if (!existingUser) {
          clientUser = await tx.user.create({
            data: {
              firstName: clientData.firstName,
              lastName: clientData.lastName || '',
              email: clientData.email,
              hashedPassword: hashedPassword,
              role: 'EMPLOYEE', // Client role
              companyId: userCompanyId, // Link to same company
              companyName: session.user.companyName || 'Client Company'
            }
          })
        }
      }

      return { client, clientUser, defaultPassword: clientData.loginAllowed ? `${clientData.firstName}${Math.floor(Math.random() * 1000)}` : null }
    })

    let message = 'Client created successfully'
    if (result.clientUser) {
      message += `. User account created with email: ${result.clientUser.email}`
    } else if (clientData.loginAllowed && clientData.email) {
      message += '. Note: User account already exists for this email'
    }

    return NextResponse.json({ 
      success: true, 
      data: result.client,
      user: result.clientUser,
      message: message
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)

    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      const fields = error.meta?.target || []
      
      if (fields.includes('email')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'A client with this email already exists',
            field: 'email',
            type: 'validation'
          },
          { status: 409 }
        )
      }
      
      if (fields.includes('clientId')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Client ID generation failed. Please try again.',
            field: 'clientId',
            type: 'validation'
          },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { 
          success: false,
          error: 'A client with this information already exists',
          type: 'validation'
        },
        { status: 409 }
      )
    }

    // Handle other Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Related record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create client. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}