
'use client'

import { useState, useEffect } from 'react'
import {
  Drawer,
  Typography,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
  Divider,
  Paper,
  Chip
} from '@mui/material'

const ViewSupportTicketDrawer = ({ open, handleClose, ticketId }) => {
  const [ticketData, setTicketData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch ticket data when drawer opens
  useEffect(() => {
    if (open && ticketId) {
      const fetchTicketData = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/support/${ticketId}`)
          if (response.ok) {
            const data = await response.json()
            setTicketData(data)
          }
        } catch (error) {
          console.error('Error fetching ticket data:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchTicketData()
    }
  }, [open, ticketId])

  const handleDrawerClose = () => {
    handleClose()
    setTicketData(null)
  }

  if (!ticketData && !loading) {
    return null
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleDrawerClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 500, md: 600 },
          backgroundColor: 'background.paper'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            View Ticket
          </Typography>
          <IconButton
            size="small"
            onClick={handleDrawerClose}
            sx={{ color: 'text.secondary' }}
          >
            <i className="ri-close-line text-xl" />
          </IconButton>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {loading ? (
          <Typography>Loading ticket details...</Typography>
        ) : ticketData ? (
          <Stack spacing={3}>
            {/* Ticket Details Section */}
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'background.default' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Ticket Details
              </Typography>

              <Stack spacing={3}>
                {/* Ticket Number */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Ticket Number
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {ticketData.ticketNumber}
                  </Typography>
                </Box>

                {/* Subject */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Subject
                  </Typography>
                  <Typography variant="body1">
                    {ticketData.subject}
                  </Typography>
                </Box>

                {/* Company */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Company
                  </Typography>
                  <Typography variant="body1">
                    {ticketData.companyName || 'N/A'}
                  </Typography>
                </Box>

                {/* Requester */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Requester
                  </Typography>
                  <Typography variant="body1">
                    {ticketData.requesterName}
                  </Typography>
                  {ticketData.requesterEmail && (
                    <Typography variant="body2" color="text.secondary">
                      {ticketData.requesterEmail}
                    </Typography>
                  )}
                </Box>

                {/* Status and Priority */}
                <Stack direction="row" spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Status
                    </Typography>
                    <Chip 
                      label={ticketData.status} 
                      color={
                        ticketData.status === 'Open' ? 'info' :
                        ticketData.status === 'In Progress' ? 'warning' :
                        ticketData.status === 'Resolved' ? 'success' : 'default'
                      }
                      variant="tonal" 
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Priority
                    </Typography>
                    <Chip 
                      label={ticketData.priority} 
                      color={
                        ticketData.priority === 'Low' ? 'success' :
                        ticketData.priority === 'Medium' ? 'warning' : 'error'
                      }
                      variant="tonal" 
                      size="small"
                    />
                  </Box>
                </Stack>

                {/* Category */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {ticketData.category}
                  </Typography>
                </Box>

                {/* Created Date */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Created Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(ticketData.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                {/* Description */}
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Description
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {ticketData.description}
                    </Typography>
                  </Paper>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        ) : (
          <Typography>No ticket data available</Typography>
        )}
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          p: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={handleDrawerClose}
            sx={{ minWidth: 100 }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Drawer>
  )
}

export default ViewSupportTicketDrawer
