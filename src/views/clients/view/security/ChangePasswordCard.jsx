
'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const ChangePasswordCard = () => {
  return (
    <Card>
      <CardHeader title='Password Information' />
      <CardContent>
        <Typography color='text.secondary' className='mbe-4'>
          Password management is restricted in view mode. Contact administrator for password changes.
        </Typography>
        <div className='space-y-4'>
          <div>
            <Typography variant='body2' color='text.secondary'>
              Last Password Change
            </Typography>
            <Typography variant='body1' className='font-medium'>
              March 15, 2024
            </Typography>
          </div>
          <div>
            <Typography variant='body2' color='text.secondary'>
              Password Strength
            </Typography>
            <Typography variant='body1' className='font-medium text-success'>
              Strong
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard
