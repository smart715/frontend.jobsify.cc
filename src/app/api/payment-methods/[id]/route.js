
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

// PUT - Update payment method
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()
    const { cardholderName, expiryMonth, expiryYear, isDefault } = data

    // If this is set as default, update other cards to not be default
    if (isDefault) {
      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id }
      })
      
      if (paymentMethod) {
        await prisma.paymentMethod.updateMany({
          where: { 
            companyId: paymentMethod.companyId,
            id: { not: id }
          },
          data: { isDefault: false }
        })
      }
    }

    const updatedPaymentMethod = await prisma.paymentMethod.update({
      where: { id },
      data: {
        cardholderName,
        expiryMonth,
        expiryYear,
        isDefault: isDefault || false
      }
    })

    return NextResponse.json(updatedPaymentMethod)
  } catch (error) {
    console.error('Error updating payment method:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete payment method
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.paymentMethod.delete({
      where: { id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
