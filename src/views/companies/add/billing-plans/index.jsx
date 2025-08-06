
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

const BillingPlansTab = () => {
  const [selectedPlan] = useState({
    name: 'Basic Package',
    price: '$29.99',
    status: 'Selected',
    features: ['Basic Scheduling', 'Customer Management', 'Basic Reporting']
  })

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Card>
          <CardHeader title='Selected Plan' />
          <CardContent>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <Typography variant='h6'>{selectedPlan.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Monthly subscription
                  </Typography>
                </div>
                <div className='text-right'>
                  <Typography variant='h5'>{selectedPlan.price}</Typography>
                  <Chip label={selectedPlan.status} color='info' size='small' />
                </div>
              </div>
              
              <div>
                <Typography variant='subtitle2' className='mb-2'>Features included:</Typography>
                <ul className='list-disc pl-4'>
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index}>
                      <Typography variant='body2'>{feature}</Typography>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='flex gap-4 mt-4'>
                <Button variant='outlined'>
                  Change Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Card>
          <CardHeader title='Payment Setup' />
          <CardContent>
            <div className='flex flex-col gap-4'>
              <Typography variant='body2' color='text.secondary'>
                Payment method will be configured after company creation
              </Typography>
              <Typography variant='body2' color='info.main'>
                You can add payment methods later in the billing section
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default BillingPlansTab
