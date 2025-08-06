import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch a single company by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const company = await prisma.company.findUnique({
      where: {
        id: id
      },
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    )
  }
}

// PUT - Update a company by ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      companyName,
      companyEmail,
      website,
      moduleId,
      status,
      companyPhone,
      companyLogoUrl,
      adminFirstName,
      adminLastName,
      adminEmail,
      streetAddress,
      city,
      state,
      zipCode,
      defaultCurrency,
      language
    } = body

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id }
    })

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Update the company
    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        companyName,
        companyEmail,
        companyWebsite: website,
        ...(moduleId && {
          moduleId: moduleId, // Set moduleId directly
          modules: {
            set: [{ id: moduleId }] // Replace existing modules with the selected one
          }
        }),
        status,
        companyPhone,
        companyLogoUrl,
        adminFirstName,
        adminLastName,
        adminEmail,
        streetAddress,
        city,
        state,
        zipcode: zipCode, // Note: schema uses 'zipcode' not 'zipCode'
        defaultCurrency,
        language
      }
    })

    return NextResponse.json(updatedCompany)
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a company by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id }
    })

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Use a transaction to ensure both company and users are deleted together
    await prisma.$transaction(async (tx) => {
      // First, delete all users associated with this company
      await tx.user.deleteMany({
        where: {
          email: existingCompany.adminEmail
        }
      })

      // Also delete any users that might be associated with the company through other means
      // You can expand this if you have other ways users are linked to companies
      await tx.user.deleteMany({
        where: {
          companyName: existingCompany.companyName
        }
      })

      // Then delete the company
      await tx.company.delete({
        where: { id }
      })
    })

    return NextResponse.json({ 
      message: 'Company and associated user accounts deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting company and users:', error)
    return NextResponse.json(
      { error: 'Failed to delete company and associated users' },
      { status: 500 }
    )
  }
}
