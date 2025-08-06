
'use client'

import { Card, CardContent, Typography } from '@mui/material'

const UpdateApp = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Update App
        </Typography>
        <Typography variant="body1">
          App update configuration will go here.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default UpdateApp
