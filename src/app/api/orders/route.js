
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    // Generate unique order ID
    const moduleCode = 'MD'
    const companyCode = 'CP'
    const year = new Date().getFullYear()
    const count = await prisma.order.count()
    const orderId = `${moduleCode}-${companyCode}-ORD-${year}-${(count + 1).toString().padStart(4, '0')}`
    
    const order = await prisma.order.create({
      data: {
        ...data,
        orderId
      }
    })
    
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
