import dynamic from 'next/dynamic'
import Settings from '@/views/admin/settings'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

const AppSettingsTab = dynamic(() => import('@/views/admin/settings/app-settings'))
const ProfileSettingsTab = dynamic(() => import('@/views/admin/settings/profile-settings'))
const NotificationSettingsTab = dynamic(() => import('@/views/admin/settings/notification-settings'))
const LanguageSettingsTab = dynamic(() => import('@/views/admin/settings/language-settings'))
const CurrencySettingsTab = dynamic(() => import('@/views/admin/settings/currency-settings'))
const PaymentCredentialsTab = dynamic(() => import('@/views/admin/settings/payment-credentials'))
const FinanceSettingsTab = dynamic(() => import('@/views/admin/settings/finance-settings'))
const SuperadminRoleTab = dynamic(() => import('@/views/admin/settings/superadmin-role'))
const SocialLoginTab = dynamic(() => import('@/views/admin/settings/social-login'))
const SecuritySettingsTab = dynamic(() => import('@/views/admin/settings/security-settings'))
const GoogleCalendarTab = dynamic(() => import('@/views/admin/settings/google-calendar'))
const ThemeSettingsTab = dynamic(() => import('@/views/admin/settings/theme-settings'))
const ModuleSettingsTab = dynamic(() => import('@/views/admin/settings/module-settings'))
const DatabaseBackupTab = dynamic(() => import('@/views/admin/settings/database-backup'))
const UpdateAppTab = dynamic(() => import('@/views/admin/settings/update-app'))
import FileUploadSettings from '@views/admin/settings/file-upload-settings'

const tabContentList = () => ({
  'app-settings': <AppSettingsTab />,
  'profile-settings': <ProfileSettingsTab />,
  'notification-settings': <NotificationSettingsTab />,
  'language-settings': <LanguageSettingsTab />,
  'currency-settings': <CurrencySettingsTab />,
  'payment-credentials': <PaymentCredentialsTab />,
  'finance-settings': <FinanceSettingsTab />,
  'superadmin-role': <SuperadminRoleTab />,
  'social-login': <SocialLoginTab />,
  'security-settings': <SecuritySettingsTab />,
  'google-calendar': <GoogleCalendarTab />,
  'theme-settings': <ThemeSettingsTab />,
  'module-settings': <ModuleSettingsTab />,
  'database-backup': <DatabaseBackupTab />,
  'update-app': <UpdateAppTab />,
  'file-upload-settings': <FileUploadSettings />
})

const getData = async () => {
  return null
}

const SettingsPage = async () => {
  // Check if user is Super Admin
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SUPER_ADMIN') {
    redirect('/not-authorized')
  }

  return <Settings tabContentList={tabContentList()} />
}

export default SettingsPage