
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Check if currency model exists
    if (!prisma.currency) {
      console.error('Currency model not found in Prisma client')
      return NextResponse.json({ error: 'Currency model not available' }, { status: 500 })
    }

    const currencies = await prisma.currency.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(currencies)
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return NextResponse.json({ error: 'Failed to fetch currencies' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Check if currency model exists
    if (!prisma.currency) {
      console.error('Currency model not found in Prisma client')
      return NextResponse.json({ error: 'Currency model not available' }, { status: 500 })
    }

    const body = await request.json()
    const { name, symbol, code, rate, format, isDefault } = body

    // If this is being set as default, update other currencies to not be default
    if (isDefault) {
      await prisma.currency.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    const currency = await prisma.currency.create({
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
    console.error('Error creating currency:', error)
    
    // Handle unique constraint violation for currency code
    if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
      return NextResponse.json({ error: 'Currency code already exists' }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to create currency' }, { status: 500 })
  }
}
