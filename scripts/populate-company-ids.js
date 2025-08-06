
const { PrismaClient } = require('@prisma/client')
const { generateCompanyId } = require('../src/utils/companyUtils')

const prisma = new PrismaClient()

async function populateCompanyIds() {
  try {
    // Get all companies without companyId
    const companies = await prisma.company.findMany({
      where: {
        companyId: null
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log(`Found ${companies.length} companies without companyId`)

    // Update each company with a generated ID
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i]
      const companyId = generateCompanyId('MOBILE_DETAILING') // Default module
      
      await prisma.company.update({
        where: { id: company.id },
        data: { companyId: companyId }
      })
      
      console.log(`Updated company ${company.companyName} with ID: ${companyId}`)
    }

    console.log('All companies updated successfully!')
    
    // Verify the updates
    const updatedCompanies = await prisma.company.findMany({
      select: {
        companyName: true,
        companyId: true
      }
    })
    
    console.log('\nUpdated companies:')
    updatedCompanies.forEach(c => {
      console.log(`${c.companyName}: ${c.companyId}`)
    })

  } catch (error) {
    console.error('Error updating company IDs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateCompanyIds()
