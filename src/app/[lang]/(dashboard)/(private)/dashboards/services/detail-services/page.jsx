
import dynamic from 'next/dynamic'

import Services from "@/views/dashboards/services/detail-services"

import { getPricingData } from '@/app/server/actions'


const ServicesTab = dynamic(() => import('@views/dashboards/services/detail-services/services'))

// const ScheduleTab = dynamic(() => import('@views/dashboards/settings/schedule'))
// const TaxTab = dynamic(() => import('@views/dashboards/settings/tax'))
// const PaymentTab = dynamic(() => import('@views/dashboards/settings/payment'))
// const NotificationTab = dynamic(() => import('@views/dashboards/settings/notification'))


// Vars
const tabContentList = data => ({
    Services: <ServicesTab></ServicesTab>,
    Bundles: <></>,
    Categories: <></>,
    ExtraServices: <></>
})


const SettingsPage = async () => {
    const data = await getPricingData()
  
  return <Services tabContentList={tabContentList(data)}/>
}

export default SettingsPage
