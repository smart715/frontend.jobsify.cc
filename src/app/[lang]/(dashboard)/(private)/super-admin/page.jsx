
// React Imports
import { cookies } from 'next/headers'

// Components Imports
import SuperAdminList from '@views/super-admin/list'
import { getDictionary } from '@/utils/getDictionary'

const SuperAdminPage = async ({ params }) => {
  // Vars
  const { lang: locale } = await params
  const dictionaries = await getDictionary(locale)

  // Get mode from cookies
  const cookieStore = await cookies()
  const mode = cookieStore.get('mode')?.value || 'light'

  return <SuperAdminList mode={mode} locale={locale} dictionary={dictionaries} />
}

export default SuperAdminPage
