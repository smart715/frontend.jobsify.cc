// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import CompanyEdit from '@views/companies/edit'

const AccountTab = dynamic(() => import('@views/companies/edit/account'))
const SecurityTab = dynamic(() => import('@views/companies/edit/security'))
const BillingPlansTab = dynamic(() => import('@views/companies/edit/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/companies/edit/notifications'))
const ConnectionsTab = dynamic(() => import('@views/companies/edit/connections'))

// Vars
const tabContentList = () => ({
  account: <AccountTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlansTab />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
})

const CompanyEditPage = () => {
  return <CompanyEdit tabContentList={tabContentList()} />
}

export default CompanyEditPage