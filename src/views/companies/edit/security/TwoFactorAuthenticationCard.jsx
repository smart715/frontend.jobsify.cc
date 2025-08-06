
'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import TwoFactorAuth from '@components/dialogs/two-factor-auth'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const TwoFactorAuthenticationCard = () => {
  // States
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const { data: session } = useSession()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/auth/user-profile`)
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
        setIsEnabled(data.isTwoFactorEnabled || false)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/disable-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id
        }),
      })

      if (response.ok) {
        setIsEnabled(false)
        setUserProfile(prev => ({ ...prev, isTwoFactorEnabled: false }))
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const buttonProps = {
    variant: 'contained',
    children: isEnabled ? 'Reconfigure' : 'Enable two-factor authentication',
    disabled: isLoading
  }

  if (isLoading) {
    return (
      <Card className='mbe-6'>
        <CardHeader title='Two Factor Authentication' />
        <CardContent className='flex justify-center'>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='mbe-6'>
      <CardHeader title='Two Factor Authentication' />
      <CardContent>
        {isEnabled ? (
          <>
            <Alert severity="success" className='mbe-4'>
              Two-factor authentication is currently enabled for your account.
            </Alert>
            <Typography className='mbe-4'>
              Your account is protected with an additional layer of security.
            </Typography>
            <div className='flex gap-2'>
              <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={TwoFactorAuth} />
              <Button 
                variant='outlined' 
                color='error' 
                onClick={handleDisable2FA}
                disabled={isLoading}
              >
                Disable 2FA
              </Button>
            </div>
          </>
        ) : (
          <>
            <Typography className='mbe-4'>
              Two factor authentication is not enabled yet.
            </Typography>
            <Typography className='mbe-6'>
              Two-factor authentication adds an additional layer of security to your account by requiring more than just a
              password to log in. Learn more.
            </Typography>
            <div>
              <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={TwoFactorAuth} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default TwoFactorAuthenticationCard
