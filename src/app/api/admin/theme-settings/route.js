
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import prisma from '@/libs/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get theme settings from database
    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: [
            'theme_app_name',
            'theme_work_suite',
            'theme_primary_color',
            'theme_public_pages_theme',
            'theme_logo_front_website',
            'theme_logo_light_mode',
            'theme_logo_dark_mode',
            'theme_logo_login_screen',
            'theme_logo_favicon'
          ]
        }
      }
    })

    // Convert settings array to object
    const settingsObj = {}
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value
    })

    // Structure the response with defaults
    const response = {
      appName: settingsObj.theme_app_name || 'Company Name',
      workSuite: settingsObj.theme_work_suite || '',
      primaryColor: settingsObj.theme_primary_color || '#1976d2',
      publicPagesTheme: settingsObj.theme_public_pages_theme || 'light',
      logos: {
        frontWebsite: settingsObj.theme_logo_front_website || null,
        lightMode: settingsObj.theme_logo_light_mode || null,
        darkMode: settingsObj.theme_logo_dark_mode || null,
        loginScreen: settingsObj.theme_logo_login_screen || null,
        favicon: settingsObj.theme_logo_favicon || null
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching theme settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      appName,
      workSuite,
      primaryColor,
      publicPagesTheme,
      logos
    } = body

    // Prepare settings to save
    const settingsToSave = [
      { key: 'theme_app_name', value: appName || 'Company Name' },
      { key: 'theme_work_suite', value: workSuite || '' },
      { key: 'theme_primary_color', value: primaryColor || '#1976d2' },
      { key: 'theme_public_pages_theme', value: publicPagesTheme || 'light' },
      { key: 'theme_logo_front_website', value: logos?.frontWebsite || '' },
      { key: 'theme_logo_light_mode', value: logos?.lightMode || '' },
      { key: 'theme_logo_dark_mode', value: logos?.darkMode || '' },
      { key: 'theme_logo_login_screen', value: logos?.loginScreen || '' },
      { key: 'theme_logo_favicon', value: logos?.favicon || '' }
    ]

    // Save settings to database
    for (const setting of settingsToSave) {
      await prisma.systemSettings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: {
          key: setting.key,
          value: setting.value
        }
      })
    }

    return NextResponse.json({ message: 'Theme settings saved successfully' })
  } catch (error) {
    console.error('Error saving theme settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
