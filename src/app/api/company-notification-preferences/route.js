
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch notification preferences for a company
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    let preferences = await prisma.companyNotificationPreference.findUnique({
      where: { companyId }
    })

    // If no preferences exist, create default ones
    if (!preferences) {
      preferences = await prisma.companyNotificationPreference.create({
        data: {
          companyId,
          newForYouEmail: true,
          newForYouBrowser: true,
          newForYouApp: true,
          accountActivityEmail: true,
          accountActivityBrowser: true,
          accountActivityApp: true,
          newBrowserEmail: true,
          newBrowserBrowser: true,
          newBrowserApp: false,
          newDeviceEmail: true,
          newDeviceBrowser: false,
          newDeviceApp: false,
          notificationFrequency: 'online'
        }
      })
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error fetching notification preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Update notification preferences for a company
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { companyId, ...preferences } = data

    console.log('Received notification preferences data:', { companyId, preferences })

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Clean up preferences object - remove any undefined values
    const cleanPreferences = {}
    Object.keys(preferences).forEach(key => {
      if (preferences[key] !== undefined) {
        cleanPreferences[key] = preferences[key]
      }
    })

    console.log('Clean preferences:', cleanPreferences)

    // Update or create notification preferences
    const updatedPreferences = await prisma.companyNotificationPreference.upsert({
      where: { companyId },
      update: {
        ...cleanPreferences,
        updatedAt: new Date()
      },
      create: {
        companyId,
        ...cleanPreferences
      }
    })

    console.log('Updated preferences:', updatedPreferences)

    return NextResponse.json(updatedPreferences)
  } catch (error) {
    console.error('Error updating notification preferences:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}
