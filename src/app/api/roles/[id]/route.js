// force Node.js runtime so Prisma can run
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { name, description, isActive, isDefault } = await request.json()

    // Prevent modification of system roles
    if (id === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot modify system roles' }, { status: 400 })
    }

    // If setting as default, remove default from other roles
    if (isDefault) {
      await prisma.roles.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    const updatedRole = await prisma.roles.update({
      where: { id },
      data: {
        name,
        description,
        isActive,
        isDefault
      }
    })

    return NextResponse.json(updatedRole)
  } catch (error) {
    console.error('Error updating role:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Prevent deletion of system roles
    if (id === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot delete system roles' }, { status: 400 })
    }

    // Check if role has users assigned
    const usersWithRole = await prisma.user.count({
      where: { role: id }
    })

    if (usersWithRole > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete role with assigned users' 
      }, { status: 400 })
    }

    await prisma.roles.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Role deleted successfully' })
  } catch (error) {
    console.error('Error deleting role:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}