
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(languages)
  } catch (error) {
    console.error('Error fetching languages:', error)
    return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, code, flag, rtlStatus, status, isDefault } = body

    // If this is being set as default, update other languages to not be default
    if (isDefault) {
      await prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    const language = await prisma.language.create({
      data: {
        name,
        code,
        flag,
        rtlStatus: rtlStatus || false,
        status: status !== undefined ? status : true,
        isDefault: isDefault || false
      }
    })

    return NextResponse.json(language)
  } catch (error) {
    console.error('Error creating language:', error)
    return NextResponse.json({ error: 'Failed to create language' }, { status: 500 })
  }
}
