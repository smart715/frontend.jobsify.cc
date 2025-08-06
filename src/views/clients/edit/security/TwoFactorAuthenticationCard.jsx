
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'

const TwoFactorAuthenticationCard = () => {
  // States
  const [isEnabled, setIsEnabled] = useState(false)

  return (
    <Card>
      <CardHeader title='Two-Factor Authentication' subheader='Keep your account secure with authentication step.' />
      <CardContent>
        <FormControlLabel
          control={<Switch checked={isEnabled} onChange={e => setIsEnabled(e.target.checked)} />}
          label='Enable Two-Factor Authentication'
        />
        <Typography className='mbs-4' color='text.secondary'>
          Two factor authentication is not enabled yet.
        </Typography>
        <Typography className='mbe-6' color='text.secondary'>
          Two-factor authentication adds an additional layer of security to your account by requiring more than just a
          password to log in. Learn more.
        </Typography>
        <Button variant='contained' disabled={!isEnabled}>
          {isEnabled ? 'Configure' : 'Enable Two-Factor Authentication'}
        </Button>
      </CardContent>
    </Card>
  )
}

export default TwoFactorAuthenticationCard
