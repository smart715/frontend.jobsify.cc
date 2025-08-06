
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, symbol, code, rate, format, isDefault } = body

    // If this is being set as default, update other currencies to not be default
    if (isDefault) {
      await prisma.currency.updateMany({
        where: { isDefault: true, id: { not: id } },
        data: { isDefault: false }
      })
    }

    const currency = await prisma.currency.update({
      where: { id },
      data: {
        name,
        symbol,
        code,
        rate: rate || 1,
        format,
        isDefault: isDefault || false
      }
    })

    return NextResponse.json(currency)
  } catch (error) {
    console.error('Error updating currency:', error)
    return NextResponse.json({ error: 'Failed to update currency' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    
    // Check if this is the default currency
    const currency = await prisma.currency.findUnique({
      where: { id }
    })

    if (currency?.isDefault) {
      return NextResponse.json(
        { error: 'Cannot delete the default currency' },
        { status: 400 }
      )
    }

    await prisma.currency.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Currency deleted successfully' })
  } catch (error) {
    console.error('Error deleting currency:', error)
    return NextResponse.json({ error: 'Failed to delete currency' }, { status: 500 })
  }
}
