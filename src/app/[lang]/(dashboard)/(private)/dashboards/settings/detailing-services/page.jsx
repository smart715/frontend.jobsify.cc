
import dynamic from 'next/dynamic'

import DetailingServices from "@/views/dashboards/detailing_services/DetailingServices"

import { getPricingData } from '@/app/server/actions'


const NotificationsTab = dynamic(() => import('@views/dashboards/detailing_services/notifications'))
const VehiclesTab = dynamic(() => import('@views/dashboards/detailing_services/vehicles'))


// Vars
const tabContentList = data => ({
  notifications: <NotificationsTab />,
  vehicles: <VehiclesTab />
})


const DetailingServicesPage = async () => {
    const data = await getPricingData()
  
  return <DetailingServices tabContentList={tabContentList(data)}/>
}

export default DetailingServicesPage
