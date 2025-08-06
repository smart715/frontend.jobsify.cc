// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/dashboards/cms'

const HomeTab = dynamic(() => import('@views/dashboards/cms/home'))

// Vars
const tabContentList = () => ({
  home: <HomeTab />,
})

const eCommerceSettings = () => {
  return <Settings tabContentList={tabContentList()} selectedTab="home" />
}

export default eCommerceSettings
