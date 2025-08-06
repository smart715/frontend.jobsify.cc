// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/dashboards/cms'

const FaqsTab = dynamic(() => import('@views/dashboards/cms/faqs'))

// Vars
const tabContentList = () => ({
  faqs: <FaqsTab />
})

const eCommerceSettings = () => {
  return <Settings tabContentList={tabContentList()} selectedTab="faqs" />
}

export default eCommerceSettings
