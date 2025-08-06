
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { companyId, password } = await request.json()

    if (!companyId || !password) {
      return NextResponse.json(
        { success: false, error: 'Company ID and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Find the company
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    })

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }

    // Update the admin user's password
    const updatedUser = await prisma.user.update({
      where: { 
        email: company.adminEmail 
      },
      data: {
        hashedPassword: hashedPassword,
        emailVerified: new Date() // Mark as verified since admin is setting password
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Password set successfully'
    })

  } catch (error) {
    console.error('Error setting password:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to set password',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
