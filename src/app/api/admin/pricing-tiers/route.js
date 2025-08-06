// src/app/api/admin/pricing-tiers/route.js

import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

import { getServerSession } from 'next-auth/next'; // To get session server-side

import { authOptions } from '@/libs/auth'; // Your NextAuth options

const prisma = new PrismaClient();

// Helper function for role check (can be moved to a shared util if used often)
async function isSuperAdmin() { // Removed req, as authOptions might not need it in App Router
  const session = await getServerSession(authOptions);
  
  return session?.user?.role === 'SUPER_ADMIN';
}

// GET all pricing tiers (for Admin UI)
export async function GET(req) { // req might still be useful for other things, but not for isSuperAdmin here
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const pricingTiers = await prisma.pricingTier.findMany({
      orderBy: {
        price: 'asc',
      },
    });

    // Parse features string to array for admin UI consistency
    const tiersWithParsedFeatures = pricingTiers.map(tier => ({
      ...tier,
      
      // Ensure features is a string before parsing, and default if it's null/undefined
      features: typeof tier.features === 'string' ? JSON.parse(tier.features || '[]') : (Array.isArray(tier.features) ? tier.features : []),
    }));

    return NextResponse.json(tiersWithParsedFeatures);
  } catch (error) {
    console.error('Admin GET Pricing Tiers Error:', error);
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST to create a new pricing tier (Super Admin only)
export async function POST(req) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, price, features, stripePriceId } = body;

    if (!name || typeof price !== 'number' || !Array.isArray(features)) {
      return NextResponse.json({ message: 'Missing or invalid fields: name, price (number), features (array) are required.' }, { status: 400 });
    }

    const newTier = await prisma.pricingTier.create({
      data: {
        name,
        price, // Store as cents
        features: JSON.stringify(features), // Store features as JSON string
        stripePriceId: stripePriceId || null,
      },
    });

    // Return the created tier (with features parsed back for consistency)
    return NextResponse.json({
      ...newTier,
      features: JSON.parse(newTier.features || '[]') // Ensure parsing for response
    }, { status: 201 });

  } catch (error) {
    console.error('Admin POST Pricing Tier Error:', error);
    
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return NextResponse.json({ message: 'Pricing tier with this name already exists.' }, { status: 409 }); // Conflict
    }
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
