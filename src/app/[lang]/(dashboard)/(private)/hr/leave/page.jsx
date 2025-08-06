
'use client'

import Grid from '@mui/material/Grid2'
import LeaveList from '@/views/hr/leave/list'
import { getDictionary } from '@/utils/getDictionary'

const LeavePage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <LeaveList />
      </Grid>
    </Grid>
  )
}

export default LeavePage
