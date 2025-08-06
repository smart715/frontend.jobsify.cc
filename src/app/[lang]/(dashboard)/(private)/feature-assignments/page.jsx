
'use client'

import Grid from '@mui/material/Grid2'
import FeatureAssignmentManager from '@/views/feature-assignments/FeatureAssignmentManager'

const FeatureAssignmentsPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <FeatureAssignmentManager />
      </Grid>
    </Grid>
  )
}

export default FeatureAssignmentsPage
