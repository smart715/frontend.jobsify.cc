
// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import CompanyView from '@views/companies/view'

const AccountTab = dynamic(() => import('@views/companies/view/account'))
const SecurityTab = dynamic(() => import('@views/companies/view/security'))
const BillingPlansTab = dynamic(() => import('@views/companies/view/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/companies/view/notifications'))
const ConnectionsTab = dynamic(() => import('@views/companies/view/connections'))

// Vars
const tabContentList = () => ({
  account: <AccountTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlansTab />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const ViewCompanyPage = () => {
  return <CompanyView tabContentList={tabContentList()} />
}

export default ViewCompanyPage
