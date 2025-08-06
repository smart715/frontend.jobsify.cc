import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, code, phoneNumber, companyId } = await request.json()

    if (session.user.id !== userId && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Find the SMS verification record
    let targetUserId = userId
    if (companyId && session.user.role === 'SUPER_ADMIN') {
      // Super admin verifying SMS for company
      const company = await prisma.company.findUnique({
        where: { id: companyId }
      })
      if (!company) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 })
      }
      const targetUser = await prisma.user.findFirst({
        where: { email: company.adminEmail }
      })
      if (!targetUser) {
        return NextResponse.json({ error: 'Company admin not found' }, { status: 404 })
      }
      targetUserId = targetUser.id
    }

    const smsVerification = await prisma.smsVerification.findUnique({
      where: { userId: targetUserId }
    })

    if (!smsVerification) {
      return NextResponse.json({ error: 'SMS verification not found' }, { status: 404 })
    }

    if (smsVerification.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Verification code expired' }, { status: 400 })
    }

    if (smsVerification.code !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    // Mark SMS as verified and enable SMS 2FA
    await prisma.smsVerification.update({
      where: { userId: targetUserId },
      data: { verified: true }
    })

    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        smsVerified: true,
        phoneNumber: smsVerification.phoneNumber
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error verifying SMS code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}