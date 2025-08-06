// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import CompanyView from '@views/companies/view'

const AccountTab = dynamic(() => import('@views/companies/view/account'))
const SecurityTab = dynamic(() => import('@views/companies/view/security'))
const BillingPlansTab = dynamic(() => import('@views/companies/view/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/companies/view/notifications'))

// Get company ID from params
const getCompanyId = async (params) => {
  const resolvedParams = await params
  return resolvedParams.id
}
const ConnectionsTab = dynamic(() => import('@views/companies/view/connections'))

// Vars
const tabContentList = (companyId) => ({
  account: <AccountTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlansTab />,
  notifications: <NotificationsTab companyId={companyId} />,
  connections: <ConnectionsTab />
})

const ViewCompanyPage = async ({ params }) => {
  const companyId = await getCompanyId(params)
  return <CompanyView tabContentList={tabContentList(companyId)} />
}

export default ViewCompanyPage;