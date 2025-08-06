
'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const Address = () => {
  return (
    <Card>
      <CardHeader title='Billing Address' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <div>
              <Typography variant='body2' color='text.secondary' className='mbe-1'>
                Company Name
              </Typography>
              <Typography variant='body1' className='font-medium'>
                Materialize Inc.
              </Typography>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <div>
              <Typography variant='body2' color='text.secondary' className='mbe-1'>
                Billing Email
              </Typography>
              <Typography variant='body1' className='font-medium'>
                john.doe@example.com
              </Typography>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <div>
              <Typography variant='body2' color='text.secondary' className='mbe-1'>
                Tax ID
              </Typography>
              <Typography variant='body1' className='font-medium'>
                TAX-123456789
              </Typography>
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <div>
              <Typography variant='body2' color='text.secondary' className='mbe-1'>
                VAT Number
              </Typography>
              <Typography variant='body1' className='font-medium'>
                VAT-987654321
              </Typography>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div>
              <Typography variant='body2' color='text.secondary' className='mbe-1'>
                Billing Address
              </Typography>
              <Typography variant='body1' className='font-medium'>
                123 Business Street, Suite 100, New York, NY 10001
              </Typography>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Address
