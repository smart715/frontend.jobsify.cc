import { NextResponse } from 'next/server'
import { prisma } from '../../../../libs/prisma.js'
import bcrypt from 'bcryptjs'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const superAdmin = await prisma.user.findUnique({
      where: {
        id: id,
        role: 'SUPER_ADMIN'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!superAdmin) {
      return NextResponse.json(
        { error: 'Super admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(superAdmin, { status: 200 })
  } catch (error) {
    console.error('Error fetching super admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch super admin' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { firstName, lastName, email, role, currentPassword, newPassword } = body

    // If password change is requested, verify current password
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({
        where: { id }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10)

      // Update with new password
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          email,
          role,
          password: hashedNewPassword,
          ...(body.image !== undefined && { image: body.image })
        }
      })

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser
      return NextResponse.json(userWithoutPassword)
    } else {
      // Update without password change
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          email,
          role,
          ...(body.image !== undefined && { image: body.image })
        }
      })

      return NextResponse.json(updatedUser)
    }
  } catch (error) {
    console.error('Error updating super admin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Super admin not found' },
        { status: 404 }
      )
    }

    // Delete super admin user
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Super admin deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting super admin:', error)
    return NextResponse.json(
      { error: 'Failed to delete super admin' },
      { status: 500 }
    )
  }
}