
'use client'

import Grid from '@mui/material/Grid2'
import AppreciationList from '@/views/hr/appreciation/list'

const AppreciationPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <AppreciationList />
      </Grid>
    </Grid>
  )
}

export default AppreciationPage
