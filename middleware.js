import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl.pathname
    console.log(`🔍 MIDDLEWARE START: ${req.method} ${url}`)

    let impersonationData = null
    const impersonationToken = req.cookies.get('impersonation-token')

    if (impersonationToken) {
      console.log('🔍 MIDDLEWARE: Found impersonation token in cookies')
      try {
        const decodedToken = jwt.verify(
          impersonationToken.value,
          process.env.NEXTAUTH_SECRET
        )

        console.log('🔍 MIDDLEWARE: Decoded token data:', {
          isImpersonating: decodedToken.isImpersonating,
          originalUser: decodedToken.originalEmail,
          impersonatedUser: decodedToken.impersonatedEmail
        })

        if (decodedToken.isImpersonating) {
          impersonationData = decodedToken
          console.log('✅ MIDDLEWARE: Valid impersonation token verified:', {
            originalUser: decodedToken.originalEmail,
            impersonatedUser: decodedToken.impersonatedEmail,
            companyName: decodedToken.companyName,
            companyId: decodedToken.companyId
          })
        } else {
          console.log('⚠️ MIDDLEWARE: Token exists but isImpersonating is false')
        }
      } catch (error) {
        console.error('❌ MIDDLEWARE: Invalid impersonation token:', error.message)
      }
    } else {
      console.log('⚠️ MIDDLEWARE: No impersonation token found in cookies')
    }

    // Clone the request headers and add impersonation data if available
    const requestHeaders = new Headers(req.headers)
    
    if (impersonationData) {
      const headerValue = JSON.stringify(impersonationData)
      requestHeaders.set('x-impersonation-data', headerValue)
      console.log('✅ MIDDLEWARE: Added x-impersonation-data header to request')
      console.log('🔍 MIDDLEWARE: Header value preview:', headerValue.substring(0, 100) + '...')
    } else {
      console.log('ℹ️ MIDDLEWARE: No impersonation data to add to headers')
    }

    // Create the response with the modified headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    console.log('✅ MIDDLEWARE END: Request processed successfully')
    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check impersonation token first
        const authToken = req.cookies.get('impersonation-token')
        if (authToken) {
          try {
            const impersonationData = jwt.verify(
              authToken.value,
              process.env.NEXTAUTH_SECRET
            )
            if (impersonationData.isImpersonating) {
              console.log('🔐 MIDDLEWARE AUTH: Authorized via impersonation token')
              return true // Authorized if impersonating
            }
          } catch (error) {
            console.error('❌ MIDDLEWARE AUTH: Invalid impersonation token:', error.message)
          }
        }

        // Default NextAuth authorization
        const authorized = !!token
        console.log('🔐 MIDDLEWARE AUTH: Default authorization result:', authorized)
        return authorized
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot-password|pages/auth).*)',
  ],
}