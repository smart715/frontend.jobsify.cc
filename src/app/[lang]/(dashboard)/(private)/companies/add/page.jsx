
// Component Imports
import CompanySettings from '@views/companies/add'
import AccountTab from '@views/companies/add/account'
import SecurityTab from '@views/companies/add/security'
import BillingPlansTab from '@views/companies/add/billing-plans'
import NotificationsTab from '@views/companies/add/notifications'
import ConnectionsTab from '@views/companies/add/connections'

// Vars
const tabContentList = {
  account: <AccountTab />,
  security: <SecurityTab />,
  'billing-plans': <BillingPlansTab />,
  notifications: <NotificationsTab />,
  connections: <ConnectionsTab />
}

const CompanyAddPage = () => {
  return <CompanySettings tabContentList={tabContentList} />
}

export default CompanyAddPage
