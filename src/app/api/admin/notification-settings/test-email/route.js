
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { emailSettings, recipientEmail, customMessage } = body

    let settings = {}
    
    if (emailSettings) {
      // Use provided email settings from request body
      settings = emailSettings
    } else {
      // Get email settings from database
      const emailSettingsFromDB = await prisma.systemSettings.findUnique({
        where: { key: 'notification_settings' }
      })

      if (emailSettingsFromDB) {
        settings = JSON.parse(emailSettingsFromDB.value)
      } else {
        // Use environment variables as fallback
        settings = {
          mailHost: process.env.SMTP_HOST,
          mailPort: process.env.SMTP_PORT,
          mailUsername: process.env.SMTP_USER,
          mailPassword: process.env.SMTP_PASS,
          mailEncryption: process.env.SMTP_SECURE === 'true' ? 'ssl' : 'tls',
          mailFromName: process.env.MAILGUN_FROM_NAME || 'Jobsify',
          mailFromEmail: process.env.MAILGUN_FROM_EMAIL || 'noreply@jobsify.cc'
        }
      }
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: settings.mailHost,
      port: parseInt(settings.mailPort),
      secure: settings.mailEncryption === 'ssl',
      auth: {
        user: settings.mailUsername,
        pass: settings.mailPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Test email content
    const mailOptions = {
      from: `"${settings.mailFromName}" <${settings.mailFromEmail}>`,
      to: recipientEmail || session.user.email,
      subject: 'Test Email from Jobsify - SMTP Configuration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">SMTP Configuration Test</h2>
          <p>Hello,</p>
          <p>This is a test email to verify that your SMTP configuration is working correctly.</p>
          
          ${customMessage ? `
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2196f3;">
            <h3 style="margin-top: 0; color: #1976d2;">Custom Message:</h3>
            <p style="margin: 0; white-space: pre-wrap;">${customMessage}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Configuration Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>SMTP Host:</strong> ${settings.mailHost}</li>
              <li><strong>SMTP Port:</strong> ${settings.mailPort}</li>
              <li><strong>Encryption:</strong> ${settings.mailEncryption}</li>
              <li><strong>Username:</strong> ${settings.mailUsername}</li>
              <li><strong>From Name:</strong> ${settings.mailFromName}</li>
              <li><strong>From Email:</strong> ${settings.mailFromEmail}</li>
            </ul>
          </div>
          <p>If you received this email, your SMTP configuration is working correctly!</p>
          <p style="color: #666; font-size: 12px;">
            Sent from Jobsify Notification Settings
          </p>
        </div>
      `
    }

    // Send test email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: 'Test email sent successfully' })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json({ 
      error: 'Failed to send test email', 
      details: error.message 
    }, { status: 500 })
  }
}
