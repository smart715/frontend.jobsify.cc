'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Switch from '@mui/material/Switch'
import { Avatar, Divider, IconButton } from '@mui/material'

import Link from '@components/Link'


const Sidebar = ({ content }) => {
  // States
  const [expandedMeeting, setExpandedMeeting] = useState(false)

  const handleChange = () => () => {
    setExpandedMeeting(!expandedMeeting)
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12}}>
        <Card>
          <CardHeader title='Customer Notifications' />
          <CardContent>
            <div className='flex items-center'>
              <Switch />
              <Typography variant='body2'>Send E-Mail Messages</Typography>
            </div>
            <div className='flex items-center'>
              <Switch />
              <Typography variant='body2'>Send SMS Messages</Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12}}>
        <Card>
          <CardHeader title='Reply-To E-Mail Address' />
          <CardContent>
            <div className='flex items-center'>
              <Typography variant='body2'>nslsolutions123@gmail.com</Typography>
            </div>
            <div className='flex justify-end  items-center'>
              <Typography variant='body2' className='text-primary'>Edit</Typography><i className='ri-settings-3-line text-primary' />
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12}}>
        <Card>
          <CardHeader title='Delivery Window' />
          <CardContent>
            <div className='flex items-center'>
              <Typography variant='body2'>08:00 AM - 05:00 PM</Typography>
            </div>
            <div className='flex justify-end  items-center'>
              <Typography variant='body2' className='text-primary'>Edit</Typography><i className='ri-settings-3-line text-primary' />
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12}}>
        <Card>
          <CardHeader title='Appointment Reminder' />
          <CardContent>
            <div className='flex items-center'>
              <Typography variant='body2'>24 hours before appointment</Typography>
            </div>
            <div className='flex justify-end  items-center'>
              <Typography variant='body2' className='text-primary'>Edit</Typography><i className='ri-settings-3-line text-primary' />
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Sidebar
