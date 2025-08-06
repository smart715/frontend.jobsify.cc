
// force Node.js runtime so Prisma can run
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const status = searchParams.get('status') || ''
    const paymentStatus = searchParams.get('paymentStatus') || ''
    const fulfillmentStatus = searchParams.get('fulfillmentStatus') || ''
    const companyId = searchParams.get('companyId')

    const where = {
      ...(companyId && { companyId }),
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(fulfillmentStatus && { fulfillmentStatus })
    }

    const [orders, total] = await Promise.all([
      prisma.ecommerceOrder.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, images: { take: 1 } }
              },
              variant: {
                select: { id: true, name: true, option1: true, option2: true, option3: true }
              }
            }
          },
          customer: {
            select: { id: true, firstName: true, lastName: true, email: true }
          },
          company: {
            select: { id: true, companyName: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.ecommerceOrder.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const {
      email,
      phone,
      firstName,
      lastName,
      companyName,
      billingAddress,
      shippingAddress,
      items,
      currency,
      paymentMethod,
      paymentReference,
      notes,
      companyId
    } = data

    // Generate unique order number
    const orderCount = await prisma.ecommerceOrder.count()
    const orderNumber = `E${Date.now()}${orderCount + 1}`.padStart(10, '0')

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} not found` },
          { status: 400 }
        )
      }

      let price = product.price
      let variant = null

      if (item.variantId) {
        variant = product.variants.find(v => v.id === item.variantId)
        if (variant) {
          price = variant.price
        }
      }

      const itemTotal = price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        name: variant ? `${product.name} - ${variant.name}` : product.name,
        sku: variant?.sku || product.sku,
        price,
        quantity: item.quantity,
        totalAmount: itemTotal,
        weight: variant?.weight || product.weight,
        requiresShipping: product.requiresShipping,
        taxable: product.taxable,
        vendor: product.vendor
      })
    }

    // Calculate tax (simplified - 8.5% for demo)
    const taxRate = 0.085
    const taxAmount = subtotal * taxRate

    // Calculate shipping (simplified - $10 flat rate)
    const shippingAmount = orderItems.some(item => item.requiresShipping) ? 10 : 0

    const totalAmount = subtotal + taxAmount + shippingAmount

    // Create order
    const order = await prisma.ecommerceOrder.create({
      data: {
        orderNumber,
        email,
        phone,
        firstName,
        lastName,
        companyName,
        billingAddress1: billingAddress.address1,
        billingAddress2: billingAddress.address2,
        billingCity: billingAddress.city,
        billingState: billingAddress.state,
        billingZip: billingAddress.zip,
        billingCountry: billingAddress.country || 'US',
        shippingAddress1: shippingAddress?.address1,
        shippingAddress2: shippingAddress?.address2,
        shippingCity: shippingAddress?.city,
        shippingState: shippingAddress?.state,
        shippingZip: shippingAddress?.zip,
        shippingCountry: shippingAddress?.country,
        subtotal,
        taxAmount,
        shippingAmount,
        totalAmount,
        currency: currency || 'USD',
        paymentMethod,
        paymentReference,
        notes,
        companyId,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    })

    // Update inventory
    for (const item of orderItems) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        })
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        })
      }
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
