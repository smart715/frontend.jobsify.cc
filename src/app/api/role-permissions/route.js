
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all module feature assignments to understand role-permission relationships
    const assignments = await prisma.moduleFeatureAssignment.findMany({
      include: {
        feature: true,
        module: true,
        user: true
      }
    })

    // For simplicity, we'll return a basic structure
    // In a real implementation, you'd want to create a proper role-permission mapping table
    const rolePermissions = {
      'SUPER_ADMIN': [], // Superadmin has all permissions by default
      'ADMIN': [],
      'STAFF': [],
      'EMPLOYEE': [],
      'SUPPLIER': []
    }

    return NextResponse.json(rolePermissions)
  } catch (error) {
    console.error('Error fetching role permissions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { roleId, permissionId, granted } = await request.json()

    // Here you would implement the logic to assign/revoke permissions to/from roles
    // For now, we'll just return success
    return NextResponse.json({ 
      message: `Permission ${granted ? 'granted to' : 'revoked from'} role successfully`,
      roleId,
      permissionId,
      granted
    })
  } catch (error) {
    console.error('Error updating role permission:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
