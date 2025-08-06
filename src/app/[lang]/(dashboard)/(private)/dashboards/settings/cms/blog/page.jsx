// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/dashboards/cms'

const BlogTab = dynamic(() => import('@views/dashboards/cms/blog'))

// Vars
const tabContentList = () => ({
  blog: <BlogTab />,
})

const eCommerceSettings = () => {
  return <Settings tabContentList={tabContentList()} selectedTab="blog" />
}

export default eCommerceSettings
