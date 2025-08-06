
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateCustomerIdWithDB } from '@/utils/customerUtils'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()

    // Get company information to extract moduleCode and companyCode
    let moduleCode = 'XX';
    let companyCode = '0000';
    
    if (body.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: body.companyId },
        select: { moduleCode: true, companyCode: true }
      });
      
      if (company) {
        moduleCode = company.moduleCode || 'XX';
        companyCode = company.companyCode || '0000';
      }
    }

    // Generate customer ID automatically
    const customerId = await generateCustomerIdWithDB(prisma, moduleCode, companyCode)

    // Prepare customer data
    const customerData = {
      customerId,
      companyId: body.companyId || null,
      salutation: body.salutation || null,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      mobile: body.mobile || null,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      zipCode: body.zipCode || null,
      postalCode: body.postalCode || null,
      company: body.company || null,
      companyAddress: body.companyAddress || null,
      country: body.country || 'United States',
      gender: body.gender || 'Male',
      language: body.language || 'English',
      loginAllowed: body.loginAllowed || false,
      receiveNotifications: body.receiveNotifications || false,
      officialWebsite: body.officialWebsite || null,
      taxName: body.taxName || null,
      officePhone: body.officePhone || null,
      status: body.status || 'Active',
      notes: body.notes || null
    }

    const customer = await prisma.customer.create({
      data: customerData
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
