
// force Node.js runtime so Prisma can run
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get backup settings
export async function GET() {
  try {
    // Try to get settings from database
    let settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: [
            'backup_auto_enabled',
            'backup_frequency', 
            'backup_retention_days',
            'backup_compression',
            'backup_email_notification'
          ]
        }
      }
    })

    // Convert to object format
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    // Set default values if not found
    const defaultSettings = {
      autoBackup: settingsObj.backup_auto_enabled === 'true' || false,
      backupFrequency: settingsObj.backup_frequency || 'daily',
      retentionDays: parseInt(settingsObj.backup_retention_days) || 30,
      compression: settingsObj.backup_compression === 'true' || true,
      emailNotification: settingsObj.backup_email_notification === 'true' || false
    }

    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error('Error fetching backup settings:', error)
    return NextResponse.json({ error: 'Failed to fetch backup settings' }, { status: 500 })
  }
}

// Update backup settings
export async function POST(request) {
  try {
    const settings = await request.json()

    // Update each setting in the database
    const settingsToUpdate = [
      { key: 'backup_auto_enabled', value: settings.autoBackup.toString() },
      { key: 'backup_frequency', value: settings.backupFrequency },
      { key: 'backup_retention_days', value: settings.retentionDays.toString() },
      { key: 'backup_compression', value: settings.compression.toString() },
      { key: 'backup_email_notification', value: settings.emailNotification.toString() }
    ]

    for (const setting of settingsToUpdate) {
      await prisma.systemSettings.upsert({
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
    }

    return NextResponse.json({ message: 'Backup settings saved successfully' })
  } catch (error) {
    console.error('Error saving backup settings:', error)
    return NextResponse.json({ error: 'Failed to save backup settings' }, { status: 500 })
  }
}
