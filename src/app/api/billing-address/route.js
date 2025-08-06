
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

// GET - Fetch billing address for a company
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

    const billingAddress = await prisma.billingAddress.findUnique({
      where: { companyId }
    })

    return NextResponse.json(billingAddress)
  } catch (error) {
    console.error('Error fetching billing address:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create or update billing address
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { 
      companyId, 
      companyName, 
      billingEmail, 
      taxId, 
      vatNumber, 
      phoneNumber, 
      country, 
      address1, 
      address2, 
      city, 
      state, 
      zipCode 
    } = data

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
    }

    const billingAddress = await prisma.billingAddress.upsert({
      where: { companyId },
      update: {
        companyName,
        billingEmail,
        taxId,
        vatNumber,
        phoneNumber,
        country,
        address1,
        address2,
        city,
        state,
        zipCode
      },
      create: {
        companyId,
        companyName,
        billingEmail,
        taxId,
        vatNumber,
        phoneNumber,
        country,
        address1,
        address2,
        city,
        state,
        zipCode
      }
    })

    return NextResponse.json(billingAddress, { status: 201 })
  } catch (error) {
    console.error('Error saving billing address:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
