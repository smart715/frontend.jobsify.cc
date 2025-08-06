// src/app/api/admin/pricing-tiers/[id]/route.js
import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/libs/auth';

const prisma = new PrismaClient();

// Helper function for role check
async function isSuperAdmin() { // Removed req, as authOptions might not need it
  const session = await getServerSession(authOptions);

  return session?.user?.role === 'SUPER_ADMIN';
}

// GET a single pricing tier by ID
export async function GET(req, { params }) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;

  try {
    const tier = await prisma.pricingTier.findUnique({
      where: { id },
    });

    if (!tier) {
      return NextResponse.json({ message: 'Pricing tier not found' }, { status: 404 });
    }

    // Parse features for consistency
    const tierWithParsedFeatures = {
      ...tier,

      // Ensure features is a string before parsing, and default if it's null/undefined or already an array
      features: typeof tier.features === 'string' ? JSON.parse(tier.features || '[]') : (Array.isArray(tier.features) ? tier.features : []),
    };

    return NextResponse.json(tierWithParsedFeatures);
  } catch (error) {
    console.error(`Admin GET Pricing Tier (ID: ${id}) Error:`, error);
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT to update a pricing tier by ID (Super Admin only)
export async function PUT(req, { params }) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;

  try {
    const body = await req.json();
    const { name, price, features, stripePriceId } = body;

    // Basic validation, can be enhanced (e.g., using Valibot or Zod)

    if (name === undefined && price === undefined && features === undefined && stripePriceId === undefined) {
        return NextResponse.json({ message: 'At least one field to update must be provided.' }, { status: 400 });
    }

    if (name !== undefined && typeof name !== 'string') {
        return NextResponse.json({ message: 'Invalid name format.' }, { status: 400 });
    }

    if (price !== undefined && typeof price !== 'number') {
        return NextResponse.json({ message: 'Price must be a number.' }, { status: 400 });
    }

    if (features !== undefined && !Array.isArray(features)) {
        return NextResponse.json({ message: 'Features must be an array.' }, { status: 400 });
    }


    const dataToUpdate = {};

    if (name !== undefined) dataToUpdate.name = name;
    if (price !== undefined) dataToUpdate.price = price; // Store as cents
    if (features !== undefined) dataToUpdate.features = JSON.stringify(features); // Store features as JSON string
    if (stripePriceId !== undefined) dataToUpdate.stripePriceId = stripePriceId || null;


    const updatedTier = await prisma.pricingTier.update({
      where: { id },
      data: dataToUpdate,
    });

    // Parse features for response consistency
    return NextResponse.json({
        ...updatedTier,
        features: JSON.parse(updatedTier.features || '[]')
    });

  } catch (error) {
    console.error(`Admin PUT Pricing Tier (ID: ${id}) Error:`, error);

    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return NextResponse.json({ message: 'Pricing tier with this name already exists.' }, { status: 409 });
    }

    if (error.code === 'P2025') { // Record to update not found
      return NextResponse.json({ message: 'Pricing tier not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a pricing tier by ID (Super Admin only)
export async function DELETE(req, { params }) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;

  try {
    await prisma.pricingTier.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Pricing tier deleted successfully' }, { status: 200 }); // Or 204 No Content

  } catch (error) {
    console.error(`Admin DELETE Pricing Tier (ID: ${id}) Error:`, error);

    if (error.code === 'P2025') { // Record to delete not found
      return NextResponse.json({ message: 'Pricing tier not found.' }, { status: 404 });
    }
    
    if (error.code === 'P2003') { // Foreign key constraint failed
        return NextResponse.json({ message: 'Cannot delete tier. It may be linked to existing subscriptions or users.' }, { status: 409 }); // Conflict
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
