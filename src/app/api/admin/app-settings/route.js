
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

export async function POST(request) {
  try {
    // Check if prisma client is properly initialized
    if (!prisma) {
      throw new Error('Prisma client not initialized')
    }

    const body = await request.json()
    
    const {
      dateFormat,
      timeFormat,
      defaultTimezone,
      defaultCurrency,
      language,
      databaseRowLimit,
      sessionDriver,
      appDebug,
      appUpdate,
      enableCache,
      emailNotification,
      companyNeedApproval,
      maxFileSize,
      maxNumberOfFiles,
      googleMapKey
    } = body

    // Array of settings to save/update
    const settingsToSave = [
      { key: 'date_format', value: dateFormat || 'd-m-Y H:i:s' },
      { key: 'time_format', value: timeFormat || '12' },
      { key: 'default_timezone', value: defaultTimezone || 'Asia/Kolkata' },
      { key: 'default_currency', value: defaultCurrency || 'USD' },
      { key: 'language', value: language || 'en' },
      { key: 'database_row_limit', value: databaseRowLimit?.toString() || '25' },
      { key: 'session_driver', value: sessionDriver || 'file' },
      { key: 'app_debug', value: appDebug?.toString() || 'false' },
      { key: 'app_update', value: appUpdate?.toString() || 'false' },
      { key: 'enable_cache', value: enableCache?.toString() || 'false' },
      { key: 'email_notification', value: emailNotification?.toString() || 'false' },
      { key: 'company_need_approval', value: companyNeedApproval?.toString() || 'false' },
      { key: 'max_file_size', value: maxFileSize?.toString() || '10' },
      { key: 'max_number_of_files', value: maxNumberOfFiles?.toString() || '10' },
      { key: 'google_map_key', value: googleMapKey || '' }
    ]

    // Try to create the systemSettings table if it doesn't exist
    try {
      // Use upsert to create or update each setting
      const updatePromises = settingsToSave.map(setting =>
        prisma.systemSettings.upsert({
          where: { key: setting.key },
          update: { 
            value: setting.value,
            updatedAt: new Date()
          },
          create: {
            key: setting.key,
            value: setting.value
          }
        })
      )

      await Promise.all(updatePromises)
    } catch (dbError) {
      console.error('Database error:', dbError)
      throw new Error('SystemSettings table may not exist. Please run database migration.')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'App settings saved successfully' 
    })

  } catch (error) {
    console.error('Error saving app settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save app settings', details: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    // Check if prisma client is properly initialized
    if (!prisma) {
      throw new Error('Prisma client not initialized')
    }

    // Check if systemSettings model exists and fetch data
    const settings = await prisma.systemSettings.findMany().catch((err) => {
      console.error('SystemSettings model error:', err)
      // Return empty array if table doesn't exist
      return []
    })
    
    // Convert to key-value object for easier consumption
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    // Ensure all expected keys exist with default values
    const defaultKeys = {
      date_format: 'd-m-Y H:i:s',
      time_format: '12',
      default_timezone: 'Asia/Kolkata',
      default_currency: 'USD',
      language: 'en',
      database_row_limit: '25',
      session_driver: 'file',
      app_debug: 'false',
      app_update: 'false',
      enable_cache: 'false',
      email_notification: 'false',
      company_need_approval: 'false',
      max_file_size: '10',
      max_number_of_files: '10',
      google_map_key: ''
    }

    // Merge with defaults
    Object.keys(defaultKeys).forEach(key => {
      if (!(key in settingsObject)) {
        settingsObject[key] = defaultKeys[key]
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: settingsObject 
    })

  } catch (error) {
    console.error('Error fetching app settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch app settings', details: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
