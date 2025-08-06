
// force Node.js runtime so Prisma can run
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.ecommerceSettings.findUnique({
      where: { companyId: session.user.companyId }
    })

    if (!settings) {
      // Create default settings
      const defaultSettings = await prisma.ecommerceSettings.create({
        data: {
          companyId: session.user.companyId,
          storeName: `${session.user.companyName || 'My'} Store`,
          currency: 'USD',
          weightUnit: 'kg',
          timezone: 'America/New_York',
          enableGuestCheckout: true,
          enableAccountCreation: true,
          trackInventory: true,
          lowStockThreshold: 10
        }
      })
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching e-commerce settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const settings = await prisma.ecommerceSettings.upsert({
      where: { companyId: session.user.companyId },
      update: data,
      create: {
        companyId: session.user.companyId,
        ...data
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating e-commerce settings:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
