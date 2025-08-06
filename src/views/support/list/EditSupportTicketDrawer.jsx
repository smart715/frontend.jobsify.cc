
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
  Collapse
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

const EditSupportTicketDrawer = ({ open, handleClose, ticketId, setData, setFilteredData }) => {
  const [showOtherDetails, setShowOtherDetails] = useState(false)
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [ticketData, setTicketData] = useState(null)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      requestedForCompany: '',
      ticketSubject: '',
      description: '',
      priority: 'Medium',
      category: 'General',
      status: 'Open'
    }
  })

  // Fetch ticket data and companies when drawer opens
  useEffect(() => {
    if (open && ticketId) {
      const fetchData = async () => {
        setLoading(true)
        try {
          // Fetch ticket data
          const ticketResponse = await fetch(`/api/support/${ticketId}`)
          if (ticketResponse.ok) {
            const ticket = await ticketResponse.json()
            setTicketData(ticket)
            
            // Set form values
            setValue('requestedForCompany', ticket.companyName || '')
            setValue('ticketSubject', ticket.subject || '')
            setValue('description', ticket.description || '')
            setValue('priority', ticket.priority || 'Medium')
            setValue('category', ticket.category || 'General')
            setValue('status', ticket.status || 'Open')
          }

          // Fetch companies
          const companiesResponse = await fetch('/api/companies')
          if (companiesResponse.ok) {
            const companiesData = await companiesResponse.json()
            setCompanies(companiesData)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [open, ticketId, setValue])

  const handleFormSubmit = async (data) => {
    try {
      // Find the selected company's ID
      const selectedCompany = companies.find(company => company.companyName === data.requestedForCompany)
      
      const updateData = {
        subject: data.ticketSubject,
        description: data.description,
        priority: data.priority,
        category: data.category,
        status: data.status,
        companyId: selectedCompany?.id || ticketData?.companyId,
        companyName: data.requestedForCompany
      }

      const response = await fetch(`/api/support/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const updatedTicket = await response.json()

        // Update the data state with the updated ticket
        if (setData) {
          setData(prevData => 
            prevData.map(ticket => 
              ticket.id === ticketId ? updatedTicket : ticket
            )
          )
        }
        
        if (setFilteredData) {
          setFilteredData(prevData => 
            prevData.map(ticket => 
              ticket.id === ticketId ? updatedTicket : ticket
            )
          )
        }

        // Reset form and close drawer
        handleDrawerClose()

        // Show success message (you can add a toast notification here)
        console.log('Support ticket updated successfully:', updatedTicket)
      } else {
        console.error('Failed to update support ticket')
      }
    } catch (error) {
      console.error('Error updating support ticket:', error)
    }
  }

  const handleDrawerClose = () => {
    handleClose()
    reset()
    setShowOtherDetails(false)
    setTicketData(null)
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
            Edit Ticket
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
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ p: 3 }}>
            <Typography>Loading ticket data...</Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="h-full">
            <Box sx={{ p: 3 }}>
              {/* Ticket Details Section */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'background.default' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Ticket Details
                </Typography>

                <Stack spacing={3}>
                  {/* Requested for Company */}
                  <Controller
                    name="requestedForCompany"
                    control={control}
                    rules={{ required: 'Company is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.requestedForCompany}>
                        <InputLabel>Requested for Company *</InputLabel>
                        <Select
                          {...field}
                          label="Requested for Company *"
                          disabled={loading}
                        >
                          <MenuItem value="">
                            <em>{loading ? 'Loading companies...' : 'Select a Company'}</em>
                          </MenuItem>
                          {companies.map((company) => (
                            <MenuItem key={company.id} value={company.companyName}>
                              {company.companyName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.requestedForCompany && (
                          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                            {errors.requestedForCompany.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />

                  {/* Ticket Subject */}
                  <Controller
                    name="ticketSubject"
                    control={control}
                    rules={{ required: 'Ticket subject is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Ticket Subject *"
                        placeholder="Enter ticket subject"
                        error={!!errors.ticketSubject}
                        helperText={errors.ticketSubject?.message}
                      />
                    )}
                  />

                  {/* Status */}
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          <MenuItem value="Open">Open</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Resolved">Resolved</MenuItem>
                          <MenuItem value="Closed">Closed</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />

                  {/* Description */}
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'Description is required' }}
                    render={({ field }) => (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Description *
                        </Typography>
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={4}
                          variant="outlined"
                          placeholder="Enter description here..."
                          error={!!errors.description}
                          helperText={errors.description?.message}
                        />
                      </Box>
                    )}
                  />
                </Stack>
              </Paper>

              {/* Other Details Section */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="text"
                  startIcon={<i className={`ri-arrow-${showOtherDetails ? 'down' : 'right'}-s-line`} />}
                  onClick={() => setShowOtherDetails(!showOtherDetails)}
                  sx={{ color: 'text.primary', fontWeight: 600 }}
                >
                  Other Details
                </Button>
                <Collapse in={showOtherDetails}>
                  <Paper elevation={0} sx={{ p: 3, mt: 2, backgroundColor: 'background.default' }}>
                    <Stack spacing={3}>
                      <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Priority</InputLabel>
                            <Select {...field} label="Priority">
                              <MenuItem value="Low">Low</MenuItem>
                              <MenuItem value="Medium">Medium</MenuItem>
                              <MenuItem value="High">High</MenuItem>
                              <MenuItem value="Critical">Critical</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />

                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select {...field} label="Category">
                              <MenuItem value="General">General</MenuItem>
                              <MenuItem value="Technical">Technical</MenuItem>
                              <MenuItem value="Billing">Billing</MenuItem>
                              <MenuItem value="Feature Request">Feature Request</MenuItem>
                              <MenuItem value="Bug Report">Bug Report</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Stack>
                  </Paper>
                </Collapse>
              </Box>
            </Box>

            {/* Footer Actions */}
            <Box
              sx={{
                p: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                position: 'sticky',
                bottom: 0
              }}
            >
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleDrawerClose}
                  sx={{ minWidth: 100 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<i className="ri-save-line" />}
                  sx={{ minWidth: 100 }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          </form>
        )}
      </Box>
    </Drawer>
  )
}

export default EditSupportTicketDrawer
