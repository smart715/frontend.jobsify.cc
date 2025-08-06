
import { NextResponse } from 'next/server'
import { getSessionWithImpersonation } from '../../../utils/sessionUtils'

export async function GET(request) {
  try {
    console.log('🧪 TEST-SESSION: Starting session test...')
    
    const session = await getSessionWithImpersonation(request)
    
    console.log('📋 TEST-SESSION: Session result:', {
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

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      session: session,
      isImpersonating: session?.user?.isImpersonating || false,
      userDetails: session?.user || null
    })
  } catch (error) {
    console.error('❌ TEST-SESSION: Error:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}
