'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

import Details from './Details'
import CustomCalendar from './CustomCalendar'
import Sidebar from './Sidebar'
  


const LinearProgressWithLabel = props => {
    return (
      <div className='gap-2'>
        <div className='is-full mb-2'>
          <LinearProgress variant='determinate' {...props} />
        </div>
        {/* <div className='flex justify-between'>
            <Typography variant='body2'>{`Progress ${Math.round(props.value)}%`}</Typography>
            <div className='flex'>
                <Typography variant='body2 me-1'>Your go-live day is May 30, 2025!</Typography>
                <Typography className='text-primary'>Update</Typography>
            </div>
        </div> */}
      </div>
    )
  }
  

const DailyAssignments = ({ data }) => {
    const [progress, setProgress] = useState(70)

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <CustomCalendar content="" />
            </Grid>
            <Grid size={{ xs: 12 }}>
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

export default DailyAssignments
