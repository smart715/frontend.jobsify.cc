
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateCustomerIdWithDB } from '@/utils/customerUtils'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const moduleCode = searchParams.get('moduleCode') || 'MD'
    const companyCode = searchParams.get('companyCode') || '0001'

    const customerId = await generateCustomerIdWithDB(prisma, moduleCode, companyCode)

    return NextResponse.json({ customerId })
  } catch (error) {
    console.error('Error generating next customer ID:', error)
    return NextResponse.json(
      { error: 'Failed to generate customer ID' },
      { status: 500 }
    )
  }
}
