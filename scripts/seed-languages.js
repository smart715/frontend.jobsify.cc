
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const initialLanguages = [
  { name: 'English', code: 'en', flag: '🇺🇸', rtlStatus: false, status: true, isDefault: true },
  { name: 'Arabic', code: 'ar', flag: '🇸🇦', rtlStatus: true, status: true, isDefault: false },
  { name: 'Bulgarian', code: 'bg', flag: '🇧🇬', rtlStatus: false, status: false, isDefault: false },
  { name: 'Thai', code: 'th', flag: '🇹🇭', rtlStatus: false, status: false, isDefault: false },
  { name: 'Serbian', code: 'sr', flag: '🇷🇸', rtlStatus: false, status: false, isDefault: false },
  { name: 'Georgian', code: 'ka', flag: '🇬🇪', rtlStatus: false, status: false, isDefault: false },
  { name: 'German', code: 'de', flag: '🇩🇪', rtlStatus: false, status: false, isDefault: false },
  { name: 'Spanish', code: 'es', flag: '🇪🇸', rtlStatus: false, status: false, isDefault: false },
  { name: 'Estonian', code: 'et', flag: '🇪🇪', rtlStatus: false, status: false, isDefault: false },
  { name: 'Farsi', code: 'fa', flag: '🇮🇷', rtlStatus: true, status: true, isDefault: false },
  { name: 'French', code: 'fr', flag: '🇫🇷', rtlStatus: false, status: false, isDefault: false },
  { name: 'Japanese', code: 'ja', flag: '🇯🇵', rtlStatus: false, status: false, isDefault: false },
  { name: 'Greek', code: 'el', flag: '🇬🇷', rtlStatus: false, status: false, isDefault: false },
  { name: 'Italian', code: 'it', flag: '🇮🇹', rtlStatus: false, status: false, isDefault: false },
]

async function main() {
  try {
    console.log('Connecting to database...')
    await prisma.$connect()
    
    console.log('Seeding languages...')
    
    for (const language of initialLanguages) {
      try {
        const result = await prisma.language.upsert({
          where: { code: language.code },
          update: {
            name: language.name,
            flag: language.flag,
            rtlStatus: language.rtlStatus,
            status: language.status,
            isDefault: language.isDefault
          },
          create: language,
        })
        console.log(`✓ Processed language: ${language.name} (${language.code})`)
      } catch (error) {
        console.error(`✗ Error processing language ${language.name}:`, error.message)
      }
    }
    
    console.log('Languages seeded successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
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
