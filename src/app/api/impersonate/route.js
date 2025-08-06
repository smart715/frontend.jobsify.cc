import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { companyId, type } = await request.json()

    if (!companyId || type !== 'company') {
      return NextResponse.json(
        { error: 'Invalid impersonation request' },
        { status: 400 }
      )
    }

    const company = await prisma.company.findUnique({
      where: { companyId },
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const adminUser = await prisma.user.findFirst({
      where: {
        companyId: company.id,
        role: 'ADMIN',
      },
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user for the company not found' },
        { status: 404 }
      )
    }

    const impersonationData = {
      originalUserId: session.user.id,
      originalRole: session.user.role,
      originalEmail: session.user.email,
      impersonatedUserId: adminUser.id,
      impersonatedRole: adminUser.role,
      impersonatedEmail: adminUser.email,
      companyId: company.companyId,
      companyName: company.companyName,
      isImpersonating: true,
      timestamp: Date.now(),
    }

    console.log('🔐 IMPERSONATE: Creating token with data:', {
      originalUser: impersonationData.originalEmail,
      impersonatedUser: impersonationData.impersonatedEmail,
      companyName: impersonationData.companyName,
      isImpersonating: impersonationData.isImpersonating
    })

    const token = jwt.sign(impersonationData, process.env.NEXTAUTH_SECRET, {
      expiresIn: '24h',
    })

    console.log('✅ IMPERSONATE: Token created successfully')

    const response = NextResponse.json({
      success: true,
      message: 'Impersonation started successfully',
      impersonationData: {
        companyName: company.companyName,
        companyId: company.companyId,
        adminEmail: adminUser.email,
        role: adminUser.role,
        isImpersonating: true
      },
    })

    response.cookies.set('impersonation-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    console.log('🍪 IMPERSONATE: Cookie set successfully')

    return response
  } catch (error) {
    console.error('Error during impersonation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
