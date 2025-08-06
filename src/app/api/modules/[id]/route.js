import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch a specific module
export async function GET(request, { params }) {
  try {
    const { id } = await params

    // Validate that id exists
    if (!id) {
      return NextResponse.json(
        { error: 'Invalid module ID provided' },
        { status: 400 }
      )
    }

    const module = await prisma.module.findUnique({
      where: { id: id },
      include: {
        featureAssignments: {
          include: {
            feature: true
          }
        }
      }
    })

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(module)
  } catch (error) {
    console.error('Error fetching module:', error)
    return NextResponse.json(
      { error: 'Failed to fetch module' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const data = await request.json()
    const { name, description, isActive, sortOrder } = data

    // If name is being updated, regenerate the module code
    let updateData = { description, isActive, sortOrder }

    if (name) {
      updateData.name = name

      // Generate 2-digit module code
      const moduleName = name.toUpperCase()
      let moduleCode

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

      // Ensure module code is exactly 2 characters and uppercase
      updateData.code = moduleCode.toUpperCase().substring(0, 2).padEnd(2, 'X')

      console.log(`🛠 [API/modules] Updated module code: ${name} -> ${updateData.code}`)
    }

    const updatedModule = await prisma.module.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, module: updatedModule })
  } catch (error) {
    console.error('🛠 [API/modules] Error updating module:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - Delete a module
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Validate that id exists
    if (!id) {
      return NextResponse.json(
        { error: 'Invalid module ID provided' },
        { status: 400 }
      )
    }

    await prisma.module.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Module deleted successfully' })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    )
  }
}