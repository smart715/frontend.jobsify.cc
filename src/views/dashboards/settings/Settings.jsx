"use client"

import { useState } from 'react'

import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid2'

import CustomTabList from '@core/components/mui/TabList'

import BookingForm from '@components/booking-form'
import Payments from '@components/Payments'
import GeneralSettings from '@components/GeneralSettings'
import Schedule from '@components/Schedule'
import Tax from '@components/Tax'
import Role from '@components/Role'
import PremiumFeatures from '@components/PremiumFeatures'
import Notification from '@components/Notification'

const Settings = ({ tabContentList }) => {
    const [activeTab, setActiveTab] = useState('notifications')

    const handleChange = (event, value) => {
    setActiveTab(value)
    }

  return (
    <>
        <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                  <Tab value='general' label='General' iconPosition='start' />
                  <Tab value='schedule' label='Schedule' iconPosition='start' />
                  <Tab value='tax' label='Tax' iconPosition='start' />
                  <Tab value='booking-form' label='Booking Form' iconPosition='start' />
                  <Tab value='payments' label='Payments' iconPosition='start' />
                  <Tab value='notifications' label='Notifications' iconPosition='start' />
                  <Tab value='roles' label='Roles' iconPosition='start' />
                  <Tab value='premium-features' label='Premium Features' iconPosition='start' />
                  <Tab value='packages' label='Packages' iconPosition='start' />
                  <Tab value='features' label='Features' iconPosition='start' />
                  <Tab value='modules' label='Modules' iconPosition='start' />
                </CustomTabList>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TabPanel value={activeTab} className='p-0'>
                  {tabContentList[activeTab]}
                </TabPanel>
              </Grid>
            </Grid>
          </TabContext>
    </>
  );
}

export default Settings

