// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import AccountSettings from '@views/dashboards/site-settings'

const AccountTab = dynamic(() => import('@views/dashboards/site-settings/account'))
const SecurityTab = dynamic(() => import('@views/dashboards/site-settings/security'))
const BillingPlansTab = dynamic(() => import('@views/dashboards/site-settings/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/dashboards/site-settings/notifications'))
const ConnectionsTab = dynamic(() => import('@views/dashboards/site-settings/connections'))

// Vars
const tabContentList = () => ({
  account: <AccountTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlansTab />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const SiteSettingsPage = () => {
  return <AccountSettings tabContentList={tabContentList()} />
}

export default SiteSettingsPage
