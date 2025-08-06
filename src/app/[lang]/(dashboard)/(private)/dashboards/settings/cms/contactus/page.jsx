// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/dashboards/cms'

const ContactusTab = dynamic(() => import('@views/dashboards/cms/contactus'))

// Vars
const tabContentList = () => ({
  contactus: <ContactusTab />,
})

const eCommerceSettings = () => {
  return <Settings tabContentList={tabContentList()} selectedTab="contactus" />
}

export default eCommerceSettings
