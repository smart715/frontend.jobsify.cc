
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch trial settings
export async function GET() {
  try {
    console.log('Trial settings API called')
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get trial settings from database or return defaults
    let settings = await prisma.systemSettings.findUnique({
      where: { key: 'trial_settings' }
    })

    if (!settings) {
      // Create default settings
      const defaultSettings = {
        trialDuration: 30,
        trialDurationType: 'days',
        trialDays: 30,
        autoExtendTrial: false,
        maxTrialExtensions: 1,
        trialGracePeriod: 7,
        sendTrialReminders: true,
        reminderDays: [7, 3, 1],
        trialFeaturesEnabled: true,
        allowMultipleTrials: false
      }

      settings = await prisma.systemSettings.create({
        data: {
          key: 'trial_settings',
          value: JSON.stringify(defaultSettings)
        }
      })
    }

    const parsedSettings = JSON.parse(settings.value)
    console.log('Returning trial settings:', parsedSettings)
    return NextResponse.json(parsedSettings)

  } catch (error) {
    console.error('Error fetching trial settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trial settings' },
      { status: 500 }
    )
  }
}

// POST - Update trial settings
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.trialDuration || data.trialDuration < 1) {
      return NextResponse.json(
        { error: 'Trial duration must be at least 1' },
        { status: 400 }
      )
    }

    if (!data.trialDays || data.trialDays < 1 || data.trialDays > 365) {
      return NextResponse.json(
        { error: 'Trial days must be between 1 and 365' },
        { status: 400 }
      )
    }

    // Update or create trial settings
    await prisma.systemSettings.upsert({
      where: { key: 'trial_settings' },
      update: {
        value: JSON.stringify(data),
        updatedAt: new Date()
      },
      create: {
        key: 'trial_settings',
        value: JSON.stringify(data)
      }
    })

    return NextResponse.json({ success: true, message: 'Trial settings updated successfully' })

  } catch (error) {
    console.error('Error updating trial settings:', error)
    return NextResponse.json(
      { error: 'Failed to update trial settings' },
      { status: 500 }
    )
  }
}
