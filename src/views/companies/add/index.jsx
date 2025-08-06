'use client'

// React Imports
import React, { useState, useEffect } from 'react'

// Next Imports
import Link from '@components/Link'
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const AddCompanySettings = ({ tabContentList }) => {
  // States
  const [activeTab, setActiveTab] = useState('account')
  const [completedTabs, setCompletedTabs] = useState([])
  const [mounted, setMounted] = useState(false)
  const [companyData, setCompanyData] = useState(null)

  // Hooks
  const { lang: locale } = useParams()

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (event, value) => {
    setActiveTab(value)
  }

  const handleNextTab = (currentTab, data = null) => {
    console.log('handleNextTab called with:', { currentTab, data }) // Debug log
    
    // Mark current tab as completed
    if (!completedTabs.includes(currentTab)) {
      setCompletedTabs([...completedTabs, currentTab])
    }

    // Store company data when coming from account tab
    if (currentTab === 'account' && data) {
      console.log('Setting company data:', data) // Debug log
      setCompanyData({ ...data, isNewCompany: true })
    }

    // Move to next tab based on current tab
    const tabOrder = ['account', 'security', 'billing-plans', 'notifications', 'connections']
    const currentIndex = tabOrder.indexOf(currentTab)
    if (currentIndex < tabOrder.length - 1) {
      const nextTab = tabOrder[currentIndex + 1]
      console.log('Moving to next tab:', nextTab) // Debug log
      setActiveTab(nextTab)
    }
  }

  const handlePasswordSet = () => {
    // Mark security as completed and move to next tab
    if (!completedTabs.includes('security')) {
      setCompletedTabs([...completedTabs, 'security'])
    }
    setActiveTab('billing-plans')
  }

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Button
          variant='contained'
          component={Link}
          startIcon={<i className='ri-arrow-left-line' />}
          href={getLocalizedUrl('companies', locale)}
          className='max-sm:is-full'
        >
          Back to Company
        </Button>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                <Tab label='Account' icon={<i className='ri-user-3-line' />} iconPosition='start' value='account' />
                <Tab label='Security' icon={<i className='ri-lock-2-line' />} iconPosition='start' value='security' />
                <Tab
                  label='Billing & Plans'
                  icon={<i className='ri-bookmark-line' />}
                  iconPosition='start'
                  value='billing-plans'
                />
                <Tab
                  label='Notifications'
                  icon={<i className='ri-notification-4-line' />}
                  iconPosition='start'
                  value='notifications'
                />
                <Tab
                  label='Connections'
                  icon={<i className='ri-link-m' />}
                  iconPosition='start'
                  value='connections'
                />
              </CustomTabList>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TabPanel value={activeTab} className='p-0'>
                {activeTab === 'security' ? 
                  React.cloneElement(tabContentList[activeTab], { 
                    onNext: handlePasswordSet, 
                    companyData: companyData 
                  }) :
                  React.cloneElement(tabContentList[activeTab], { 
                    onNext: (data) => handleNextTab(activeTab, data),
                    companyData 
                  })
                }
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default AddCompanySettings