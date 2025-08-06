
'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

const AccountTab = () => {
  // States
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Hooks
  const params = useParams()
  const { lang: locale } = useParams()

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/clients/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setClientData(data)
        }
      } catch (error) {
        console.error('Error fetching client:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!clientData) {
    return <div>Client not found</div>
  }

  return (
    <Grid container spacing={6}>
      {/* Client Header */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6'>
              <CustomAvatar size={120}>
                {getInitials(`${clientData.firstName} ${clientData.lastName}`)}
              </CustomAvatar>
              <div className='flex-grow'>
                <Typography variant='h4' className='mbe-2'>
                  {`${clientData.firstName} ${clientData.lastName}`}
                </Typography>
                <Typography variant='body1' color='text.secondary' className='mbe-4'>
                  Client ID: {clientData.clientId}
                </Typography>
                <div className='flex items-center gap-2 mb-4'>
                  <Chip
                    label={clientData.status}
                    color={clientData.status === 'Active' ? 'success' : 'error'}
                    variant='filled'
                    size='small'
                  />
                  {clientData.category && (
                    <Chip
                      label={clientData.category}
                      color='primary'
                      variant='outlined'
                      size='small'
                    />
                  )}
                  {clientData.subCategory && (
                    <Chip
                      label={clientData.subCategory}
                      color='secondary'
                      variant='outlined'
                      size='small'
                    />
                  )}
                </div>
                <Button
                  variant='contained'
                  component='a'
                  href={getLocalizedUrl(`/clients/edit/${clientData.id}`, locale)}
                  startIcon={<i className='ri-pencil-line' />}
                >
                  Edit Client
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Personal Information */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant='h5' className='mbe-6'>
              Personal Information
            </Typography>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  First Name
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.firstName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Last Name
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.lastName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Email
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.email}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Phone
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Gender
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.gender || 'Not specified'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Address Information */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant='h5' className='mbe-6'>
              Address Information
            </Typography>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Address
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.address || 'Not provided'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  City
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.city || 'Not provided'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  State
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.state || 'Not provided'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  ZIP Code
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.zipCode || 'Not provided'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Country
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.country || 'Not provided'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Client Settings */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant='h5' className='mbe-6'>
              Client Settings
            </Typography>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Language
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.language || 'Not set'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Category
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.category || 'Not set'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Sub Category
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  {clientData.subCategory || 'Not set'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant='body2' color='text.secondary' className='mb-1'>
                  Login Allowed
                </Typography>
                <Typography variant='body1' className='font-medium'>
                  <Chip
                    label={clientData.loginAllowed ? 'Yes' : 'No'}
                    color={clientData.loginAllowed ? 'success' : 'error'}
                    variant='outlined'
                    size='small'
                  />
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
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AccountTab
