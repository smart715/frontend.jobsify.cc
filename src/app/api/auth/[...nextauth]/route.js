import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

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
      console.log('🔍 JWT CALLBACK START')

      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.role = user.role
        token.companyId = user.companyId
      }

      console.log('✅ JWT CALLBACK: Token built:', {
        id: token.id,
        email: token.email,
        role: token.role
      })

      return token
    },
    async session({ session, token }) {
      console.log('🔍 SESSION CALLBACK START')
      console.log('📋 SESSION: Initial token data:', {
        sub: token.sub,
        email: token.email,
        role: token.role,
        companyId: token.companyId
      })

      // Build base session user object first
      session.user = {
        id: token.id || token.sub,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        role: token.role,
        companyId: token.companyId,
        isImpersonating: false
      }

      console.log('✅ SESSION: Base session user built:', {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role
      })

      // Check for impersonation data in cookies directly
      console.log('🔍 SESSION: Checking for impersonation token in cookies...')
      
      try {
        const { cookies } = require('next/headers')
        const impersonationToken = cookies().get('impersonation-token')
        
        if (impersonationToken) {
          console.log('🔍 SESSION: Found impersonation token in cookies')
          const jwt = require('jsonwebtoken')
          const decodedToken = jwt.verify(impersonationToken.value, process.env.NEXTAUTH_SECRET)
          
          if (decodedToken.isImpersonating) {
            console.log('🔄 SESSION: Applying impersonation...')
            
            session.user = {
              id: decodedToken.impersonatedUserId,
              email: decodedToken.impersonatedEmail,
              firstName: session.user.firstName, // Keep original for now
              lastName: session.user.lastName,   // Keep original for now
              role: decodedToken.impersonatedRole,
              companyId: decodedToken.companyId,
              companyName: decodedToken.companyName,
              isImpersonating: true,
              originalUserId: decodedToken.originalUserId,
              originalEmail: decodedToken.originalEmail,
              originalRole: decodedToken.originalRole
            }

            console.log('✅ SESSION: Impersonation applied successfully')
          }
        } else {
          console.log('ℹ️ SESSION: No impersonation token found')
        }
      } catch (error) {
        console.error('❌ SESSION: Error checking impersonation token:', error.message)
      }

      console.log('📋 SESSION: Final session user:', {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        companyId: session.user.companyId,
        companyName: session.user.companyName,
        isImpersonating: session.user.isImpersonating
      })

      console.log('✅ SESSION CALLBACK END')
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }