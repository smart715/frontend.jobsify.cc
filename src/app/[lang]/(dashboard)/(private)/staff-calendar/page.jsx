
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import StaffCalendarView from '@views/staff-calendar'

const StaffCalendarPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <StaffCalendarView />
      </Grid>
    </Grid>
  )
}

export default StaffCalendarPage
