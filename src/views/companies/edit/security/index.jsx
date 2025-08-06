'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'

// Component Imports
import TwoFactorAuth from '@/components/dialogs/two-factor-auth'
import RecentDevicesTable from './RecentDevicesTable'

// Utils Imports
import { toast } from 'react-toastify'

const SecurityTab = ({companyData}) => {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [twoFactorOpen, setTwoFactorOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if company has 2FA enabled
  useEffect(() => {
    if (companyData?.adminUser?.totpEnabled) {
      setTwoFactorAuth(true)
    }
  }, [companyData])

  const handlePasswordChange = (event) => {
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value
    })
  }

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    // Get company ID from URL params
    const urlParams = window.location.pathname.split('/')
    const companyId = urlParams[urlParams.indexOf('edit') + 1]

    if (!companyId) {
      toast.error('Company ID not found')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/companies/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: companyId,
          newPassword: passwordData.newPassword,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Password changed successfully! A notification email has been sent to the company admin.')
        setPasswordData({
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(result.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('An error occurred while changing the password')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTwoFactorToggle = async () => {
    if (twoFactorAuth) {
      // Disable 2FA for company
      try {
        const response = await fetch('/api/auth/disable-2fa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyId: companyData.id
          })
        })

        if (response.ok) {
          setTwoFactorAuth(false)
          toast.success('Two-factor authentication disabled successfully!')
        } else {
          toast.error('Failed to disable two-factor authentication')
        }
      } catch (error) {
        console.error('Error disabling 2FA:', error)
        toast.error('An error occurred while disabling 2FA')
      }
    } else {
      // Enable 2FA for company
      setTwoFactorOpen(true)
    }
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Change Password' />
            <CardContent>
              <form onSubmit={e => e.preventDefault()}>
                <Grid container spacing={6}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label='New Password'
                      name='newPassword'
                      type='password'
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      helperText="Minimum 8 characters"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label='Confirm New Password'
                      name='confirmPassword'
                      type='password'
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      error={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword}
                      helperText={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? 'Passwords do not match' : ''}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button 
                      variant='contained' 
                      onClick={handlePasswordSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Two-factor Authentication' subheader='Keep your account secure with authentication step.' />
            <CardContent>
              <Typography className='font-medium' color='text.primary'>
                Authenticator App
              </Typography>
              <div className='flex items-center justify-between'>
                <div className='flex flex-col items-start'>
                  <Typography color='text.primary'>Two-factor Authentication via Authenticator App</Typography>
                  <Typography variant='body2'>Enable app-based two-factor authentication using Google Authenticator or similar apps.</Typography>
                </div>
                <Switch checked={twoFactorAuth} onChange={handleTwoFactorToggle} />
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <RecentDevicesTable companyId={companyData?.id} />
        </Grid>
      </Grid>

      <TwoFactorAuth 
        open={twoFactorOpen} 
        setOpen={setTwoFactorOpen}
        onSuccess={() => {
          setTwoFactorAuth(true)
          toast.success('Two-factor authentication enabled successfully!')
        }}
        companyId={companyData?.id}
        userEmail={companyData?.adminEmail}
        companyData={companyData}
      />
    </>
  )
}

export default SecurityTab