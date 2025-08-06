const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Connecting to database...')

  try {
    // Create modules first
    const modules = [
      {
        code: 'MD',
        name: 'Mobile Detailing',
        description: 'Complete mobile car detailing management system',
        category: 'Service',
        sortOrder: 1
      },
      {
        code: 'DS',
        name: 'Drug Screening',
        description: 'Drug and alcohol testing management system',
        category: 'Service',
        sortOrder: 2
      },
      {
        code: 'GB',
        name: 'General Business',
        description: 'General business management tools',
        category: 'Business',
        sortOrder: 3
      }
    ]

    console.log('Creating modules...')
    for (const moduleData of modules) {
      await prisma.module.upsert({
        where: { code: moduleData.code },
        update: moduleData,
        create: moduleData
      })
      console.log(`✓ Created/Updated module: ${moduleData.name}`)
    }

    // Get created modules to reference in packages
    const mobileDetailingModule = await prisma.module.findFirst({
      where: { name: 'Mobile Detailing' }
    })

    const drugScreeningModule = await prisma.module.findFirst({
      where: { name: 'Drug Screening' }
    })

    if (!mobileDetailingModule || !drugScreeningModule) {
      throw new Error('Failed to create required modules')
    }

    // Create packages with proper module references
    const packages = [
      {
        packageType: 'Service',
        name: 'Basic Mobile Detailing Package',
        type: 'Basic',
        maxEmployees: 5,
        positionNo: 1,
        monthly_currency: 'USD',
        yearly_currency: 'USD',
        hasMonthly: true,
        monthlyPrice: 29.99,
        hasAnnual: true,
        annualPrice: 299.99,
        features: ['Basic Scheduling', 'Customer Management', 'Basic Reporting'],
        modules: [mobileDetailingModule.id] // Use actual module ID
      },
      {
        packageType: 'Service',
        name: 'Professional Mobile Detailing Package',
        type: 'Professional',
        maxEmployees: 15,
        positionNo: 2,
        monthly_currency: 'USD',
        yearly_currency: 'USD',
        hasMonthly: true,
        monthlyPrice: 79.99,
        hasAnnual: true,
        annualPrice: 799.99,
        features: ['Advanced Scheduling', 'Customer Management', 'Inventory Management', 'Financial Reporting', 'Staff Management'],
        modules: [mobileDetailingModule.id] // Use actual module ID
      },
      {
        packageType: 'Service',
        name: 'Basic Drug Screening Package',
        type: 'Basic',
        maxEmployees: 10,
        positionNo: 3,
        monthly_currency: 'USD',
        yearly_currency: 'USD',
        hasMonthly: true,
        monthlyPrice: 49.99,
        hasAnnual: true,
        annualPrice: 499.99,
        features: ['Test Scheduling', 'Client Management', 'Basic Reporting'],
        modules: [drugScreeningModule.id] // Use actual module ID
      },
      {
        packageType: 'Service',
        name: 'Professional Drug Screening Package',
        type: 'Professional',
        maxEmployees: 25,
        positionNo: 4,
        monthly_currency: 'USD',
        yearly_currency: 'USD',
        hasMonthly: true,
        monthlyPrice: 99.99,
        hasAnnual: true,
        annualPrice: 999.99,
        features: ['Advanced Test Scheduling', 'Client Management', 'Lab Integration', 'Compliance Reporting', 'Staff Management'],
        modules: [drugScreeningModule.id] // Use actual module ID
      }
    ]

    console.log('Creating packages...')
    for (const packageData of packages) {
      await prisma.package.upsert({
        where: { name: packageData.name },
        update: packageData,
        create: packageData
      })
      console.log(`✓ Created/Updated package: ${packageData.name}`)
    }

    // Create default roles
    const roles = [
      {
        name: 'Superadmin',
        description: 'Full system access with all permissions',
        isActive: true,
        isDefault: false
      },
      {
        name: 'Admin',
        description: 'Administrative access with most permissions',
        isActive: true,
        isDefault: false
      },
      {
        name: 'Staff',
        description: 'Staff access with limited permissions',
        isActive: true,
        isDefault: false
      },
      {
        name: 'Employee',
        description: 'Basic employee access',
        isActive: true,
        isDefault: true
      },
      {
        name: 'Supplier',
        description: 'Supplier access with specific permissions',
        isActive: true,
        isDefault: false
      }
    ]

    console.log('Creating default roles...')
    for (const roleData of roles) {
      await prisma.role.upsert({
        where: { name: roleData.name },
        update: roleData,
        create: roleData
      })
      console.log(`✓ Created/Updated role: ${roleData.name}`)
    }

    // Create default permissions
    const permissions = [
      // User management
      { name: 'users.view', description: 'View users', module: 'Users', action: 'view', resource: 'users' },
      { name: 'users.create', description: 'Create users', module: 'Users', action: 'create', resource: 'users' },
      { name: 'users.update', description: 'Update users', module: 'Users', action: 'update', resource: 'users' },
      { name: 'users.delete', description: 'Delete users', module: 'Users', action: 'delete', resource: 'users' },

      // Company management
      { name: 'companies.view', description: 'View companies', module: 'Companies', action: 'view', resource: 'companies' },
      { name: 'companies.create', description: 'Create companies', module: 'Companies', action: 'create', resource: 'companies' },
      { name: 'companies.update', description: 'Update companies', module: 'Companies', action: 'update', resource: 'companies' },
      { name: 'companies.delete', description: 'Delete companies', module: 'Companies', action: 'delete', resource: 'companies' },

      // Settings
      { name: 'settings.view', description: 'View settings', module: 'Settings', action: 'view', resource: 'settings' },
      { name: 'settings.update', description: 'Update settings', module: 'Settings', action: 'update', resource: 'settings' },

      // Roles & Permissions
      { name: 'roles.view', description: 'View roles', module: 'Roles', action: 'view', resource: 'roles' },
      { name: 'roles.create', description: 'Create roles', module: 'Roles', action: 'create', resource: 'roles' },
      { name: 'roles.update', description: 'Update roles', module: 'Roles', action: 'update', resource: 'roles' },
      { name: 'roles.delete', description: 'Delete roles', module: 'Roles', action: 'delete', resource: 'roles' },
      { name: 'permissions.view', description: 'View permissions', module: 'Permissions', action: 'view', resource: 'permissions' },
      { name: 'permissions.manage', description: 'Manage permissions', module: 'Permissions', action: 'manage', resource: 'permissions' }
    ]

    console.log('Creating default permissions...')
    for (const permissionData of permissions) {
      await prisma.permission.upsert({
        where: { name: permissionData.name },
        update: permissionData,
        create: permissionData
      })
      console.log(`✓ Created/Updated permission: ${permissionData.name}`)
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Seed script failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Disconnecting from database...')
    await prisma.$disconnect()
  })