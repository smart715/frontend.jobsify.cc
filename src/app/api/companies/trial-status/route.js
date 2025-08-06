
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

// GET - Check trial status for a company
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

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        companyName: true,
        status: true,
        package: true,
        packageDate: true,
        trialStartDate: true,
        trialEndDate: true,
        isTrialExpired: true
      }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const now = new Date()
    let trialStatus = 'active'
    let daysRemaining = 0

    // Check if company has a trial end date
    if (company.trialEndDate) {
      daysRemaining = Math.ceil((new Date(company.trialEndDate) - now) / (1000 * 60 * 60 * 24))
      
      if (daysRemaining <= 0) {
        trialStatus = 'expired'
        
        // Update company status if trial has expired
        if (!company.isTrialExpired) {
          await prisma.company.update({
            where: { id: companyId },
            data: {
              isTrialExpired: true,
              status: 'Trial Expired'
            }
          })
        }
      } else if (daysRemaining <= 7) {
        trialStatus = 'expiring_soon'
      }
    }

    // If company doesn't have trial package or has paid package, it's not on trial
    if (company.package && company.package !== 'trial') {
      trialStatus = 'active'
      daysRemaining = 0
    }

    return NextResponse.json({
      success: true,
      trial: {
        status: trialStatus,
        daysRemaining: Math.max(0, daysRemaining),
        startDate: company.trialStartDate,
        endDate: company.trialEndDate,
        isExpired: company.isTrialExpired || trialStatus === 'expired'
      },
      company: {
        id: company.id,
        name: company.companyName,
        status: company.status,
        package: company.package
      }
    })

  } catch (error) {
    console.error('Error checking trial status:', error)
    return NextResponse.json(
      { error: 'Failed to check trial status' },
      { status: 500 }
    )
  }
}

// POST - Upgrade company from trial to paid plan
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { companyId, packageId, paymentDetails } = data

    if (!companyId || !packageId) {
      return NextResponse.json({ 
        error: 'Company ID and package ID are required' 
      }, { status: 400 })
    }

    // Get the package details
    const selectedPackage = await prisma.package.findUnique({
      where: { id: packageId }
    })

    if (!selectedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    // Update company to paid status
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        package: packageId,
        packageDate: new Date(),
        status: 'Active',
        isTrialExpired: false,
        trialEndDate: null // Clear trial end date since they've upgraded
      }
    })

    // Update or create subscription record
    await prisma.subscription.upsert({
      where: { userid: session.user.id },
      update: {
        pricingtierid: packageId,
        status: 'ACTIVE',
        startdate: new Date()
      },
      create: {
        userid: session.user.id,
        pricingtierid: packageId,
        status: 'ACTIVE',
        startdate: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Company successfully upgraded to paid plan',
      company: updatedCompany
    })

  } catch (error) {
    console.error('Error upgrading company:', error)
    return NextResponse.json(
      { error: 'Failed to upgrade company' },
      { status: 500 }
    )
  }
}
