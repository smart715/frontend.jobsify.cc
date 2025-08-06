
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateClientIdWithDB } from '@/utils/clientUtils';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleCode = searchParams.get('moduleCode') || 'MD';
    const companyCode = searchParams.get('companyCode') || '0001';

    // Generate the next available client ID
    const nextClientId = await generateClientIdWithDB(prisma, moduleCode, companyCode);

    return NextResponse.json({ 
      clientId: nextClientId
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating next client ID:', error);
    return NextResponse.json(
      { error: 'Failed to generate next client ID' },
      { status: 500 }
    );
  }
}
