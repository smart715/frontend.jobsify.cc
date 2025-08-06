
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { sendSMS, generateSMSCode, formatPhoneNumber } from '../../../../utils/sms'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { phoneNumber, userId, companyId } = await request.json()

    if (session.user.id !== userId && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Format phone number and generate code
    const formattedPhone = formatPhoneNumber(phoneNumber)
    const code = generateSMSCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store the code in the database
    let targetUserId = userId
    if (companyId && session.user.role === 'SUPER_ADMIN') {
      // Super admin setting up 2FA for company
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

    await prisma.smsVerification.upsert({
      where: { userId: targetUserId },
      update: {
        phoneNumber: formattedPhone,
        code: code,
        expiresAt: expiresAt,
        verified: false
      },
      create: {
        userId: targetUserId,
        phoneNumber: formattedPhone,
        code: code,
        expiresAt: expiresAt,
        verified: false
      }
    })

    // Send SMS using Twilio
    const smsResult = await sendSMS(formattedPhone, `Your verification code is: ${code}`)
    
    if (!smsResult.success) {
      return NextResponse.json(
        { error: 'Failed to send SMS' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error sending SMS code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
