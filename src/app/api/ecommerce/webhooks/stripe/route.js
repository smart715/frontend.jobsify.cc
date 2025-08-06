
// force Node.js runtime so Prisma can run
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    // Get webhook secret from environment or database
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 400 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session) {
  try {
    const { metadata } = session
    const companyId = metadata.companyId
    const customerInfo = JSON.parse(metadata.customerInfo)
    const billingAddress = JSON.parse(metadata.billingAddress)
    const shippingAddress = JSON.parse(metadata.shippingAddress)

    // Create or update customer
    let customer = await prisma.ecommerceCustomer.findUnique({
      where: { email: customerInfo.email }
    })

    if (!customer) {
      customer = await prisma.ecommerceCustomer.create({
        data: {
          email: customerInfo.email,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          phone: customerInfo.phone,
          companyId,
          defaultBillingAddress: billingAddress,
          defaultShippingAddress: shippingAddress
        }
      })
    }

    // Generate order number
    const orderCount = await prisma.ecommerceOrder.count()
    const orderNumber = `E${Date.now()}${orderCount + 1}`.padStart(10, '0')

    // Get line items from Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

    // Create order
    const order = await prisma.ecommerceOrder.create({
      data: {
        orderNumber,
        email: customerInfo.email,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phone: customerInfo.phone,
        billingAddress1: billingAddress.address1,
        billingAddress2: billingAddress.address2,
        billingCity: billingAddress.city,
        billingState: billingAddress.state,
        billingZip: billingAddress.zip,
        billingCountry: billingAddress.country,
        shippingAddress1: shippingAddress?.address1,
        shippingAddress2: shippingAddress?.address2,
        shippingCity: shippingAddress?.city,
        shippingState: shippingAddress?.state,
        shippingZip: shippingAddress?.zip,
        shippingCountry: shippingAddress?.country,
        subtotal: session.amount_subtotal / 100,
        taxAmount: (session.total_details?.amount_tax || 0) / 100,
        shippingAmount: (session.total_details?.amount_shipping || 0) / 100,
        totalAmount: session.amount_total / 100,
        currency: session.currency.toUpperCase(),
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: 'stripe',
        paymentReference: session.payment_intent,
        stripePaymentIntentId: session.payment_intent,
        customerId: customer.id,
        companyId
      }
    })

    console.log('Order created successfully:', order.orderNumber)
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    // Update order payment status if needed
    await prisma.ecommerceOrder.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { paymentStatus: 'PAID' }
    })
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  try {
    // Update order payment status
    await prisma.ecommerceOrder.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { 
        paymentStatus: 'PENDING',
        status: 'PENDING'
      }
    })
  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}
