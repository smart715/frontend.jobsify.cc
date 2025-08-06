// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/dashboards/cms'

const BooknowTab = dynamic(() => import('@views/dashboards/cms/booknow'))

// Vars
const tabContentList = () => ({
  booknow: <BooknowTab />,
})

const eCommerceSettings = () => {
  return <Settings tabContentList={tabContentList()} selectedTab="booknow" />
}

export default eCommerceSettings
