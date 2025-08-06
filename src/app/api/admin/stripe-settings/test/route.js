
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Test Stripe connection
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Stripe settings
    const settings = await prisma.systemSettings.findUnique({
      where: { key: 'stripe_settings' }
    })

    if (!settings) {
      return NextResponse.json(
        { error: 'Stripe settings not configured' },
        { status: 400 }
      )
    }

    const stripeSettings = JSON.parse(settings.value)

    if (!stripeSettings.stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key not configured' },
        { status: 400 }
      )
    }

    // Test connection by initializing Stripe and making a simple API call
    const stripe = require('stripe')(stripeSettings.stripeSecretKey)

    try {
      // Test the connection by retrieving account details
      const account = await stripe.accounts.retrieve()
      
      // Update connection status
      const updatedSettings = {
        ...stripeSettings,
        connected: true,
        lastTestedAt: new Date().toISOString()
      }

      await prisma.systemSettings.update({
        where: { key: 'stripe_settings' },
        data: {
          value: JSON.stringify(updatedSettings),
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Stripe connection successful',
        account: {
          id: account.id,
          country: account.country,
          defaultCurrency: account.default_currency,
          businessType: account.business_type
        }
      })

    } catch (stripeError) {
      console.error('Stripe connection error:', stripeError)
      
      // Update connection status to failed
      const updatedSettings = {
        ...stripeSettings,
        connected: false,
        lastTestedAt: new Date().toISOString(),
        lastError: stripeError.message
      }

      await prisma.systemSettings.update({
        where: { key: 'stripe_settings' },
        data: {
          value: JSON.stringify(updatedSettings),
          updatedAt: new Date()
        }
      })

      return NextResponse.json(
        { error: `Stripe connection failed: ${stripeError.message}` },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error testing Stripe connection:', error)
    return NextResponse.json(
      { error: 'Failed to test Stripe connection' },
      { status: 500 }
    )
  }
}
