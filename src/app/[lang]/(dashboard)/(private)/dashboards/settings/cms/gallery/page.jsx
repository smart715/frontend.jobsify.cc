// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/dashboards/cms'

const GalleryTab = dynamic(() => import('@views/dashboards/cms/gallery'))

// Vars
const tabContentList = () => ({
  gallery: <GalleryTab />,
})

const eCommerceSettings = () => {
  return <Settings tabContentList={tabContentList()} selectedTab="gallery" />
}

export default eCommerceSettings
