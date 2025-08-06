
'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import ClientAccountDetails from './account/ClientAccountDetails'

// Utils Imports
import { getLocalizedUrl } from '@/utils/i18n'

const ClientEdit = () => {
  // States
  const [activeTab, setActiveTab] = useState('account')
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Hooks
  const { lang: locale, id } = useParams()

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return

      try {
        const response = await fetch(`/api/clients/${id}`)
        if (response.ok) {
          const data = await response.json()
          setClientData(data)
        } else {
          console.error('Failed to fetch client')
        }
      } catch (error) {
        console.error('Error fetching client:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [id])

  const handleChange = (event, value) => {
    setActiveTab(value)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!clientData) {
    return <div>Client not found</div>
  }

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Button
              variant='outlined'
              component={Link}
              startIcon={<i className='ri-arrow-left-line' />}
              href={getLocalizedUrl('/clients', locale)}
              className='max-sm:is-full'
            >
              Back to Clients
            </Button>
            <Button
              variant='contained'
              component={Link}
              startIcon={<i className='ri-eye-line' />}
              href={getLocalizedUrl(`/clients/view/${id}`, locale)}
              className='max-sm:is-full'
            >
              View Client
            </Button>
          </div>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
            <Tab icon={<i className='ri-group-line' />} value='account' label='Account' iconPosition='start' />
          </CustomTabList>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value='account' className='p-0'>
            <ClientAccountDetails clientData={clientData} />
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default ClientEdit
