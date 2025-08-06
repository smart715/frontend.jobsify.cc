// Next Imports
import { headers } from 'next/headers'
// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Component Imports

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export async function generateMetadata({ params }) {
  // Default metadata
  const defaultTitle = 'Materialize - Material Next.js Admin Template'
  const defaultDescription = 'Materialize - Material Next.js Admin Template'

  // Get app name from database
  const getAppName = async () => {
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()

      // Check if the system_settings table exists and is accessible
      const appNameSetting = await prisma.systemSettings.findFirst({
        where: { key: 'app-name' }
      }).catch(() => null)

      await prisma.$disconnect()
      return appNameSetting?.value || 'Materialize'
    } catch (error) {
      console.error('Could not fetch app name setting:', error)
      return 'Materialize'
    }
  }

  try {
    const appName = await getAppName()
    if (appName) {
      return {
        title: `${appName} - Admin Panel`,
        description: `${appName} - Admin Panel`
      }
    }
  } catch (error) {
    console.error('Error fetching app settings for metadata:', error)
  }

  return {
    title: defaultTitle,
    description: defaultDescription
  }
}

const RootLayout = async props => {
  const params = await props.params
  const { children } = props

  // Vars
  const headersList = await headers()
  const systemMode = await getSystemMode()
  const direction = i18n.langDirection[params.lang]

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <html id='__next' lang={params.lang} dir={direction} suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col' suppressHydrationWarning>
          <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
          {children}
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout