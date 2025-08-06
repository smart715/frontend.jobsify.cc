// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/dashboards/cms'

const CategoriesTab = dynamic(() => import('@views/dashboards/cms/categories'))

// Vars
const tabContentList = () => ({
  categories: <CategoriesTab />,
})

const eCommerceSettings = () => {
  return <Settings tabContentList={tabContentList()} selectedTab="categories" />
}

export default eCommerceSettings
