
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

// POST - Cancel subscription
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { companyId } = await params

    const subscription = await prisma.companySubscription.update({
      where: { companyId },
      data: { 
        status: 'cancelled',
        endDate: new Date()
      },
      include: {
        package: true
      }
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
