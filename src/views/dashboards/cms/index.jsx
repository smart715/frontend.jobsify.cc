'use client'

// React Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

const Settings = ({ tabContentList, selectedTab }) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(selectedTab)

  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
    router.push(`/en/dashboards/settings/cms/${newValue}`) // change URL on tab click
  }

  useEffect(() => {
    setActiveTab(selectedTab)
  }, [selectedTab])

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant='h5' className='mbe-4'>
            Getting Started
          </Typography>
          <CustomTabList orientation='vertical' onChange={handleChange} className='is-full' pill='true'>
            <Tab
              label='Home'
              icon={<i className='ri-store-2-line' />}
              iconPosition='start'
              value='home'
              className='flex-row justify-start !min-is-full'
            />
            <Tab
              label='Categories'
              icon={<i className='ri-bank-card-line' />}
              iconPosition='start'
              value='categories'
              className='flex-row justify-start !min-is-full'
            />
            <Tab
              label='Gallery'
              icon={<i className='ri-shopping-cart-line' />}
              iconPosition='start'
              value='gallery'
              className='flex-row justify-start !min-is-full'
            />
            <Tab
              label='Testimonials'
              icon={<i className='ri-car-line' />}
              iconPosition='start'
              value='testimonials'
              className='flex-row justify-start !min-is-full'
            />
            <Tab
              label='Blog'
              icon={<i className='ri-map-pin-2-line' />}
              iconPosition='start'
              value='blog'
              className='flex-row justify-start !min-is-full'
            />
            <Tab
              label='Contact Us'
              icon={<i className='ri-notification-4-line' />}
              iconPosition='start'
              value='contactus'
              className='flex-row justify-start !min-is-full'
            />
             <Tab
              label='Book Now'
              icon={<i className='ri-notification-4-line' />}
              iconPosition='start'
              value='booknow'
              className='flex-row justify-start !min-is-full'
            />
             <Tab
              label='Faqs'
              icon={<i className='ri-notification-4-line' />}
              iconPosition='start'
              value='faqs'
              className='flex-row justify-start !min-is-full'
            />
          </CustomTabList>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={6}>
          </Grid>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default Settings
