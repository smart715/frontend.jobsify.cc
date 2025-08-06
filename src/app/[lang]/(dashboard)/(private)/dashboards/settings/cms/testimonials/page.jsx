// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Settings from '@views/dashboards/cms'

const TestimonialTab = dynamic(() => import('@views/dashboards/cms/testimonial'))

// Vars
const tabContentList = () => ({
  testimonial: <TestimonialTab />,
})

const eCommerceSettings = () => {
  return <Settings tabContentList={tabContentList()} selectedTab="testimonials" />
}

export default eCommerceSettings
