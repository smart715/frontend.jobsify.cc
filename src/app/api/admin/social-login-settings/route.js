
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch social login settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get social login settings from database or return defaults
    let settings = await prisma.systemSettings.findUnique({
      where: { key: 'social_login_settings' }
    })

    if (!settings) {
      // Create default settings
      const defaultSettings = {
        google: {
          enabled: false,
          clientId: '',
          clientSecret: ''
        },
        facebook: {
          enabled: false,
          appId: '',
          appSecret: ''
        },
        linkedin: {
          enabled: false,
          clientId: '',
          clientSecret: ''
        },
        twitter: {
          enabled: false,
          apiKey: '',
          apiSecret: ''
        }
      }

      settings = await prisma.systemSettings.create({
        data: {
          key: 'social_login_settings',
          value: JSON.stringify(defaultSettings)
        }
      })
    }

    const parsedSettings = JSON.parse(settings.value)
    return NextResponse.json(parsedSettings)

  } catch (error) {
    console.error('Error fetching social login settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social login settings' },
      { status: 500 }
    )
  }
}

// POST - Update social login settings
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validate the data structure
    const validProviders = ['google', 'facebook', 'linkedin', 'twitter']
    for (const provider of validProviders) {
      if (!data[provider] || typeof data[provider] !== 'object') {
        return NextResponse.json(
          { error: `Invalid data structure for ${provider}` },
          { status: 400 }
        )
      }
    }

    // Update or create social login settings
    await prisma.systemSettings.upsert({
      where: { key: 'social_login_settings' },
      update: {
        value: JSON.stringify(data),
        updatedAt: new Date()
      },
      create: {
        key: 'social_login_settings',
        value: JSON.stringify(data)
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Social login settings updated successfully' 
    })

  } catch (error) {
    console.error('Error updating social login settings:', error)
    return NextResponse.json(
      { error: 'Failed to update social login settings' },
      { status: 500 }
    )
  }
}
