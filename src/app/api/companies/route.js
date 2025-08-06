import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { generateCompanyIdWithDB } from '@/utils/companyUtils';
import { 
  generateAdminWelcomeEmailTemplate, 
  generateCompanyWelcomeEmailTemplate 
} from '@/utils/emailTemplates';

const prisma = new PrismaClient();

// Initialize SMTP transporter for Mailgun using environment variables
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 2525,
    secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Function to generate random password
function generateRandomPassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Function to send welcome email to company admin via SMTP
async function sendCompanyWelcomeEmail(data, companyId, password) {
  // Check if SMTP transporter is configured
  if (!transporter || !process.env.MAILGUN_DOMAIN) {
    console.warn('Mailgun SMTP not configured - email not sent');
    return { success: false, error: 'Mailgun SMTP not configured' };
  }

  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

  const htmlTemplate = generateCompanyWelcomeEmailTemplate({
    adminFirstName: data.adminFirstName,
    adminLastName: data.adminLastName,
    companyName: data.companyName,
    companyId: companyId,
    adminEmail: data.adminEmail,
    password: password,
    companyPhone: data.phone,
    loginUrl
  });

  const mailOptions = {
    from: `${process.env.MAILGUN_FROM_NAME || 'Jobsify'} <${process.env.MAILGUN_FROM_EMAIL || 'noreply@jobsify.cc'}>`,
    to: data.adminEmail,
    subject: `Welcome to Jobsify - Company Registration Complete`,
    html: htmlTemplate,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}

// Function to send welcome email to customer via SMTP
async function sendCustomerWelcomeEmail(data, companyId, password) {
  // Check if SMTP transporter is configured
  if (!transporter || !process.env.MAILGUN_DOMAIN) {
    console.warn('Mailgun SMTP not configured - email not sent');
    return { success: false, error: 'Mailgun SMTP not configured' };
  }

  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

  const htmlTemplate = generateCustomerWelcomeEmailTemplate({
    customerFirstName: data.customerFirstName || data.companyName,
    customerLastName: data.customerLastName || 'Customer',
    companyName: data.companyName,
    companyId: companyId,
    customerEmail: data.customerEmail,
    password: password,
    loginUrl
  });

  const mailOptions = {
    from: `${process.env.MAILGUN_FROM_NAME || 'Jobsify'} <${process.env.MAILGUN_FROM_EMAIL || 'noreply@jobsify.cc'}>`,
    to: data.customerEmail,
    subject: `Welcome to ${data.companyName} - Your Account is Ready`,
    html: htmlTemplate,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Customer welcome email sent successfully:', result);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending customer welcome email:', error);
    return { success: false, error: error.message };
  }
}

// Create SMTP transporter using environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 2525,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// Send welcome email to new company
const sendWelcomeEmail = async (companyData) => {
  try {
    const transporter = createTransporter()
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

    const htmlTemplate = generateCompanyWelcomeEmailTemplate({
      adminFirstName: companyData.adminFirstName,
      adminLastName: companyData.adminLastName,
      companyName: companyData.companyName,
      companyId: companyData.companyId,
      companyEmail: companyData.companyEmail,
      companyPhone: companyData.companyPhone,
      loginUrl
    });

    const mailOptions = {
      from: `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
      to: companyData.adminEmail,
      subject: 'Welcome to Our Platform - Company Registration Successful',
      html: htmlTemplate
    }

    await transporter.sendMail(mailOptions)
    console.log('Welcome email sent successfully to:', companyData.adminEmail)
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Don't throw error here to avoid failing company creation if email fails
  }
}

// GET - Fetch all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany();
    const packages = await prisma.package.findMany();

    const packagesMap = packages.reduce((map, pkg) => {
      map[pkg.id] = pkg.name;

      return map;
    }, {});

    const transformedCompanies = companies.map(company => {
      return {
        ...company,
        companyEmail: company.companyEmail?.toLowerCase(),
        packageName: company.package ? packagesMap[company.package] : null,
      };
    });

    return NextResponse.json(transformedCompanies, { status: 200 });
  } catch (error) {
    console.error('Error fetching companies:', error);

    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.companyName) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Company name is required',
          message: 'Please provide a company name to continue.'
        },
        { status: 400 }
      )
    }

    if (!data.adminEmail || !data.adminPassword) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Admin email and password are required',
          message: 'Please provide both admin email and password.'
        },
        { status: 400 }
      )
    }

    // Get the module data to extract the module name
    let moduleType = 'MOBILE_DETAILING' // Default fallback
    let moduleCode = 'MD' // Default fallback

    if (data.module) {
      try {
        // Fetch the module data from database to get the actual module name
        const module = await prisma.module.findUnique({
          where: { id: data.module } // Remove parseInt since data.module should already be correct type
        })

        if (module) {
          // Use the actual module name from database
          moduleType = module.name.toUpperCase().replace(/\s+/g, '_')

          // Generate module code with specific mappings for known services
          const moduleName = module.name.toUpperCase()

          if (moduleName.includes('DRUG') || moduleName.includes('DNA') || moduleName.includes('SCREENING')) {
            moduleCode = 'DS'
          } else if (moduleName.includes('ADVANCE') && (moduleName.includes('DNA') || moduleName.includes('SCREENING'))) {
            moduleCode = 'ADS' // Specific handling for ADVANCE_DNA_SERVICE
          } else if (moduleName.includes('MOBILE') && moduleName.includes('DETAILING')) {
            moduleCode = 'MD'
          } else if (moduleName.includes('PRESSURE') && moduleName.includes('WASHING')) {
            moduleCode = 'PW'
          } else if (moduleName.includes('LAWN') && moduleName.includes('CARE')) {
            moduleCode = 'LC'
          } else if (moduleName.includes('CLEANING') && moduleName.includes('SERVICES')) {
            moduleCode = 'CS'
          } else if (moduleName.includes('HANDYMAN')) {
            moduleCode = 'HM'
          } else {
            // Fallback: Generate module code dynamically from the first letter of each word
            const words = moduleName.split(/\s+/)
            if (words.length === 1) {
              // Single word: take first two letters
              moduleCode = words[0].substring(0, 2)
            } else if (words.length >= 2) {
              // Multiple words: take first letter of each word, max 3 characters
              moduleCode = words.map(word => word.charAt(0)).join('').substring(0, 3)
            }
          }

          console.log(`Module: ${module.name} -> Type: ${moduleType} -> Code: ${moduleCode}`)
        }
      } catch (error) {
        console.warn('Failed to fetch module data, using defaults:', error)
      }
    }

    // Use company ID from form data or generate one if not provided
    let companyId = data.id
    if (!companyId) {
      companyId = await generateCompanyIdWithDB(moduleType, prisma)
    }

    // Extract companyCode and moduleCode from the companyId
    // CompanyId format: ADS-0001-CO-25-00001
    const companyIdParts = companyId.split('-')
    const extractedModuleCode = companyIdParts[0] // Extract ADS, MD, etc.
    const companyCode = companyIdParts[1] // Extract 0001, 0002, etc.

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(data.adminPassword, 12)

    // Use transaction to ensure both company and user are created together
    const result = await prisma.$transaction(async (tx) => {
      // Calculate trial period (30 days from now)
      const trialStartDate = new Date()
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 30)
      
      console.log('Setting up trial period:', {
        startDate: trialStartDate.toISOString(),
        endDate: trialEndDate.toISOString()
      })

      // Create the company
      const company = await tx.company.create({
        data: {
          id: require('crypto').randomUUID(), // Generate a unique ID
          companyName: data.companyName,
          companyEmail: data.companyEmail?.toLowerCase(), // Convert to lowercase
          companyWebsite: data.companyWebsite || data.website,
          status: 'Trial', // Set status to Trial for new companies
          companyPhone: data.companyPhone,
          companyLogo: data.companyLogoUrl, // Save the logo URL to database
          adminEmail: data.adminEmail,
          adminFirstName: data.adminFirstName || '',
          adminLastName: data.adminLastName || '',
          companyAddress: data.streetAddress,
          city: data.city,
          state: data.state,
          zipcode: data.zipCode, // Note: schema uses 'zipcode' not 'zipCode'
          defaultCurrency: data.defaultCurrency || 'USD',
          language: data.language || 'English',
          companyId: companyId, // This is the unique business identifier (ADS-0001-CO-25-00001)
          package: 'trial', // Set package to trial
          packageDate: trialStartDate, // Set trial start date
          trialStartDate: trialStartDate, // Set trial start date
          trialEndDate: trialEndDate, // Set trial end date
          isTrialExpired: false, // Initialize as not expired
          moduleId: data.module, // Set moduleId directly
          modules: {
            connect: { id: data.module } // Connect the selected module
          }
        }
      })

      // Check if admin user already exists
      const existingUser = await tx.user.findUnique({
        where: { email: data.adminEmail }
      })

      let adminUser
      if (existingUser) {
        // Update existing user to be admin of this company
        adminUser = await tx.user.update({
          where: { email: data.adminEmail },
          data: {
            role: 'ADMIN',
            companyName: data.companyName,
            businessType: 'PRIVATE'
          }
        })
      } else {
        // Create new admin user
        adminUser = await tx.user.create({
          data: {
            firstName: data.adminFirstName,
            lastName: data.adminLastName,
            email: data.adminEmail,
            hashedPassword: hashedPassword,
            role: 'ADMIN',
            companyId: company.id, // Link user to company
            companyName: data.companyName,
            businessType: 'PRIVATE' // Default business type
          }
        })
      }

      // Create customer user if login is allowed
      let customerUser = null
      if (data.loginAllowed && data.customerEmail && data.customerPassword) {
        // Hash customer password
        const customerHashedPassword = await bcrypt.hash(data.customerPassword, 12)

        // Check if customer user already exists
        const existingCustomer = await tx.user.findUnique({
          where: { email: data.customerEmail }
        })

        if (!existingCustomer) {
          customerUser = await tx.user.create({
            data: {
              firstName: data.customerFirstName || data.companyName,
              lastName: data.customerLastName || 'Customer',
              email: data.customerEmail,
              hashedPassword: customerHashedPassword,
              role: 'EMPLOYEE', // Customer role
              companyName: data.companyName,
              businessType: 'PRIVATE',
              emailVerified: new Date() // Mark as verified
            }
          })
        }
      }

      return { company, adminUser, customerUser }
    })

    // Send comprehensive welcome email (non-blocking)
    try {
      await sendCompanyWelcomeEmail(
        data,
        result.company.companyId,
        data.adminPassword // Send original password in email
      )
      console.log('Welcome email sent successfully to:', data.adminEmail)
    } catch (emailError) {
      console.warn('Failed to send welcome email:', emailError)
      // Don't fail the request if email fails
    }

    // Send customer welcome email if customer user was created
    if (result.customerUser && data.loginAllowed) {
      try {
        await sendCustomerWelcomeEmail(
          data,
          result.company.companyId,
          data.customerPassword // Send original password in email
        )
        console.log('Customer welcome email sent successfully to:', data.customerEmail)
      } catch (emailError) {
        console.warn('Failed to send customer welcome email:', emailError)
        // Don't fail the request if email fails
      }
    }

    const response = {
      success: true,
      message: `Company "${data.companyName}" created successfully!`,
      company: result.company,
      adminUser: {
        id: result.adminUser.id,
        email: result.adminUser.email,
        role: result.adminUser.role
      }
    }

    // Include customer user info if created
    if (result.customerUser) {
      response.customerUser = {
        id: result.customerUser.id,
        email: result.customerUser.email,
        role: result.customerUser.role
      }
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      // Unique constraint violation
      const field = error.meta?.target?.[0] || 'field'
      let message = 'This record already exists'

      if (field === 'companyEmail') {
        message = 'A company with this email address already exists'
      } else if (field === 'companyId') {
        message = 'A company with this ID already exists'
      }

      return NextResponse.json(
        {
          success: false,
          error: message,
          type: 'validation',
          field: field
        },
        { status: 400 }
      )
    }

    // Handle database connection errors
    if (error.code === 'P1017') {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed. Please try again.',
          type: 'connection'
        },
        { status: 503 }
      )
    }

    // Handle transaction timeout errors
    if (error.code === 'P2028') {
      return NextResponse.json(
        {
          success: false,
          error: 'Request timed out. Please try again.',
          type: 'timeout'
        },
        { status: 408 }
      )
    }

    // Generic error fallback
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create company. Please try again.',
        message: `Error creating company: ${error.message}`,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}