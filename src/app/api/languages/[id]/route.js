
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const language = await prisma.language.findUnique({
      where: { id }
    })

    if (!language) {
      return NextResponse.json({ error: 'Language not found' }, { status: 404 })
    }

    return NextResponse.json(language)
  } catch (error) {
    console.error('Error fetching language:', error)
    return NextResponse.json({ error: 'Failed to fetch language' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, code, flag, rtlStatus, status, isDefault } = body

    // If this is being set as default, update other languages to not be default
    if (isDefault) {
      await prisma.language.updateMany({
        where: { 
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      })
    }

    const language = await prisma.language.update({
      where: { id },
      data: {
        name,
        code,
        flag,
        rtlStatus,
        status,
        isDefault
      }
    })

    return NextResponse.json(language)
  } catch (error) {
    console.error('Error updating language:', error)
    return NextResponse.json({ error: 'Failed to update language' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // Check if this is the default language
    const language = await prisma.language.findUnique({
      where: { id }
    })

    if (!language) {
      return NextResponse.json({ error: 'Language not found' }, { status: 404 })
    }

    if (language.isDefault) {
      return NextResponse.json({ error: 'Cannot delete default language' }, { status: 400 })
    }

    await prisma.language.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Language deleted successfully' })
  } catch (error) {
    console.error('Error deleting language:', error)
    return NextResponse.json({ error: 'Failed to delete language' }, { status: 500 })
  }
}
