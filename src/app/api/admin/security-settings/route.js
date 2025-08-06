
// force Node.js runtime so Prisma can run
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get security settings
    const settings = await prisma.securitySettings.findFirst({
      where: {
        companyId: null // Global settings
      }
    })

    return NextResponse.json(settings || {
      twoFactorEnabled: false,
      emailTwoFactorEnabled: false,
      googleAuthEnabled: false,
      recaptchaEnabled: false,
      recaptchaSiteKey: '',
      recaptchaSecretKey: '',
      smtpConfigured: false,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      },
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15
    })
  } catch (error) {
    console.error('Error fetching security settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch security settings' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Upsert security settings
    const settings = await prisma.securitySettings.upsert({
      where: {
        companyId: null
      },
      create: {
        companyId: null,
        ...data
      },
      update: {
        ...data
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error saving security settings:', error)
    return NextResponse.json(
      { error: 'Failed to save security settings' },
      { status: 500 }
    )
  }
}
