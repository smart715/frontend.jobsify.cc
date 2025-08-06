// force Node.js runtime so Prisma can run
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Debug right away
console.log('🛠 [API/packages] Prisma models:', Object.keys(prisma))

export async function GET() {
  try {
    console.log('🛠 [API/packages] GET handler called')
    const packages = await prisma.package.findMany()

    // Fetch module names for each package
    const packagesWithModuleNames = await Promise.all(
      packages.map(async (pkg) => {
        let moduleNames = []

        if (pkg.modules) {
          // Handle both array and string cases
          let modulesToProcess = Array.isArray(pkg.modules) ? pkg.modules : [pkg.modules]

          for (const moduleItem of modulesToProcess) {
            try {
              let module = null

              // Check if moduleItem is an ID (cuid format) or a name
              if (typeof moduleItem === 'string' && moduleItem.match(/^c[a-z0-9]{24}$/)) {
                // It's a cuid ID, fetch the module name and code
                module = await prisma.module.findUnique({
                  where: { id: moduleItem },
                  select: { name: true, code: true }
                })
                if (module) {
                  moduleNames.push(`${module.name} (${module.code})`)
                }
              } else if (typeof moduleItem === 'string') {
                // It's already a module name or some other string
                moduleNames.push(moduleItem)
              }
            } catch (error) {
              console.error(`Error processing module ${moduleItem}:`, error)
              // If it fails, treat it as a name
              if (typeof moduleItem === 'string') {
                moduleNames.push(moduleItem)
              }
            }
          }
        }

        return {
          ...pkg,
          moduleNames: moduleNames.length > 0 ? moduleNames : ['No modules assigned']
        }
      })
    )

    return NextResponse.json(packagesWithModuleNames)
  } catch (error) {
    console.error('❌ [API/packages] GET error:', error)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const requestBody = await request.json()
    console.log('🛠 [API/packages] POST request body:', requestBody)

    const {
      packageType,
      name,
      type,
      maxEmployees,
      positionNo,
      private: isPrivate,
      recommended,
      hasMonthly,
      monthlyPrice,
      monthly_currency,
      hasAnnual,
      annualPrice,
      yearly_currency,
      features,
      modules
    } = requestBody

    // Validate required fields
    if (!packageType || !name) {
      return NextResponse.json(
        { error: 'Package type and name are required' },
        { status: 400 }
      )
    }

    if (!maxEmployees || isNaN(Number(maxEmployees))) {
      return NextResponse.json(
        { error: 'Valid max employees number is required' },
        { status: 400 }
      )
    }

    const newPackage = await prisma.package.create({
      data: {
        packageType,
        name,
        type: type || 'standard', // Default to 'standard' if not provided
        maxEmployees: Number(maxEmployees),
        positionNo: Number(positionNo || 0),
        private: Boolean(isPrivate),
        recommended: Boolean(recommended),
        hasMonthly: Boolean(hasMonthly),
        monthlyPrice: monthlyPrice ? Number(monthlyPrice) : null,
        monthly_currency: monthly_currency || null,
        hasAnnual: Boolean(hasAnnual),
        annualPrice: annualPrice ? Number(annualPrice) : null,
        yearly_currency: yearly_currency || null,
        features: features || [],
        modules: Array.isArray(modules) ? modules : []
      }
    })

    console.log('✅ [API/packages] Package created successfully:', newPackage.id)
    return NextResponse.json(newPackage, { status: 201 })
  } catch (error) {
    console.error('❌ [API/packages] POST error:', error)

    return NextResponse.json({ 
      error: error.message || 'Failed to create package' 
    }, { status: 500 })
  }
}
