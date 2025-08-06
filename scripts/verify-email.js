
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyUserEmail(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    })
    
    console.log(`✅ Email verified for user: ${user.email}`)
    return user
  } catch (error) {
    console.error('❌ Error verifying email:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Usage: node scripts/verify-email.js
if (require.main === module) {
  const email = process.argv[2]
  if (!email) {
    console.log('Usage: node scripts/verify-email.js <email>')
    process.exit(1)
  }
  verifyUserEmail(email)
}

module.exports = { verifyUserEmail }
