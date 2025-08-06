'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from '@components/Link'
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Utils Imports
import { showErrorToast } from '@/utils/toast'

const AccountDetails = () => {
  const [companyData, setCompanyData] = useState({})
  const [loading, setLoading] = useState(true)

  // Hooks
  const { id } = useParams()

  // Load company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`/api/companies/${id}`)
        if (response.ok) {
          const data = await response.json()
          setCompanyData(data)
        } else {
          showErrorToast('Failed to load company data')
        }
      } catch (error) {
        console.error('Error loading company:', error)
        showErrorToast('Error loading company data')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCompanyData()
    }
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Company ID'
                  value={companyData.companyId || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Company Name'
                  value={companyData.companyName || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Company Email'
                  value={companyData.companyEmail || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Company Phone'
                  value={companyData.companyPhone || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Website'
                  value={companyData.website || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex items-center gap-2'>
                  <Typography variant='body2' className='font-medium'>Status:</Typography>
                  <Chip
                    label={companyData.status || 'Unknown'}
                    color={companyData.status === 'Active' ? 'success' : companyData.status === 'Inactive' ? 'error' : 'default'}
                    variant='tonal'
                    size='small'
                  />
                </div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Street Address'
                  value={companyData.streetAddress || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='City'
                  value={companyData.city || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='State'
                  value={companyData.state || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Zip Code'
                  value={companyData.zipcode || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Default Currency'
                  value={companyData.defaultCurrency || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Language'
                  value={companyData.language || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Admin Name'
                  value={companyData.adminName || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label='Admin Email'
                  value={companyData.adminEmail || ''}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AccountDetails