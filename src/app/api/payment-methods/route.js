
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

// GET - Fetch payment methods for a company
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(paymentMethods)
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new payment method
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { companyId, cardNumber, cardholderName, expiryMonth, expiryYear, cardType, isDefault } = data

    if (!companyId || !cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cardType) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Store only last 4 digits for security
    const maskedCardNumber = '**** **** **** ' + cardNumber.slice(-4)

    // If this is set as default, update other cards to not be default
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { companyId },
        data: { isDefault: false }
      })
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        companyId,
        cardNumber: maskedCardNumber,
        cardholderName,
        expiryMonth,
        expiryYear,
        cardType,
        isDefault: isDefault || false
      }
    })

    return NextResponse.json(paymentMethod, { status: 201 })
  } catch (error) {
    console.error('Error creating payment method:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
