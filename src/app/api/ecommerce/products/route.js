
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
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const companyId = searchParams.get('companyId')

    const where = {
      ...(companyId && { companyId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(status && { status }),
      ...(category && {
        categories: {
          some: {
            slug: category
          }
        }
      })
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          variants: true,
          categories: true,
          collections: true,
          company: {
            select: { id: true, companyName: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
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
      price,
      compareAtPrice,
      costPerItem,
      sku,
      trackQuantity,
      quantity,
      weight,
      weightUnit,
      requiresShipping,
      taxable,
      status,
      vendor,
      productType,
      tags,
      images,
      variants,
      categories,
      seoTitle,
      seoDescription
    } = data

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const product = await prisma.product.create({
      data: {
        name,
        description,
        slug,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPerItem: costPerItem ? parseFloat(costPerItem) : null,
        sku,
        trackQuantity: Boolean(trackQuantity),
        quantity: trackQuantity ? parseInt(quantity) || 0 : 0,
        weight: weight ? parseFloat(weight) : null,
        weightUnit,
        requiresShipping: Boolean(requiresShipping),
        taxable: Boolean(taxable),
        status: status || 'DRAFT',
        vendor,
        productType,
        tags: tags || [],
        seoTitle,
        seoDescription,
        companyId: session.user.companyId,
        images: {
          create: images?.map((img, index) => ({
            url: img.url,
            altText: img.altText,
            position: index
          })) || []
        },
        variants: {
          create: variants?.map((variant, index) => ({
            name: variant.name,
            sku: variant.sku,
            price: parseFloat(variant.price),
            compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice) : null,
            costPerItem: variant.costPerItem ? parseFloat(variant.costPerItem) : null,
            trackQuantity: Boolean(variant.trackQuantity),
            quantity: variant.trackQuantity ? parseInt(variant.quantity) || 0 : 0,
            weight: variant.weight ? parseFloat(variant.weight) : null,
            position: index,
            option1: variant.option1,
            option2: variant.option2,
            option3: variant.option3,
            image: variant.image,
            available: Boolean(variant.available)
          })) || []
        },
        categories: {
          connect: categories?.map(cat => ({ id: cat.id })) || []
        }
      },
      include: {
        images: true,
        variants: true,
        categories: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
