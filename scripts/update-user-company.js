
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateUserCompany() {
  try {
    const userEmail = 'umakantsonwani@gmail.com'
    const companyId = 'ac5be5e9-ecab-4a37-9c9d-a89f70e29b73'

    // First, let's check the current user data
    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        companyId: true
      }
    })

    console.log('Current user data:')
    console.log(JSON.stringify(currentUser, null, 2))

    // Update the user with the correct companyId
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: { companyId: companyId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        companyId: true
      }
    })

    console.log('Updated user data:')
    console.log(JSON.stringify(updatedUser, null, 2))

    // Verify the company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        companyName: true,
        companyId: true,
        adminEmail: true
      }
    })

    console.log('Associated company:')
    console.log(JSON.stringify(company, null, 2))

  } catch (error) {
    console.error('Error updating user company:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserCompany()
