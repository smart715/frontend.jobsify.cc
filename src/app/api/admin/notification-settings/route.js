
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

    // Get notification settings from database
    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: [
            'smtp_host',
            'smtp_port',
            'smtp_secure',
            'smtp_user',
            'smtp_pass',
            'smtp_from',
            'mail_from_name',
            'mail_from_email',
            'mail_driver',
            'mail_encryption',
            'enable_email_queue',
            'email_verified',
            'enable_beams',
            'enable_one_signal',
            'pusher_status',
            'pusher_task_board',
            'pusher_messages'
          ]
        }
      }
    })

    // Convert settings array to object
    const settingsObj = {}
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value
    })

    // Structure the response
    const response = {
      emailSettings: {
        mailFromName: settingsObj.mail_from_name || 'Jobsify LLC',
        mailFromEmail: settingsObj.mail_from_email || settingsObj.smtp_user || 'email@mg.infinitylabsai.com',
        enableEmailQueue: settingsObj.enable_email_queue === 'true',
        mailDriver: settingsObj.mail_driver || 'SMTP',
        mailHost: settingsObj.smtp_host || 'smtp.mailgun.org',
        mailPort: settingsObj.smtp_port || '2525',
        mailUsername: settingsObj.smtp_user || 'email@mg.infinitylabsai.com',
        mailPassword: settingsObj.smtp_pass || '',
        mailEncryption: settingsObj.mail_encryption || (settingsObj.smtp_secure === 'true' ? 'ssl' : 'tls'),
        emailVerified: settingsObj.email_verified === 'true'
      },
      pushSettings: {
        enableBeams: settingsObj.enable_beams === 'true',
        enableOneSignal: settingsObj.enable_one_signal === 'true'
      },
      pusherSettings: {
        status: settingsObj.pusher_status === 'true',
        taskBoard: settingsObj.pusher_task_board === 'true',
        messages: settingsObj.pusher_messages === 'true'
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching notification settings:', error)
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
    const { emailSettings, pushSettings, pusherSettings } = body

    // Prepare settings to save
    const settingsToSave = []

    if (emailSettings) {
      settingsToSave.push(
        { key: 'smtp_host', value: emailSettings.mailHost },
        { key: 'smtp_port', value: emailSettings.mailPort },
        { key: 'smtp_secure', value: emailSettings.mailEncryption === 'ssl' ? 'true' : 'false' },
        { key: 'smtp_user', value: emailSettings.mailUsername },
        { key: 'smtp_pass', value: emailSettings.mailPassword },
        { key: 'smtp_from', value: emailSettings.mailFromName },
        { key: 'mail_from_name', value: emailSettings.mailFromName },
        { key: 'mail_from_email', value: emailSettings.mailFromEmail },
        { key: 'mail_driver', value: emailSettings.mailDriver },
        { key: 'mail_encryption', value: emailSettings.mailEncryption },
        { key: 'enable_email_queue', value: emailSettings.enableEmailQueue ? 'true' : 'false' },
        { key: 'email_verified', value: emailSettings.emailVerified ? 'true' : 'false' }
      )
    }

    if (pushSettings) {
      settingsToSave.push(
        { key: 'enable_beams', value: pushSettings.enableBeams ? 'true' : 'false' },
        { key: 'enable_one_signal', value: pushSettings.enableOneSignal ? 'true' : 'false' }
      )
    }

    if (pusherSettings) {
      settingsToSave.push(
        { key: 'pusher_status', value: pusherSettings.status ? 'true' : 'false' },
        { key: 'pusher_task_board', value: pusherSettings.taskBoard ? 'true' : 'false' },
        { key: 'pusher_messages', value: pusherSettings.messages ? 'true' : 'false' }
      )
    }

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

    return NextResponse.json({ message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Error saving notification settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
