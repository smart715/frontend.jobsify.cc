
'use client'

import { useState } from 'react'
import { Card, CardContent, Typography, Button, Box } from '@mui/material'
import SupportTicketList from '@/views/support/list'

const SupportPage = () => {
  return (
    <div>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Support Tickets
            </Typography>
          </Box>
          <SupportTicketList />
        </CardContent>
      </Card>
    </div>
  )
}

export default SupportPage
