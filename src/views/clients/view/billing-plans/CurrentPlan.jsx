
'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

const CurrentPlan = () => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <div className='border rounded p-4'>
              <div className='flex justify-between items-start mbe-4'>
                <div>
                  <Typography variant='h5' className='mbe-2'>
                    Current Plan
                  </Typography>
                  <Typography color='text.secondary'>A simple start for everyone</Typography>
                </div>
                <Chip label='Active' color='success' size='small' />
              </div>
              <div className='flex items-baseline gap-1 mbe-4'>
                <Typography variant='h3' color='primary'>
                  $0
                </Typography>
                <Typography color='text.secondary'>/month</Typography>
              </div>
              <div>
                <Typography variant='h6' className='mbe-2'>
                  Plan Benefits
                </Typography>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <i className='ri-check-line text-success' />
                    <Typography>10 users included</Typography>
                  </div>
                  <div className='flex items-center gap-2'>
                    <i className='ri-check-line text-success' />
                    <Typography>2 GB of storage</Typography>
                  </div>
                  <div className='flex items-center gap-2'>
                    <i className='ri-check-line text-success' />
                    <Typography>Email support</Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant='h6' className='mbe-4'>
              Plan Usage
            </Typography>
            <div className='space-y-4'>
              <div>
                <div className='flex justify-between items-center mbe-2'>
                  <Typography>API Calls</Typography>
                  <Typography>290 / 300</Typography>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-primary h-2 rounded-full' style={{ width: '97%' }}></div>
                </div>
              </div>
              <div>
                <div className='flex justify-between items-center mbe-2'>
                  <Typography>Storage</Typography>
                  <Typography>1.2 GB / 2 GB</Typography>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-warning h-2 rounded-full' style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CurrentPlan
