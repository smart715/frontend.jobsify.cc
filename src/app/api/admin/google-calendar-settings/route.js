
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

    // Get Google Calendar settings from database
    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: [
            'google_calendar_status',
            'google_calendar_client_id',
            'google_calendar_client_secret',
            'google_calendar_redirect_uri',
            'google_calendar_calendar_id',
            'google_calendar_sync_enabled',
            'google_calendar_event_reminders',
            'google_calendar_default_event_duration',
            'google_calendar_time_zone',
            'google_calendar_max_results',
            'google_calendar_order_by'
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
      status: settingsObj.google_calendar_status === 'true' || false,
      clientId: settingsObj.google_calendar_client_id || '',
      clientSecret: settingsObj.google_calendar_client_secret || '',
      redirectUri: settingsObj.google_calendar_redirect_uri || 'https://localhost:3000/oauth/callback/google',
      calendarId: settingsObj.google_calendar_calendar_id || 'primary',
      syncEnabled: settingsObj.google_calendar_sync_enabled === 'true' || true,
      eventReminders: settingsObj.google_calendar_event_reminders === 'true' || true,
      defaultEventDuration: parseInt(settingsObj.google_calendar_default_event_duration) || 60,
      timeZone: settingsObj.google_calendar_time_zone || 'UTC',
      maxResults: parseInt(settingsObj.google_calendar_max_results) || 250,
      orderBy: settingsObj.google_calendar_order_by || 'startTime'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching Google Calendar settings:', error)
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
      status,
      clientId,
      clientSecret,
      redirectUri,
      calendarId,
      syncEnabled,
      eventReminders,
      defaultEventDuration,
      timeZone,
      maxResults,
      orderBy
    } = body

    // Prepare settings to save
    const settingsToSave = [
      { key: 'google_calendar_status', value: status ? 'true' : 'false' },
      { key: 'google_calendar_client_id', value: clientId || '' },
      { key: 'google_calendar_client_secret', value: clientSecret || '' },
      { key: 'google_calendar_redirect_uri', value: redirectUri || 'https://localhost:3000/oauth/callback/google' },
      { key: 'google_calendar_calendar_id', value: calendarId || 'primary' },
      { key: 'google_calendar_sync_enabled', value: syncEnabled ? 'true' : 'false' },
      { key: 'google_calendar_event_reminders', value: eventReminders ? 'true' : 'false' },
      { key: 'google_calendar_default_event_duration', value: (defaultEventDuration || 60).toString() },
      { key: 'google_calendar_time_zone', value: timeZone || 'UTC' },
      { key: 'google_calendar_max_results', value: (maxResults || 250).toString() },
      { key: 'google_calendar_order_by', value: orderBy || 'startTime' }
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

    return NextResponse.json({ message: 'Google Calendar settings saved successfully' })
  } catch (error) {
    console.error('Error saving Google Calendar settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
