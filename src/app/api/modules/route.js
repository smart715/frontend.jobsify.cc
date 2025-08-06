import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/modules
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🛠 [API/modules] GET handler called')

    const modules = await prisma.module.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        code: true,
        sortOrder: true
      }
    })

    console.log('🛠 [API/modules] Modules found:', modules.length)

    return NextResponse.json(modules)
  } catch (error) {
    console.error('🛠 [API/modules] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/modules
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { name, description, isActive = true, code } = data

    if (!name) {
      return NextResponse.json({ error: 'Module name is required' }, { status: 400 })
    }

    // Generate 2-digit module code if not provided
    let moduleCode = code
    if (!moduleCode) {
      const moduleName = name.toUpperCase()
      
      // Check for specific known patterns first
      if (moduleName.includes('MOBILE') && moduleName.includes('DETAILING')) {
        moduleCode = 'MD'
      } else if (moduleName.includes('PRESSURE') && moduleName.includes('WASHING')) {
        moduleCode = 'PW'
      } else if (moduleName.includes('LAWN') && moduleName.includes('CARE')) {
        moduleCode = 'LC'
      } else if (moduleName.includes('CLEANING') && moduleName.includes('SERVICES')) {
        moduleCode = 'CS'
      } else if (moduleName.includes('HANDYMAN')) {
        moduleCode = 'HM'
      } else if (moduleName.includes('DRUG') || moduleName.includes('DNA') || moduleName.includes('SCREENING')) {
        moduleCode = 'DS'
      } else if (moduleName.includes('ADVANCE') && (moduleName.includes('DNA') || moduleName.includes('SCREENING'))) {
        moduleCode = 'AD'
      } else {
        // Generate code dynamically from the module name
        const words = moduleName.replace(/[^A-Z\s]/g, '').split(/\s+/).filter(word => word.length > 0)
        if (words.length === 1) {
          // Single word: take first two letters
          moduleCode = words[0].substring(0, 2)
        } else if (words.length >= 2) {
          // Multiple words: take first letter of each word, limit to 2 characters
          moduleCode = words.map(word => word.charAt(0)).join('').substring(0, 2)
        } else {
          // Fallback
          moduleCode = 'MD'
        }
      }
    }

    // Ensure module code is exactly 2 characters and uppercase
    moduleCode = moduleCode.toUpperCase().substring(0, 2).padEnd(2, 'X')

    console.log(`🛠 [API/modules] Generated module code: ${name} -> ${moduleCode}`)

    const module = await prisma.module.create({
      data: {
        name,
        description,
        isActive,
        code: moduleCode
      }
    })

    return NextResponse.json({ success: true, module })
  } catch (error) {
    console.error('🛠 [API/modules] Error creating module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}