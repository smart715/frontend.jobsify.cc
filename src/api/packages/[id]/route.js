import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const { id } = params

    const package = await prisma.package.findUnique({
      where: {
        id: id,
      },
    })

    if (!package) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    return NextResponse.json(package)
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const updatedPackage = await prisma.package.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        type: data.type,
        maxEmployees: parseInt(data.maxEmployees),
        positionNo: parseInt(data.positionNo),
        private: data.private,
        recommended: data.recommended,
        monthly_currency: data.monthly_currency,
        yearly_currency: data.yearly_currency,
        hasMonthly: data.hasMonthly,
        monthlyPrice: data.hasMonthly ? parseFloat(data.monthlyPrice) : null,
        hasAnnual: data.hasAnnual,
        annualPrice: data.hasAnnual ? parseFloat(data.annualPrice) : null,
        features: data.features,
        modules: data.modules,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.package.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ message: 'Package deleted successfully' })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}