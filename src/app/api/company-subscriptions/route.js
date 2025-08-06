import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Function to send package upgrade email
async function sendPackageUpgradeEmail(company, packageData, billingCycle, amount) {
  if (!transporter || !process.env.MAILGUN_DOMAIN) {
    console.warn('Mailgun SMTP not configured - email not sent')
    return { success: false, error: 'Mailgun SMTP not configured' }
  }

  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`
  const billingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing`

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Package Upgrade Confirmation</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 30px; }
            .upgrade-details { background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea; }
            .upgrade-details h3 { margin-top: 0; color: #667eea; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 20px 0; }
            .button:hover { opacity: 0.9; }
            .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
            .highlight { color: #667eea; font-weight: 600; }
            .price { font-size: 24px; font-weight: bold; color: #28a745; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Package Upgrade Successful!</h1>
            </div>

            <div class="content">
                <h2>Hello ${company.adminFirstName} ${company.adminLastName},</h2>

                <p>Great news! Your company <strong>${company.companyName}</strong> has been successfully upgraded to a new package.</p>

                <div class="upgrade-details">
                    <h3>Upgrade Details</h3>
                    <p><strong>New Package:</strong> <span class="highlight">${packageData.name}</span></p>
                    <p><strong>Billing Cycle:</strong> <span class="highlight">${billingCycle === 'yearly' ? 'Annual' : 'Monthly'}</span></p>
                    <p><strong>Amount:</strong> <span class="price">$${amount}</span></p>
                    <p><strong>Max Employees:</strong> <span class="highlight">${packageData.maxEmployees}</span></p>
                    <p><strong>Upgrade Date:</strong> <span class="highlight">${new Date().toLocaleDateString()}</span></p>
                </div>

                <h3>What's Next?</h3>
                <ul>
                    <li>Your new package features are now active</li>
                    <li>You can access all the enhanced capabilities immediately</li>
                    <li>Billing will continue on your selected ${billingCycle} cycle</li>
                    <li>You can manage your subscription anytime from your dashboard</li>
                </ul>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${loginUrl}" class="button">Access Your Dashboard</a>
                    <a href="${billingUrl}" class="button" style="margin-left: 10px;">Manage Billing</a>
                </div>

                <p>If you have any questions about your upgrade or need assistance with the new features, please don't hesitate to contact our support team.</p>

                <p>Thank you for choosing Jobsify!</p>

                <p>Best regards,<br>
                <strong>The Jobsify Team</strong></p>
            </div>

            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Jobsify LLC. All rights reserved.</p>
                <p>This email was sent to ${company.adminEmail} regarding your Jobsify account.</p>
            </div>
        </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: `${process.env.MAILGUN_FROM_NAME || 'Jobsify'} <${process.env.MAILGUN_FROM_EMAIL || 'noreply@jobsify.cc'}>`,
    to: company.adminEmail,
    subject: `🎉 Package Upgrade Successful - ${packageData.name} Plan Activated`,
    html: htmlTemplate
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Package upgrade email sent successfully to ${company.adminEmail}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending package upgrade email:', error)
    throw error
  }
}

// GET - Fetch subscription for a company
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

    const subscription = await prisma.companySubscription.findUnique({
      where: { companyId },
      include: {
        package: true
      }
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to generate next invoice ID
async function generateNextInvoiceId() {
  const lastInvoice = await prisma.invoice.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { invoiceId: true }
  })

  if (!lastInvoice || !lastInvoice.invoiceId) {
    return 'INV-0001'
  }

  const lastNumber = parseInt(lastInvoice.invoiceId.split('-')[1])
  const nextNumber = lastNumber + 1
  return `INV-${nextNumber.toString().padStart(4, '0')}`
}

// POST - Create or update subscription
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { companyId, packageId, billingCycle = 'monthly' } = data

    if (!companyId || !packageId) {
      return NextResponse.json({ error: 'Company ID and Package ID are required' }, { status: 400 })
    }

    // Get package details
    const packageData = await prisma.package.findUnique({
      where: { id: packageId }
    })

    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    // Get company details for email notification
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        companyName: true,
        adminEmail: true,
        adminFirstName: true,
        adminLastName: true,
        package: true
      }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Calculate amount based on billing cycle
    const amount = billingCycle === 'yearly' ? packageData.annualPrice : packageData.monthlyPrice

    // Generate invoice ID
    const invoiceId = await generateNextInvoiceId()

    // Calculate due date (30 days from now)
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Create invoice first
    const invoice = await prisma.invoice.create({
      data: {
        invoiceId,
        companyId,
        projectName: `${packageData.name} Package Subscription`,
        duration: billingCycle === 'yearly' ? '12 months' : '1 month',
        startDate: new Date(),
        endDate: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
        amount,
        paidAmount: 0,
        unpaidAmount: amount,
        status: 'Pending',
        dueDate,
        notes: `Package upgrade to ${packageData.name} plan for ${company.companyName}`
      }
    })

    // Calculate next billing date
    const nextBillingDate = new Date()
    if (billingCycle === 'yearly') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1)
    } else {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
    }

    const subscription = await prisma.companySubscription.upsert({
      where: { companyId },
      update: {
        packageId,
        amount,
        billingCycle,
        nextBillingDate,
        status: 'active'
      },
      create: {
        companyId,
        packageId,
        amount,
        billingCycle,
        nextBillingDate,
        status: 'active'
      },
      include: {
        package: true
      }
    })

    // Update company's package field and status
    await prisma.company.update({
      where: { id: companyId },
      data: { 
        package: packageId,
        packageDate: new Date(),
        status: 'Active',
        isTrialExpired: false,
        trialEndDate: null // Clear trial data since they've upgraded
      }
    })

    // Send upgrade notification email
    try {
      await sendPackageUpgradeEmail(company, packageData, billingCycle, amount)
    } catch (emailError) {
      console.error('Error sending upgrade email:', emailError)
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({ 
      subscription, 
      invoice,
      message: 'Package upgraded successfully and invoice generated'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating subscription:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}