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

    const { userId } = await request.json()

    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Disable 2FA for the user
    let targetUserId = userId
    if (companyId && session.user.role === 'SUPER_ADMIN') {
      // Super admin disabling 2FA for company
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

    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        totpSecret: null,
        totpEnabled: false,
        smsEnabled: false,
        tempTotpSecret: null
      }
    })

    // Remove SMS verification records
    await prisma.smsVerification.deleteMany({
      where: { userId: targetUserId }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error disabling 2FA:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}