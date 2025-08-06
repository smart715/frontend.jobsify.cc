'use client'

import { useState } from 'react'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import LinearProgress from '@mui/material/LinearProgress'

import Details from './Details'
import Sidebar from './Sidebar'


// Third-party Imports
import ReactPlayer from '@/libs/ReactPlayer'

const LinearProgressWithLabel = props => {
    return (
      <div className='gap-2'>
        <div className='is-full mb-2'>
          <LinearProgress variant='determinate' {...props} />
        </div>
        <div className='flex justify-between'>
            <Typography variant='body2'>{`Progress ${Math.round(props.value)}%`}</Typography>
            <div className='flex'>
                <Typography variant='body2 me-1'>Your go-live day is May 30, 2025!</Typography>
                <Typography className='text-primary'>Update</Typography>
            </div>
        </div>
      </div>
    )
  }
  
const CourseDetails = ({ data }) => {

    const [progress, setProgress] = useState(70)

    // useEffect(() => {
    //   const timer = setInterval(() => {
    //     setProgress(prevProgress => (prevProgress >= 100 ? 10 : prevProgress + 10))
    //   }, 800)
  
    //   return () => {
    //     clearInterval(timer)
    //   }
    // }, [])

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <div className='mb-4'>
                    <Typography variant='h5' fontWeight={700} marginBottom={5}>Welcome to the Jobsify Launchpad</Typography>
                    <Typography className='mbe-2 font-medium text-textPrimary'>Your all-in-one setup guide to get your business up and running.</Typography>
                    <Typography className='mbe-2 font-medium text-textPrimary'>From branding and services to client settings and automation—Launchpad will walk you through every step to fully configure your business inside Jobsify.</Typography>
                    <Typography className='mbe-2 font-medium text-textPrimary mt-2'>Let’s get started building your business foundation.</Typography>
                </div>
                <LinearProgressWithLabel value={progress} />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
                <Details data={data?.courseDetails} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <div className='sticky top-[88px]'>
                    <Sidebar content={data?.courseDetails.content} />
                </div>
            </Grid>
        </Grid>
    )
}

export default CourseDetails
