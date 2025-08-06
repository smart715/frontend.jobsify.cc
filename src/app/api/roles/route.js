import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all roles with user count
    const roles = await prisma.$queryRaw`
      SELECT 
        r.id,
        r.name,
        r.description,
        r."isActive",
        r."isDefault",
        r."createdAt",
        r."updatedAt",
        COUNT(u.id)::int as "userCount"
      FROM "roles" r
      LEFT JOIN "users" u ON u."roleId" = r.id
      GROUP BY r.id, r.name, r.description, r."isActive", r."isDefault", r."createdAt", r."updatedAt"
      ORDER BY r.name
    `

    return NextResponse.json(roles)
  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, isActive, isDefault } = await request.json()

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 })
    }

    // Check if role name already exists
    const existingRole = await prisma.role.findFirst({
      where: { name }
    })

    if (existingRole) {
      return NextResponse.json({ error: 'Role name already exists' }, { status: 400 })
    }

    // If setting as default, remove default from other roles
    if (isDefault) {
      await prisma.role.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    const newRole = await prisma.role.create({
      data: {
        name,
        description: description || null,
        isActive: isActive !== false,
        isDefault: isDefault === true
      }
    })

    return NextResponse.json(newRole, { status: 201 })
  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}