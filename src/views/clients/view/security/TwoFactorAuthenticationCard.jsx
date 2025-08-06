
'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const TwoFactorAuthenticationCard = () => {
  const isEnabled = true

  return (
    <Card>
      <CardHeader title='Two-Factor Authentication' />
      <CardContent>
        <div className='flex items-center gap-2 mbe-4'>
          <Typography>Status:</Typography>
          <Chip
            label={isEnabled ? 'Enabled' : 'Disabled'}
            color={isEnabled ? 'success' : 'error'}
            size='small'
            variant='tonal'
          />
        </div>
        <Typography color='text.secondary'>
          {isEnabled
            ? 'Two-factor authentication is currently enabled for this account.'
            : 'Two-factor authentication is not enabled for this account.'}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default TwoFactorAuthenticationCard
