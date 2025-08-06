
'use client'

import { Card, CardContent, Typography } from '@mui/material'

const StorageSettings = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Storage Settings
        </Typography>
        <Typography variant="body1">
          Storage settings configuration will go here.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default StorageSettings
