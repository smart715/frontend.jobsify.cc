
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For SUPER_ADMIN users, return all configurations or empty array if no company
    if (session.user.role === 'SUPER_ADMIN') {
      const configurations = await prisma.paymentGatewayConfiguration.findMany()
      return NextResponse.json(configurations)
    }

    // For regular users, require companyId
    if (!session.user.companyId) {
      return NextResponse.json({ error: 'Unauthorized - No company assigned' }, { status: 401 })
    }

    const configurations = await prisma.paymentGatewayConfiguration.findMany({
      where: {
        companyId: session.user.companyId
      }
    })

    return NextResponse.json(configurations)
  } catch (error) {
    console.error('Error fetching payment gateway configurations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { provider, isEnabled, configuration, companyId } = await request.json()

    if (!provider || !configuration) {
      return NextResponse.json({ error: 'Provider and configuration are required' }, { status: 400 })
    }

    let targetCompanyId = session.user.companyId

    // For SUPER_ADMIN users, allow specifying companyId or create global config
    if (session.user.role === 'SUPER_ADMIN') {
      if (companyId) {
        targetCompanyId = companyId
      } else {
        // Allow global configuration for SUPER_ADMIN without companyId
        targetCompanyId = null
      }
    } else {
      // For regular users, require companyId
      if (!targetCompanyId) {
        return NextResponse.json({ error: 'Unauthorized - No company assigned' }, { status: 401 })
      }
    }

    let paymentGatewayConfig

    if (targetCompanyId === null) {
      // For global configurations, find by provider only
      const existingConfig = await prisma.paymentGatewayConfiguration.findFirst({
        where: {
          companyId: null,
          provider: provider
        }
      })

      if (existingConfig) {
        paymentGatewayConfig = await prisma.paymentGatewayConfiguration.update({
          where: { id: existingConfig.id },
          data: {
            isEnabled,
            configuration
          }
        })
      } else {
        paymentGatewayConfig = await prisma.paymentGatewayConfiguration.create({
          data: {
            companyId: null,
            provider,
            isEnabled,
            configuration
          }
        })
      }
    } else {
      // For company-specific configurations, use the existing upsert logic
      paymentGatewayConfig = await prisma.paymentGatewayConfiguration.upsert({
        where: {
          companyId_provider: {
            companyId: targetCompanyId,
            provider: provider
          }
        },
        update: {
          isEnabled,
          configuration
        },
        create: {
          companyId: targetCompanyId,
          provider,
          isEnabled,
          configuration
        }
      })
    }

    return NextResponse.json(paymentGatewayConfig)
  } catch (error) {
    console.error('Error saving payment gateway configuration:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
