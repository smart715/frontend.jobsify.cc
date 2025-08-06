import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET a single package by ID
export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const pkg = await prisma.package.findUnique({
      where: { id },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json(pkg, { status: 200 });
  } catch (error) {
    console.error(`Error fetching package ${id}:`, error);

    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}

// PUT (update) a package by ID
export async function PUT(request, { params }) {
  const { id } = await params;

  try {
    const data = await request.json();
    const { name, type, maxEmployees, phoneNumber, positionNo, ...optionalFields } = data;

    // Basic validation for potentially updated fields
    if (data.hasOwnProperty('maxEmployees') && typeof maxEmployees !== 'number') {
      return NextResponse.json({ error: 'maxEmployees must be a number' }, { status: 400 });
    }

    if (data.hasOwnProperty('positionNo') && typeof positionNo !== 'number') {
        return NextResponse.json({ error: 'positionNo must be a number' }, { status: 400 });
    }

    // Note: More specific validation can be added here for each field if necessary.

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: data, // Send all data, Prisma will only update changed fields
    });


    return NextResponse.json(updatedPackage, { status: 200 });
  } catch (error) {
    console.error(`Error updating package ${id}:`, error);

    if (error.code === 'P2025') { // Record to update not found
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    if (error.code === 'P2002') { // Unique constraint failed
        return NextResponse.json({ error: `A package with this ${error.meta.target.join(', ')} already exists.` }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

// DELETE a package by ID
export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    // Check if there are any active subscriptions for this package
    const existingSubscriptions = await prisma.companySubscription.findMany({
      where: { packageId: id },
      include: {
        company: {
          select: { companyName: true }
        }
      }
    });

    if (existingSubscriptions.length > 0) {
      const companyNames = existingSubscriptions.map(sub => sub.company?.companyName || 'Unknown').join(', ');
      return NextResponse.json({ 
        error: `Cannot delete package. It is currently being used by ${existingSubscriptions.length} company subscription(s): ${companyNames}. Please cancel or reassign these subscriptions before deleting the package.` 
      }, { status: 409 });
    }

    await prisma.package.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting package ${id}:`, error);

    if (error.code === 'P2025') { // Record to delete not found
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    if (error.code === 'P2003') { // Foreign key constraint failed
      return NextResponse.json({ 
        error: 'Cannot delete package due to existing dependencies. Please ensure all related records are removed first.' 
      }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}