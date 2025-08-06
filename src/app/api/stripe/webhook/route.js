
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { headers } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    // Get Stripe settings
    const settings = await prisma.systemSettings.findUnique({
      where: { key: 'stripe_settings' }
    })

    if (!settings) {
      console.error('Stripe settings not found')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
    }

    const stripeSettings = JSON.parse(settings.value)
    const stripe = require('stripe')(stripeSettings.stripeSecretKey)

    const body = await request.text()
    const signature = headers().get('stripe-signature')

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeSettings.stripeWebhookSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(subscription) {
  try {
    // Find company by customer ID or email
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { stripeCustomerId: subscription.customer },
          { adminEmail: subscription.customer_email }
        ]
      }
    })

    if (company) {
      await prisma.company.update({
        where: { id: company.id },
        data: {
          status: 'Active',
          package: subscription.items.data[0]?.price.nickname || 'Subscription',
          packageDate: new Date(),
          isTrialExpired: false,
          stripeSubscriptionId: subscription.id
        }
      })
    }
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    const company = await prisma.company.findFirst({
      where: { stripeSubscriptionId: subscription.id }
    })

    if (company) {
      await prisma.company.update({
        where: { id: company.id },
        data: {
          status: subscription.status === 'active' ? 'Active' : 'Inactive',
          package: subscription.items.data[0]?.price.nickname || 'Subscription'
        }
      })
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    const company = await prisma.company.findFirst({
      where: { stripeSubscriptionId: subscription.id }
    })

    if (company) {
      await prisma.company.update({
        where: { id: company.id },
        data: {
          status: 'Trial Expired',
          stripeSubscriptionId: null
        }
      })
    }
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}

async function handlePaymentSucceeded(invoice) {
  try {
    // Log successful payment
    console.log('Payment succeeded for invoice:', invoice.id)
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(invoice) {
  try {
    // Handle failed payment - could update company status or send notifications
    console.log('Payment failed for invoice:', invoice.id)
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}
