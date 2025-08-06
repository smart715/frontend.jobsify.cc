
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch Stripe settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Stripe settings from database or return defaults
    let settings = await prisma.systemSettings.findUnique({
      where: { key: 'stripe_settings' }
    })

    if (!settings) {
      // Create default settings
      const defaultSettings = {
        stripePublicKey: '',
        stripeSecretKey: '',
        stripeWebhookSecret: '',
        testMode: true,
        autoCapture: true,
        currency: 'USD',
        collectBillingAddress: true,
        collectShippingAddress: false,
        savePaymentMethods: true,
        allowPromotionCodes: true,
        connected: false
      }

      settings = await prisma.systemSettings.create({
        data: {
          key: 'stripe_settings',
          value: JSON.stringify(defaultSettings)
        }
      })
    }

    const settingsData = JSON.parse(settings.value)
    
    // Don't return sensitive keys in full
    return NextResponse.json({
      ...settingsData,
      stripeSecretKey: settingsData.stripeSecretKey ? '••••••••' : '',
      stripeWebhookSecret: settingsData.stripeWebhookSecret ? '••••••••' : ''
    })

  } catch (error) {
    console.error('Error fetching Stripe settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Stripe settings' },
      { status: 500 }
    )
  }
}

// POST - Update Stripe settings
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.stripePublicKey || !data.stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe public key and secret key are required' },
        { status: 400 }
      )
    }

    // Validate key formats
    const expectedPublicPrefix = data.testMode ? 'pk_test_' : 'pk_live_'
    const expectedSecretPrefix = data.testMode ? 'sk_test_' : 'sk_live_'

    if (!data.stripePublicKey.startsWith(expectedPublicPrefix)) {
      return NextResponse.json(
        { error: `Public key should start with ${expectedPublicPrefix} for ${data.testMode ? 'test' : 'live'} mode` },
        { status: 400 }
      )
    }

    if (!data.stripeSecretKey.startsWith(expectedSecretPrefix)) {
      return NextResponse.json(
        { error: `Secret key should start with ${expectedSecretPrefix} for ${data.testMode ? 'test' : 'live'} mode` },
        { status: 400 }
      )
    }

    // Get existing settings to preserve unchanged sensitive data
    let existingSettings = await prisma.systemSettings.findUnique({
      where: { key: 'stripe_settings' }
    })

    let existingData = {}
    if (existingSettings) {
      existingData = JSON.parse(existingSettings.value)
    }

    // Only update sensitive fields if they're not masked
    const updateData = { ...data }
    if (data.stripeSecretKey === '••••••••') {
      updateData.stripeSecretKey = existingData.stripeSecretKey || ''
    }
    if (data.stripeWebhookSecret === '••••••••') {
      updateData.stripeWebhookSecret = existingData.stripeWebhookSecret || ''
    }

    // Update or create Stripe settings
    await prisma.systemSettings.upsert({
      where: { key: 'stripe_settings' },
      update: {
        value: JSON.stringify(updateData),
        updatedAt: new Date()
      },
      create: {
        key: 'stripe_settings',
        value: JSON.stringify(updateData)
      }
    })

    return NextResponse.json({ success: true, message: 'Stripe settings updated successfully' })

  } catch (error) {
    console.error('Error updating Stripe settings:', error)
    return NextResponse.json(
      { error: 'Failed to update Stripe settings' },
      { status: 500 }
    )
  }
}
