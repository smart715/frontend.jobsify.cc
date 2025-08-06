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

const Services = ({ tabContentList }) => {
    const [activeTab, setActiveTab] = useState('Services')

    const handleChange = (event, value) => {
    setActiveTab(value)
    }

  return (
    <>
        <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                  <Tab value='Services' label='Services' iconPosition='start' />
                  <Tab value='Bundles' label='Bundles' iconPosition='start' />
                  <Tab value='Categories' label='Categories' iconPosition='start' />
                  <Tab value='ExtraServices' label='Extra Services' iconPosition='start' />
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

export default Services

