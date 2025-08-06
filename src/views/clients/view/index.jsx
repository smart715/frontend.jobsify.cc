'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const ClientView = ({ clientData }) => {
  // States
  const [activeTab, setActiveTab] = useState('account')
  const [mounted, setMounted] = useState(false)

  // Hooks
  const { lang: locale } = useParams()

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (event, value) => {
    setActiveTab(value)
  }

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  const tabContentList = {
    account: (
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <Typography variant='h5'>
              Client Details
            </Typography>
            {clientData && (
              <Typography variant='body2' color='text.secondary'>
                Client ID: {clientData.clientId}
              </Typography>
            )}
          </div>
          {clientData && (
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Full Name
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {`${clientData.firstName} ${clientData.lastName}`}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Email Address
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.email}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Phone Number
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.phone || 'Not provided'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Company
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.company || 'Not provided'}
                </Typography>
              </Grid>
              {(clientData.address || clientData.city || clientData.state || clientData.zipCode) && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' color='text.secondary' className='mb-1'>
                    Address
                  </Typography>
                  <Typography variant='body1' className='font-medium'>
                    {[
                      clientData.address,
                      clientData.city,
                      clientData.state,
                      clientData.zipCode
                    ].filter(Boolean).join(', ') || 'Not provided'}
                  </Typography>
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Status
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    clientData.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {clientData.status}
                  </span>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Created On
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {new Date(clientData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Grid>
              {clientData.notes && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' color='text.secondary' className='mb-1'>
                    Notes
                  </Typography>
                  <Typography variant='body1' className='font-medium'>
                    {clientData.notes}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Button
            variant='outlined'
            component={Link}
            startIcon={<i className='ri-arrow-left-line' />}
            href={getLocalizedUrl('clients', locale)}
            className='max-sm:is-full'
          >
            Back to Clients
          </Button>
          {clientData && (
            <Button
              variant='contained'
              component={Link}
              startIcon={<i className='ri-pencil-line' />}
              href={getLocalizedUrl(`clients/edit/${clientData.id}`, locale)}
              className='max-sm:is-full'
            >
              Edit Client
            </Button>
          )}
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <TabPanel value='account' className='p-0'>
                {tabContentList['account']}
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default ClientView