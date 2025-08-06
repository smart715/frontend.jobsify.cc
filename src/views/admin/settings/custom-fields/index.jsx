
'use client'

import { Card, CardContent, Typography } from '@mui/material'

const CustomFields = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Custom Fields
        </Typography>
        <Typography variant="body1">
          Custom fields configuration will go here.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default CustomFields
