
import { NextResponse } from 'next/server'
import { getSessionWithImpersonation } from '../../../utils/sessionUtils'
import jwt from 'jsonwebtoken'

export async function GET(request) {
  try {
    console.log('🔍 DEBUG-IMPERSONATION: Starting debug check...')
    
    // Check all incoming headers
    const allHeaders = {}
    request.headers.forEach((value, key) => {
      allHeaders[key] = value
    })
    
    console.log('📋 DEBUG-IMPERSONATION: All request headers:', Object.keys(allHeaders))
    
    const impersonationHeader = request.headers.get('x-impersonation-data')
    console.log('🔍 DEBUG-IMPERSONATION: x-impersonation-data header:', impersonationHeader ? 'EXISTS' : 'MISSING')
    
    if (impersonationHeader) {
      console.log('📋 DEBUG-IMPERSONATION: Raw impersonation header value:', impersonationHeader.substring(0, 100) + '...')
    }
    
    const session = await getSessionWithImpersonation(request)
    console.log('📋 DEBUG-IMPERSONATION: Session data:', {
      userId: session?.user?.id,
      email: session?.user?.email,
      role: session?.user?.role,
      isImpersonating: session?.user?.isImpersonating
    })
    
    // Get cookies from request
    const cookieHeader = request.headers.get('cookie')
    let impersonationToken = null
    let impersonationData = null
    
    console.log('🍪 DEBUG-IMPERSONATION: Cookie header exists:', !!cookieHeader)
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        if (key && value) {
          acc[key] = decodeURIComponent(value)
        }
        return acc
      }, {})
      
      console.log('🍪 DEBUG-IMPERSONATION: Parsed cookies:', Object.keys(cookies))
      impersonationToken = cookies['impersonation-token']
      console.log('🔍 DEBUG-IMPERSONATION: Impersonation token in cookies:', !!impersonationToken)
      
      if (impersonationToken) {
        try {
          impersonationData = jwt.verify(impersonationToken, process.env.NEXTAUTH_SECRET)
          console.log('✅ DEBUG-IMPERSONATION: Token verified successfully')
        } catch (error) {
          console.error('❌ DEBUG-IMPERSONATION: Invalid impersonation token:', error)
        }
      }
    }

    // Check middleware-injected header
    const middlewareHeader = request.headers.get('x-impersonation-data')
    let middlewareData = null
    
    if (middlewareHeader) {
      try {
        middlewareData = JSON.parse(middlewareHeader)
        console.log('✅ DEBUG-IMPERSONATION: Middleware header parsed successfully')
      } catch (error) {
        console.error('❌ DEBUG-IMPERSONATION: Error parsing middleware header:', error)
      }
    }

    // FOR TESTING: Add static impersonation data to response
    const staticImpersonationData = {
      originalUserId: 'cmcx3xco90000mr67n1w66sbf',
      originalRole: 'SUPER_ADMIN',
      originalEmail: 'lnicely@me.com',
      impersonatedUserId: 'test-admin-user-id',
      impersonatedRole: 'ADMIN',
      impersonatedEmail: 'umakantsonwani12@gmail.com',
      companyId: 'PW-0001-CO-25-00001',
      companyName: 'WPTUTORIAL',
      isImpersonating: true,
      timestamp: Date.now()
    }

    const result = {
      timestamp: new Date().toISOString(),
      session: session,
      impersonationToken: impersonationToken ? 'present' : 'missing',
      impersonationData: impersonationData,
      middlewareData: middlewareData,
      cookies: cookieHeader ? 'present' : 'missing',
      headers: {
        'x-impersonation-data-from-middleware': middlewareHeader ? 'present' : 'missing',
        'all-headers-count': Object.keys(allHeaders).length
      },
      testing: {
        staticData: staticImpersonationData
      }
    }

    console.log('📋 DEBUG-IMPERSONATION: Final result summary:', {
      sessionExists: !!session,
      sessionIsImpersonating: session?.user?.isImpersonating,
      middlewareHeaderExists: !!middlewareHeader,
      cookieTokenExists: !!impersonationToken
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ DEBUG-IMPERSONATION: Error:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}
