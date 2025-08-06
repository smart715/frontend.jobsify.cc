'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

// Component Imports
import PageHeader from '@/components/PageHeader'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { TabContext } from '@mui/lab'
import CustomAvatar from '@core/components/mui/Avatar'
import UpdateApp from './update-app'
import RestApi from './rest-api'
// Trial Settings
// import TrialSettings from './trial-settings/index.jsx'
// import StripeSettings from './stripe-settings'

const Settings = ({ tabContentList, selectedTab = 'app-settings' }) => {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') || selectedTab
  )

  const handleChange = (event, value) => {
    setActiveTab(value)
    const url = `/${params.lang}/admin/settings?tab=${value}`
    router.replace(url, { scroll: false })
  }

  const tabData = [
    {
      value: 'app-settings',
      label: 'App Settings',
      icon: 'ri-settings-3-line',
    },
    {
      value: 'profile-settings',
      label: 'Profile Settings',
      icon: 'ri-user-line',
    },
    {
      value: 'notification-settings',
      label: 'Notification Settings',
      icon: 'ri-notification-line',
    },
    {
      value: 'language-settings',
      label: 'Language Settings',
      icon: 'ri-global-line',
    },
    {
      value: 'currency-settings',
      label: 'Currency Settings',
      icon: 'ri-money-dollar-circle-line',
    },
    {
      value: 'payment-credentials',
      label: 'Payment Credentials',
      icon: 'ri-bank-card-line',
    },
    {
      value: 'finance-settings',
      label: 'Finance Settings',
      icon: 'ri-money-euro-circle-line',
    },
    {
      value: 'superadmin-role',
      label: 'Superadmin Role & Permission',
      icon: 'ri-shield-user-line',
    },
    {
      value: 'social-login',
      label: 'Social Login Settings',
      icon: 'ri-login-box-line',
    },
    {
      value: 'security-settings',
      label: 'Security Settings',
      icon: 'ri-shield-check-line',
    },
    {
      value: 'google-calendar',
      label: 'Google Calendar Settings',
      icon: 'ri-calendar-line',
    },
    {
      value: 'theme-settings',
      label: 'Theme Settings',
      icon: 'ri-palette-line',
    },
    {
      value: 'module-settings',
      label: 'Module Settings',
      icon: 'ri-grid-line',
    },
    {
      value: 'database-backup',
      label: 'Database Backup Settings',
      icon: 'ri-database-2-line',
    },
    {
      value: 'update-app',
      label: 'Update App',
      icon: 'ri-download-cloud-line',
    },
  ]

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <PageHeader
            title="Settings"
            subtitle="Configure your application settings and preferences"
            breadcrumbs={[
              { label: 'Admin', href: '/admin' }
            ]}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TabList
                orientation="vertical"
                onChange={handleChange}
                sx={{
                  border: 0,
                  minHeight: 'auto',
                  '& .MuiTabs-indicator': {
                    display: 'none',
                  },
                  '& .MuiTab-root': {
                    minHeight: 'auto',
                    minWidth: '100%',
                    textAlign: 'start',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    borderRadius: 0,
                    py: 3,
                    px: 4,
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'primary.main',
                      backgroundColor: 'action.selected',
                    },
                  },
                }}
              >
                {tabData.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 2 },
                        }}
                      >
                        <CustomAvatar skin="light" size={22}>
                          <i
                            className={tab.icon}
                            style={{ fontSize: '14px' }}
                          />
                        </CustomAvatar>
                        <span>{tab.label}</span>
                      </Box>
                    }
                  />
                ))}
              </TabList>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={9}>
          {tabData.map((tab) => (
            <TabPanel key={tab.value} value={tab.value} sx={{ p: 0 }}>
              {tabContentList[tab.value]}
            </TabPanel>
          ))}
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default Settings