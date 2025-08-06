'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import {
  Card, CardHeader, CardContent, Typography,
  Avatar, Divider, IconButton, TextField
} from '@mui/material'
import Grid from '@mui/material/Grid2'

import Link from '@components/Link'

const vehicles = [
  { title: 'Coupe', subtitle: 'Coupe 2 door' },
  { title: 'Sedan', subtitle: 'Sedan 4 door' },
  { title: 'Crossover', subtitle: 'Small SUV' },
  { title: 'SUV', subtitle: 'Large SUV' },
  { title: 'Pickup', subtitle: 'Pickup Truck 2 Door' },
  { title: 'CrewCab', subtitle: 'Pickup Truck 4 Door' },
  { title: 'Mini Van', subtitle: 'Mini Van' },
  { title: 'Van', subtitle: 'Passenger Van' }
]

const Sidebar = () => {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleToggle = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index))
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{xs: 12}}>
        <Card>
          <CardHeader title='Automotive' />
          <CardContent>
            {vehicles.map((vehicle, index) => (
              <div key={vehicle.title}>
                <div className='flex justify-between items-center mb-2'>
                  <div className='flex items-center'>
                    <Avatar variant='circle' className='bg-primaryLight text-primary'>
                      <i className='ri-star-smile-line' />
                    </Avatar>
                    <div className='ml-2'>
                      <Typography className='font-bold text-[14px]' color='text.primary'>
                        {vehicle.title}
                      </Typography>
                      <Typography className='text-[12px]'>
                        {vehicle.subtitle}
                      </Typography>
                    </div>
                  </div>
                  <IconButton size='small' onClick={() => handleToggle(index)}>
                    <i className={`ri-${expandedIndex === index ? 'arrow-up-s-line' : 'edit-line'} text-lg`} />
                  </IconButton>
                </div>

                {expandedIndex === index && (
                  <div className='flex items-center mb-4 ml-10 gap-2'>
                    <TextField
                      fullWidth
                      size='small'
                      label='Title'
                      defaultValue={vehicle.title}
                    />
                    <TextField
                      fullWidth
                      size='small'
                      label='Subtitle'
                      defaultValue={vehicle.subtitle}
                    />
                  </div>
                )}

                <Divider className='my-2' />
              </div>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Sidebar
