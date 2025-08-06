
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🔍 DEBUG-ENV: Environment check...')
  
  const envCheck = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
    NEXTAUTH_SECRET_LENGTH: process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.length : 0,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET'
  }
  
  console.log('📋 DEBUG-ENV: Environment variables:', envCheck)
  
  return NextResponse.json(envCheck)
}
