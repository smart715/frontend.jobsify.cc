'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import { Avatar, Divider, IconButton } from '@mui/material'

import Link from '@components/Link'


const Sidebar = ({ content }) => {
  // States
  const [expandedMeeting, setExpandedMeeting] = useState(false)

  const handleChange = () => () => {
    setExpandedMeeting(!expandedMeeting)
  }

  return (
    <Grid container>
      <Grid size={{ xs: 12}}>
        <Card>
          <CardHeader title='Meetings' />
          <CardContent>
            <Typography className='mbe-2 font-bold' color='text.primary'>Guest product consultation</Typography>
            <Typography className='mbe-2'>Thursday, May 22 at 9:00 AM EDT</Typography>
            <Button
              variant='outlined'
              className='border-primary w-full'
            >
              Prepare for meeting
            </Button>
            {
              expandedMeeting &&
              <div>
                <Divider className='my-5' />
                <Typography className='mbe-2'>Completed</Typography>
                <div>
                  <Typography variant='h5' className='mbe-2 text-primary'>Kickoff meeting</Typography>
                  <Typography className='mbe-2'>Monday, May 5 at 9:45 AM EDT</Typography>
                </div>
                <div>
                  <Typography variant='h5' className='mbe-2 text-primary'>Menu review meeting</Typography>
                  <Typography className='mbe-2'>Tuesday, May 20 at 9:30 AM EDT</Typography>
                </div>
              </div>
            }
            <Button className='text-primary w-full mt-5' onClick={handleChange()}>{ expandedMeeting ? 'View less' : 'View past meetings' }</Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12}} className='mt-5'>
        <Card>
          <CardHeader title='Your Toast Team' />
          <CardContent>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <Avatar
                  variant='circle'
                  className='bg-primaryLight text-primary'
                >
                  <i className='ri-star-smile-line' />
                </Avatar>
                <div className='ml-2'>
                  <Typography className='text-[12px]'>Thursday, May 22 at 9:00 AM EDT</Typography>
                  <Typography className='font-bold text-[14px]' color='text.primary'>Guest product consultation</Typography>
                </div>
              </div>
              <IconButton component={Link} size='small' href='#' target='_blank'>
                <i className='ri-mail-line text-lg' />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Sidebar
