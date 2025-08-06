import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'

// Prisma Client
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          if (!res.ok) {
            console.log('Login API response not ok:', res.status)
            return null
          }

          const user = await res.json()
          console.log('Login API response user:', user)

          if (user && user.id) {
            const authUser = {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              companyId: user.companyId
            }
            console.log('Returning auth user:', authUser)
            return authUser
          }

          console.log('User object invalid or missing id')
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.role = user.role
        token.companyId = user.companyId
      }
      return token
    },
    async session({ session, token, req }) {
      console.log('🔍 Session callback - token:', {
        id: token.id,
        email: token.email,
        role: token.role,
        companyId: token.companyId
      })

      // Build session user object first
      session.user = {
        id: token.id,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        role: token.role,
        companyId: token.companyId,
        isImpersonating: false
      }

      // Check for impersonation data in headers (set by middleware)
      let impersonationData = null
      
      console.log('🔍 Session callback req object exists:', !!req)
      console.log('🔍 Session callback req.cookies:', req?.cookies ? Object.keys(req.cookies) : 'no cookies')
      console.log('🔍 Session callback req.headers.cookie:', req?.headers?.cookie ? 'exists' : 'missing')
      
      if (req?.headers?.['x-impersonation-data']) {
        try {
          impersonationData = JSON.parse(req.headers['x-impersonation-data'])
          console.log('✅ Found impersonation data via headers from middleware')
        } catch (error) {
          console.error('❌ Failed to parse impersonation data from headers:', error)
        }
      }

      // Apply impersonation if active
      if (impersonationData) {
        try {
          console.log('🔄 Impersonation active - decoded data:', {
            originalUser: impersonationData.originalEmail,
            impersonatedUser: impersonationData.impersonatedEmail,
            companyName: impersonationData.companyName,
            companyId: impersonationData.companyId
          })

          // Update session with impersonated user data
          session.user = {
            id: impersonationData.impersonatedUserId,
            email: impersonationData.impersonatedEmail,
            firstName: session.user.firstName, // Keep original first name for now
            lastName: session.user.lastName,   // Keep original last name for now
            role: impersonationData.impersonatedRole,
            companyId: impersonationData.companyId,
            companyName: impersonationData.companyName,
            isImpersonating: true,
            originalUserId: impersonationData.originalUserId,
            originalEmail: impersonationData.originalEmail,
            originalRole: impersonationData.originalRole
          }
        } catch (error) {
          console.error('❌ Failed to apply impersonation data:', error)
        }
      } else {
        console.log('🔍 No impersonation data found')
      }

      console.log('✅ Final session user:', {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        companyId: session.user.companyId,
        isImpersonating: session.user.isImpersonating
      })

      return session
    }
  }
}