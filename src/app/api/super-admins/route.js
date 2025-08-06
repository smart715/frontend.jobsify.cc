import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { generateSuperAdminWelcomeEmailTemplate } from '@/utils/emailWelcomeSuperAdmin'

const prisma = new PrismaClient()

// Create SMTP transporter using environment variables
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 2525,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// Function to send welcome email to new super admin via SMTP
async function sendSuperAdminWelcomeEmail(data, password) {
  const transporter = createTransporter()

  // Check if SMTP transporter is configured
  if (!transporter || !process.env.SMTP_HOST) {
    console.warn('SMTP not configured - email not sent');
    return { success: false, error: 'SMTP not configured' };
  }

  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

  const htmlTemplate = generateSuperAdminWelcomeEmailTemplate({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: password,
    loginUrl
  });

  const mailOptions = {
    from: `${process.env.MAILGUN_FROM_NAME || 'Jobsify'} <${process.env.MAILGUN_FROM_EMAIL || 'noreply@jobsify.cc'}>`,
    to: data.email,
    subject: `Welcome to Jobsify - Super Admin Account Created`,
    html: htmlTemplate,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Super admin welcome email sent successfully:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending super admin welcome email:', error);
    return { success: false, error: error.message };
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const superAdmins = await prisma.user.findMany({
      where: {
        role: 'SUPER_ADMIN'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(superAdmins)
  } catch (error) {
    console.error('Error fetching super admins:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create super admin user
    const superAdmin = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        hashedPassword,
        role: 'SUPER_ADMIN',
        emailVerified: new Date() // Mark as verified
      }
    })

    // Send welcome email (non-blocking)
    try {
      await sendSuperAdminWelcomeEmail(
        { firstName, lastName, email },
        password // Send original password in email
      )
      console.log('Super admin welcome email sent successfully to:', email)
    } catch (emailError) {
      console.warn('Failed to send super admin welcome email:', emailError)
      // Don't fail the request if email fails
    }

    // Remove password from response
    const { hashedPassword: _, ...superAdminWithoutPassword } = superAdmin

    return NextResponse.json(superAdminWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Error creating super admin:', error)
    return NextResponse.json(
      { error: 'Failed to create super admin' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const { id, firstName, lastName, email, role } = await request.json()

    // Validate required fields
    if (!id || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Super admin not found' },
        { status: 404 }
      )
    }

    // Check if email is already taken by another user
    const emailTaken = await prisma.user.findFirst({
      where: {
        email,
        id: { not: id }
      }
    })

    if (emailTaken) {
      return NextResponse.json(
        { error: 'Email is already taken by another user' },
        { status: 409 }
      )
    }

    // Update super admin user
    const updatedSuperAdmin = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        role: role || 'SUPER_ADMIN'
      }
    })

    // Remove password from response
    const { hashedPassword: _, ...superAdminWithoutPassword } = updatedSuperAdmin

    return NextResponse.json(superAdminWithoutPassword, { status: 200 })
  } catch (error) {
    console.error('Error updating super admin:', error)
    return NextResponse.json(
      { error: 'Failed to update super admin' },
      { status: 500 }
    )
  }
}