import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import speakeasy from 'speakeasy'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, code, secret, companyId } = await request.json()

    if (session.user.id !== userId && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: code,
      window: 2 // Allow 2 steps of drift
    })

    if (!verified) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    // Enable TOTP for the user
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
        totpSecret: secret,
        isTwoFactorEnabled: true,
        tempTotpSecret: null
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error verifying TOTP code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}