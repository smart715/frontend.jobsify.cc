'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

// Third-party Imports
import { useSession } from 'next-auth/react'

// Utils Imports
import { toast } from '@/utils/toast'

const EditCompanySettings = ({ tabContentList }) => {
  // States
  const [activeTab, setActiveTab] = useState('account')
  const [companyData, setCompanyData] = useState(null)

  // Hooks
  const { lang: locale, id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, update } = useSession()

  // Fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/companies/${id}`)
        if (response.ok) {
          const data = await response.json()
          setCompanyData(data)
        } else {
          console.error('Failed to fetch company data')
        }
      } catch (error) {
        console.error('Error fetching company data:', error)
      }
    }

    if (id) {
      fetchCompanyData()
    }
  }, [id])

  useEffect(() => {
    const fromAdd = searchParams.get('from-add')
    if (fromAdd === 'true') {
      setActiveTab('security')
    }
  }, [searchParams])

  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleImpersonation = async () => {
    if (!companyData?.companyId) {
      toast.error('Company ID not found')
      return
    }

    try {
      const response = await fetch('/api/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: companyData.companyId,
          type: 'company',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start impersonation')
      }

      const data = await response.json()
      console.log('✅ Impersonation successful for:', data.impersonationData?.companyName)
      toast.success(`Successfully logged in as ${companyData.companyName}`)

      // Force session refresh by updating the session
      await update()

      // Small delay to ensure session is updated
      setTimeout(() => {
        // Redirect ADMIN users to CRM dashboard, others to default dashboard
        const redirectPath = data.impersonationData?.role === 'ADMIN' 
          ? '/en/dashboards/crm' 
          : '/en/dashboards/dashboard'
        window.location.replace(redirectPath)
      }, 500)

    } catch (error) {
      console.error('❌ Error in impersonation:', error)
      toast.error(
        error.message || 'An error occurred while trying to login as company.'
      )
    }
  }

  if (!companyData) {
    return <div>Company not found</div>
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        {/* Impersonation Button Section */}
         
        <Grid size={{ xs: 6, sm: 9 }}>
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
        <Grid size={{ xs: 6, sm: 3 }}>
          {session?.user?.role === 'SUPER_ADMIN' && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<i className="ri-login-circle-line" />}
              onClick={handleImpersonation}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                wordBreak: 'break-all',
                float: 'right'
              }}
            >
              Impersonate As Company
            </Button>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value={activeTab} className='p-0'>
            {tabContentList[activeTab]}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default EditCompanySettings
