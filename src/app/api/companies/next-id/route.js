
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateCompanyIdWithDB } from '@/utils/companyUtils';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleType = searchParams.get('moduleType') || 'MOBILE_DETAILING';

    // Generate the next available company ID
    const nextCompanyId = await generateCompanyIdWithDB(moduleType, prisma);

    return NextResponse.json({ 
      companyId: nextCompanyId,
      moduleType: moduleType 
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating next company ID:', error);
    return NextResponse.json(
      { error: 'Failed to generate next company ID' },
      { status: 500 }
    );
  }
}
