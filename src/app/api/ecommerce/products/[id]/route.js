
// force Node.js runtime so Prisma can run
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/libs/auth'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const { id } = params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: { orderBy: { position: 'asc' } },
        categories: true,
        collections: true,
        company: {
          select: { id: true, companyName: true }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const data = await request.json()

    // Check if product exists and user has permission
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { companyId: true }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (existingProduct.companyId !== session.user.companyId && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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

    // Update slug if name changed
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const product = await prisma.product.update({
      where: { id },
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
        status,
        vendor,
        productType,
        tags: tags || [],
        seoTitle,
        seoDescription,
        // Handle images update
        images: images ? {
          deleteMany: {},
          create: images.map((img, index) => ({
            url: img.url,
            altText: img.altText,
            position: index
          }))
        } : undefined,
        // Handle variants update
        variants: variants ? {
          deleteMany: {},
          create: variants.map((variant, index) => ({
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
          }))
        } : undefined,
        // Handle categories update
        categories: categories ? {
          set: categories.map(cat => ({ id: cat.id }))
        } : undefined
      },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: { orderBy: { position: 'asc' } },
        categories: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if product exists and user has permission
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { companyId: true }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (existingProduct.companyId !== session.user.companyId && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
