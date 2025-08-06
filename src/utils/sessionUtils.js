
import { getServerSession } from 'next-auth'
import { authOptions } from '../app/api/auth/[...nextauth]/route'

export async function getSessionWithImpersonation(request) {
  console.log('🔍 SESSION UTILS: Getting session with impersonation...')
  
  // Get base session
  const session = await getServerSession(authOptions)
  
  if (!session) {
    console.log('⚠️ SESSION UTILS: No base session found')
    return null
  }

  console.log('📋 SESSION UTILS: Base session user:', {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role
  })

  // Check for impersonation data in headers
  let impersonationData = null
  
  if (request?.headers) {
    const impersonationHeader = request.headers.get('x-impersonation-data')
    
    if (impersonationHeader) {
      try {
        impersonationData = JSON.parse(impersonationHeader)
        console.log('✅ SESSION UTILS: Found impersonation data in headers:', {
          originalUser: impersonationData.originalEmail,
          impersonatedUser: impersonationData.impersonatedEmail,
          companyName: impersonationData.companyName,
          isImpersonating: impersonationData.isImpersonating
        })
      } catch (error) {
        console.error('❌ SESSION UTILS: Error parsing impersonation header:', error)
      }
    } else {
      console.log('⚠️ SESSION UTILS: No x-impersonation-data header found')
    }
  }

  // Apply impersonation if active
  if (impersonationData && impersonationData.isImpersonating) {
    console.log('🔄 SESSION UTILS: Applying impersonation...')
    
    session.user = {
      ...session.user,
      id: impersonationData.impersonatedUserId,
      email: impersonationData.impersonatedEmail,
      name: impersonationData.impersonatedEmail,
      companyId: impersonationData.companyId,
      companyName: impersonationData.companyName,
      role: impersonationData.impersonatedRole,
      isImpersonating: true,
      originalUserId: impersonationData.originalUserId,
      originalRole: impersonationData.originalRole,
      originalEmail: impersonationData.originalEmail
    }
    
    console.log('✅ SESSION UTILS: Impersonation applied successfully')
    console.log('📋 SESSION UTILS: Final user:', {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
      companyName: session.user.companyName,
      isImpersonating: session.user.isImpersonating
    })
  } else {
    console.log('ℹ️ SESSION UTILS: No active impersonation')
  }

  return session
}
