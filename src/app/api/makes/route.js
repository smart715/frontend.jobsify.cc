// src/app/api/makes/route.js

import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

// reuse a global client in dev to avoid exhausting connections:
const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export async function GET(request) {
  try {
    // ← use singular "make" to match your model name
    const makes = await prisma.make.findMany()

    return NextResponse.json(makes, { status: 200 })
  } catch (error) {
    console.error('Error fetching makes:', error)

    return NextResponse.json({ message: 'Error fetching makes. Please try again later.' }, { status: 500 })
  }
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: { Allow: 'GET,OPTIONS' }
  })
}
