
'use client'

import { useSession } from 'next-auth/react'
import { Alert, Box, Typography, Collapse } from '@mui/material'
import { useState } from 'react'

const SessionDebug = () => {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
      <Alert 
        severity="info" 
        onClick={() => setOpen(!open)}
        sx={{ cursor: 'pointer', mb: 1 }}
      >
        Session Debug (Click to {open ? 'hide' : 'show'})
      </Alert>
      <Collapse in={open}>
        <Box sx={{ 
          backgroundColor: 'background.paper', 
          border: 1, 
          borderColor: 'divider', 
          p: 2, 
          borderRadius: 1,
          maxWidth: 400,
          maxHeight: 300,
          overflow: 'auto'
        }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Session:
          </Typography>
          <pre style={{ fontSize: '12px', margin: 0 }}>
            {JSON.stringify(session, null, 2)}
          </pre>
        </Box>
      </Collapse>
    </Box>
  )
}

export default SessionDebug
