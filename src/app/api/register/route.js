// src/app/api/register/route.js

import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const {
      firstName,      // Added
      lastName,       // Added
      email,
      password,
      companyName,
      businessType
    } = await req.json();

    // Validate input (basic validation)
    // companyName and businessType are optional and not validated here for presence
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields for user identification or authentication' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {

      return NextResponse.json({ message: 'User already exists' }, { status: 409 }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user (role defaults to 'USER' as per schema)
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        hashedPassword,
        emailVerified: new Date(), // Mark as verified immediately
        companyName,
        businessType,
        role: 'EMPLOYEE' // Ensure default role is set if not automatically handled by Prisma @default
        // pricingTierId can be set here if there's a default tier for new signups
      },
    });

    // OTP Sending REMOVED
    // await sendEmailOTP(user.id, user.email, 'REGISTRATION');

    const { hashedPassword: _, ...userWithoutPassword } = user;

    return NextResponse.json(
        { message: 'Registration successful. You can now log in.', user: userWithoutPassword },
        { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
