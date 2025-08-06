
// force Node.js runtime so Prisma can run
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    const where = companyId ? { OR: [{ companyId }, { isPublic: true }] } : { isPublic: true }

    const themes = await prisma.storefrontTheme.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
        isActive: true,
        isPublic: true,
        version: true,
        companyId: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(themes)
  } catch (error) {
    console.error('Error fetching themes:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      name,
      description,
      thumbnail,
      cssContent,
      jsContent,
      htmlLayout,
      isPublic
    } = data

    // Deactivate current active theme if this one is being set as active
    if (data.isActive) {
      await prisma.storefrontTheme.updateMany({
        where: {
          companyId: session.user.companyId,
          isActive: true
        },
        data: { isActive: false }
      })
    }

    const theme = await prisma.storefrontTheme.create({
      data: {
        name,
        description,
        thumbnail,
        cssContent,
        jsContent,
        htmlLayout,
        isActive: Boolean(data.isActive),
        isPublic: Boolean(isPublic),
        companyId: session.user.companyId
      }
    })

    return NextResponse.json(theme, { status: 201 })
  } catch (error) {
    console.error('Error creating theme:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
