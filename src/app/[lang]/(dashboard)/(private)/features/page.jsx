
'use client'

import Grid from '@mui/material/Grid2'
import FeatureListTable from '@/views/features/list/FeatureListTable'

const FeaturesList = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <FeatureListTable tableData={[]} />
      </Grid>
    </Grid>
  )
}

export default FeaturesList
