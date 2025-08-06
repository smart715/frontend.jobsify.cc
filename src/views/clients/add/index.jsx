'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import ClientAccountDetails from './account/ClientAccountDetails'

const AddClient = () => {
  // States
  const [activeTab, setActiveTab] = useState('account')

  // Hooks
  const { lang: locale } = useParams()

  const handleChange = (event, value) => {
    setActiveTab(value)
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
            <Tab icon={<i className='ri-group-line' />} value='account' label='Account' iconPosition='start' />
          </CustomTabList>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value='account' className='p-0'>
            <ClientAccountDetails />
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default AddClient