
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, email, companyId } = await request.json()

    if (session.user.id !== userId && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Generate a secret
    const secret = speakeasy.generateSecret({
      name: `App (${email})`,
      issuer: 'Your App Name'
    })

    // Generate QR code URL
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)

    // Store the temporary secret in the database (you might want to encrypt this)
    let targetUser
    if (companyId && session.user.role === 'SUPER_ADMIN') {
      // Super admin setting up 2FA for company
      const company = await prisma.company.findUnique({
        where: { id: companyId }
      })
      if (!company) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 })
      }
      targetUser = await prisma.user.findFirst({
        where: { email: company.adminEmail }
      })
    } else {
      // User setting up their own 2FA
      targetUser = await prisma.user.findUnique({
        where: { id: userId }
      })
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        tempTotpSecret: secret.base32
      }
    })

    return NextResponse.json({
      secret: secret.base32,
      qrCodeUrl: qrCodeUrl
    })

  } catch (error) {
    console.error('Error generating TOTP secret:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
