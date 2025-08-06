
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
    const { emailAddress } = body

    if (!emailAddress) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    // Get email settings from database
    const emailSettings = await prisma.systemSettings.findUnique({
      where: { key: 'notification_settings' }
    })

    let settings = {}
    if (emailSettings) {
      settings = JSON.parse(emailSettings.value)
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

    // Create nodemailer transporter
    const transporter = nodemailer.createTransporter({
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
      to: emailAddress,
      subject: 'Test Email from Jobsify - SMTP Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">JOBSIFY</h1>
            <h2 style="color: #666; font-size: 20px; margin: 0;">SMTP Configuration Test</h2>
          </div>
          
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello,</p>
          
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            This is a test email to verify that your SMTP configuration is working correctly. 
            This email was sent to <strong>${emailAddress}</strong> by <strong>${session.user.email}</strong>.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #007bff;">
            <h3 style="margin-top: 0; color: #007bff; font-size: 18px;">Configuration Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">SMTP Host:</td>
                <td style="padding: 8px 0; color: #6c757d;">${settings.mailHost}</td>
              </tr>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">SMTP Port:</td>
                <td style="padding: 8px 0; color: #6c757d;">${settings.mailPort}</td>
              </tr>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">Encryption:</td>
                <td style="padding: 8px 0; color: #6c757d;">${settings.mailEncryption}</td>
              </tr>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">Username:</td>
                <td style="padding: 8px 0; color: #6c757d;">${settings.mailUsername}</td>
              </tr>
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">From Name:</td>
                <td style="padding: 8px 0; color: #6c757d;">${settings.mailFromName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #495057;">From Email:</td>
                <td style="padding: 8px 0; color: #6c757d;">${settings.mailFromEmail}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
            <p style="margin: 0; color: #155724; font-weight: bold;">
              ✅ Success! If you received this email, your SMTP configuration is working correctly!
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              Sent from Jobsify Notification Settings at ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    }

    // Send test email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ 
      message: `Test email sent successfully to ${emailAddress}`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json({ 
      error: 'Failed to send test email', 
      details: error.message 
    }, { status: 500 })
  }
}
