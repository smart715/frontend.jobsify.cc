// Next Imports
import { NextResponse } from 'next/server'

// Prisma Client
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// bcryptjs
import bcrypt from 'bcryptjs';

export async function POST(req) {
  // Vars
  const { email, password } = await req.json()

  try {
    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (user && user.hashedPassword) {
      const passwordMatch = bcrypt.compareSync(password, user.hashedPassword);

      if (passwordMatch) {
        // Check if email is verified before sending login OTP
        // Temporarily disabled for testing
        // if (!user.emailVerified) {
        //   return NextResponse.json(
        //     { message: 'Email not verified. Please verify your email before logging in.' },
        //     { status: 403 } // Forbidden
        //   );
        // }

        // Prepare user data for NextAuth session
        const sessionUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          companyId: user.companyId
        };

        return NextResponse.json(sessionUser, { status: 200 });

      } else { // Password does not match
        return NextResponse.json(
          { message: 'Invalid email or password' }, // Standardized message
          { status: 401 }
        );
      }
    } else { // User not found or no hashed password
      return NextResponse.json(
        { message: 'Invalid email or password' }, // Standardized message
        { status: 401 }
      );
    }

  } catch (error) {
    // Safely extract message and stack
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available.';

    console.error('Login API - Caught Error Message:', errorMessage);
    console.error('Login API - Error Stacktrace:', errorStack);

    // If the original error was unusual (e.g., null, undefined, not an Error instance)
    if (!(error instanceof Error)) {
      console.error('Login API - Original caught value was not a standard Error object:', error);
    }

    // Consistent JSON response to the client
    return NextResponse.json(
      { message: 'An internal server error occurred during login. Please check server logs.' },
      { status: 500 }
    );
  }
}