// src/app/api/pricing-tiers/route.js

import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const pricingTiers = await prisma.pricingTier.findMany({
      orderBy: {
        price: 'asc', // Order by price, ascending
      },
    });

    // Remember that 'features' is stored as a JSON string.
    // Parse it back into an array for each tier if the client expects an array.
    const tiersWithParsedFeatures = pricingTiers.map(tier => {
      try {
        return {
          ...tier,
          features: JSON.parse(tier.features || '[]'), // Ensure features is valid JSON string or default to empty array
        };
      } catch (e) {
        console.error(`Error parsing features for tier ${tier.name}:`, e);

        return {
          ...tier,
          features: [], // Fallback to empty array if parsing fails
        };
      }
    });

    return NextResponse.json(tiersWithParsedFeatures);
  } catch (error) {
    console.error('Error fetching pricing tiers:', error);

    return NextResponse.json(
      { message: 'Internal server error while fetching pricing tiers.' },
      { status: 500 }
    );
  }
}
