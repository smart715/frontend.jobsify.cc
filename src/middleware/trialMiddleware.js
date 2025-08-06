
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function checkTrialStatus(request, companyId) {
  if (!companyId) {
    return null // No company ID, let request proceed
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        status: true,
        package: true,
        trialEndDate: true,
        isTrialExpired: true
      }
    })

    if (!company) {
      return null // Company not found, let request proceed
    }

    // If company has a paid package, allow access
    if (company.package && company.package !== 'trial') {
      return null
    }

    // Check if trial has expired
    if (company.trialEndDate) {
      const now = new Date()
      const trialEnd = new Date(company.trialEndDate)
      
      if (now > trialEnd && !company.isTrialExpired) {
        // Update company status to expired
        await prisma.company.update({
          where: { id: companyId },
          data: {
            isTrialExpired: true,
            status: 'Trial Expired'
          }
        })
        
        // Return trial expired response
        return NextResponse.json(
          { 
            error: 'Trial expired', 
            message: 'Your trial period has ended. Please upgrade to continue using our services.',
            trialExpired: true 
          }, 
          { status: 403 }
        )
      }
    }

    return null // Trial is still active
  } catch (error) {
    console.error('Error checking trial status:', error)
    return null // On error, let request proceed
  }
}
