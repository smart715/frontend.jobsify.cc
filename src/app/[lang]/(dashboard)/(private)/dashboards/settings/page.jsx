
import dynamic from 'next/dynamic'

import Settings from "@/views/dashboards/settings/Settings"

import { getPricingData } from '@/app/server/actions'


const GeneralTab = dynamic(() => import('@views/dashboards/settings/general'))
const ScheduleTab = dynamic(() => import('@views/dashboards/settings/schedule'))
const TaxTab = dynamic(() => import('@views/dashboards/settings/tax'))
const PaymentTab = dynamic(() => import('@views/dashboards/settings/payment'))
const NotificationTab = dynamic(() => import('@views/dashboards/settings/notification'))
const PackagesSettingsTab = dynamic(() => import('@/views/dashboards/settings/packages'))
const FeaturesSettingsTab = dynamic(() => import('@/views/dashboards/settings/features'))
const ModulesSettingsTab = dynamic(() => import('@/views/dashboards/settings/modules'))


// Vars
const tabContentList = data => ({
  general: <GeneralTab />,
  schedule: <ScheduleTab />,
  tax: <TaxTab />,
  payments: <PaymentTab />,
  notifications: <NotificationTab />,
  packages: <PackagesSettingsTab />,
  features: <FeaturesSettingsTab />,
  modules: <ModulesSettingsTab />
})


const SettingsPage = async () => {
    const data = await getPricingData()
  
  return <Settings tabContentList={tabContentList(data)}/>
}

export default SettingsPage
