
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request) {
  try {
    console.log('🧪 DEBUG-SESSION: Starting session debug...')
    
    // Get session using the request object
    const session = await getServerSession(authOptions)
    
    console.log('📋 DEBUG-SESSION: Session result:', {
      exists: !!session,
      userId: session?.user?.id,
      email: session?.user?.email,
      role: session?.user?.role,
      companyId: session?.user?.companyId,
      companyName: session?.user?.companyName,
      isImpersonating: session?.user?.isImpersonating,
      originalUserId: session?.user?.originalUserId,
      originalEmail: session?.user?.originalEmail
    })

    // Also check headers and cookies directly
    const impersonationHeader = request.headers.get('x-impersonation-data')
    const cookieHeader = request.headers.get('cookie')
    
    console.log('🔍 DEBUG-SESSION: Direct header check:', {
      hasImpersonationHeader: !!impersonationHeader,
      hasCookieHeader: !!cookieHeader
    })

    let cookieTokenData = null
    if (cookieHeader) {
      try {
        const jwt = require('jsonwebtoken')
        const cookies = Object.fromEntries(
          cookieHeader.split(';').map(cookie => {
            const [name, value] = cookie.trim().split('=')
            return [name, value]
          })
        )
        
        const impersonationToken = cookies['impersonation-token']
        if (impersonationToken) {
          cookieTokenData = jwt.verify(impersonationToken, process.env.NEXTAUTH_SECRET)
          console.log('✅ DEBUG-SESSION: Cookie token verified successfully')
        }
      } catch (error) {
        console.error('❌ DEBUG-SESSION: Error verifying cookie token:', error.message)
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      session: session,
      isImpersonating: session?.user?.isImpersonating || false,
      userDetails: session?.user || null,
      debugInfo: {
        hasImpersonationHeader: !!impersonationHeader,
        hasCookieHeader: !!cookieHeader,
        cookieTokenData: cookieTokenData,
        impersonationHeaderData: impersonationHeader
      }
    })
  } catch (error) {
    console.error('❌ DEBUG-SESSION: Error:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}
