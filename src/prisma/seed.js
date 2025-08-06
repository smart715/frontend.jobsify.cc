
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Insert the Company data from your SQL dump
  await prisma.company.create({
    data: {
      id: 'cmbumcodm0001cq2dwlh2c179',
      companyName: 'Insta Corp',
      package: 'cmbumbbrf0000cq2da3agjyjq',
      packageDate: null,
      lastActivity: new Date('2025-06-13T09:42:24.106Z'),
      status: 'Active',
      companyEmail: 'instacrop@gmail.com',
      companyPhone: '(234) 324-3243',
      companyWebsite: null,
      defaultCurrency: 'USD',
      language: 'English',
      streetAddress: '161 Cypress Avenue',
      city: 'Santa Clara',
      state: 'CA',
      zipCode: '95050',
      adminName: 'John Joe',
      adminEmail: 'johnjoe@gmail.com',
      createdAt: new Date('2025-06-13T09:42:24.106Z')
    }
  })

  console.log('Company data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
