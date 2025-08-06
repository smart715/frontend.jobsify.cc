
// force Node.js runtime so Prisma can run
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const data = await request.json()
    const {
      items,
      customerInfo,
      billingAddress,
      shippingAddress,
      paymentMethodId,
      companyId
    } = data

    // Get company's Stripe configuration
    const paymentConfig = await prisma.paymentGatewayConfiguration.findFirst({
      where: {
        companyId,
        provider: 'stripe',
        isActive: true
      }
    })

    if (!paymentConfig) {
      return NextResponse.json(
        { error: 'Payment configuration not found' },
        { status: 400 }
      )
    }

    const stripe = new Stripe(paymentConfig.stripeSecretKey)

    // Calculate order totals
    let subtotal = 0
    const lineItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        )
      }

      let price = product.price
      let name = product.name

      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId)
        if (variant) {
          price = variant.price
          name = `${product.name} - ${variant.name}`
        }
      }

      const itemTotal = price * item.quantity
      subtotal += itemTotal

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name,
            images: product.images?.length > 0 ? [product.images[0].url] : []
          },
          unit_amount: Math.round(price * 100) // Convert to cents
        },
        quantity: item.quantity
      })
    }

    // Add shipping if needed
    const hasShippableItems = items.some(item => {
      // Check if any items require shipping (simplified check)
      return true // For demo purposes
    })

    if (hasShippableItems) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping'
          },
          unit_amount: 1000 // $10 flat rate
        },
        quantity: 1
      })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout/cancelled`,
      customer_email: customerInfo.email,
      metadata: {
        companyId,
        customerInfo: JSON.stringify(customerInfo),
        billingAddress: JSON.stringify(billingAddress),
        shippingAddress: JSON.stringify(shippingAddress)
      }
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
