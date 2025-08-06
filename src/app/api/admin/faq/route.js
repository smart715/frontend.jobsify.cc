
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get FAQs
    const faqs = await prisma.adminFAQ.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ faqs })
  } catch (error) {
    console.error('Error fetching admin FAQ:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin FAQ' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Get or create user ID
    let userId = session.user.id
    
    // If user ID is undefined, try to find user by email
    if (!userId && session.user.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      })
      userId = user?.id
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 400 }
      )
    }

    // Create FAQ
    const faq = await prisma.adminFAQ.create({
      data: {
        title,
        description,
        createdBy: userId
      }
    })

    return NextResponse.json(faq, { status: 201 })
  } catch (error) {
    console.error('Error creating admin FAQ:', error)
    return NextResponse.json(
      { error: 'Failed to create admin FAQ' },
      { status: 500 }
    )
  }
}
