// src/app/api/models/[makeId]/route.js

import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

// Reuse a global instance in dev so you don't exhaust connections

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export async function GET(request, context) {
  // 1. Await the async params
  const { makeId } = await context.params

  // 2. Validate presence
  if (!makeId) {
    return NextResponse.json({ message: 'makeId parameter is required.' }, { status: 400 })
  }

  // 3. Parse to integer
  const id = parseInt(makeId, 10)

  if (isNaN(id)) {
    return NextResponse.json({ message: 'makeId must be a valid number.' }, { status: 400 })
  }

  try {
    // 4. Query using the singular `model` accessor
    const models = await prisma.model.findMany({
      where: { make_id: id }
    })

    return NextResponse.json(models, { status: 200 })
  } catch (error) {
    console.error(`Error fetching models for makeId ${id}:`, error)

    return NextResponse.json({ message: 'Error fetching models. Please try again later.' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: 'GET,OPTIONS' }
  })
}
