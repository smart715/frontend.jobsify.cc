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
  Collapse,
  Paper
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

const AddSupportTicketDrawer = ({ open, handleClose, setData, onAddTicket }) => {
  const [showOtherDetails, setShowOtherDetails] = useState(false)
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      requestedForCompany: '',
      ticketSubject: '',
      description: '',
      priority: 'Medium',
      category: 'General',
      attachments: []
    }
  })

  // Fetch companies when drawer opens
  useEffect(() => {
    if (open) {
      const fetchCompanies = async () => {
        setLoading(true)
        try {
          const response = await fetch('/api/companies')
          if (response.ok) {
            const companiesData = await response.json()
            setCompanies(companiesData)
          }
        } catch (error) {
          console.error('Error fetching companies:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchCompanies()
    }
  }, [open])

  const handleFormSubmit = async (data) => {
    try {
      // Find the selected company's ID
      const selectedCompany = companies.find(company => company.companyName === data.requestedForCompany)
      
      const ticketData = {
        ...data,
        companyId: selectedCompany?.id || null,
        requesterName: 'System User', // You can modify this based on your auth system
        requesterEmail: 'system@example.com' // You can modify this based on your auth system
      }

      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
      })

      if (response.ok) {
        const newTicket = await response.json()

        // Update the data state with the new ticket
        if (onAddTicket) {
          onAddTicket(newTicket)
        } else if (setData) {
          setData(prevData => [newTicket, ...prevData])
        }

        // Reset form and close drawer
        reset()
        handleClose()

        // Show success message (you can add a toast notification here)
        console.log('Support ticket created successfully:', newTicket)
      } else {
        console.error('Failed to create support ticket')
      }
    } catch (error) {
      console.error('Error creating support ticket:', error)
    }
  }

  const handleDrawerClose = () => {
    handleClose()
    reset()
    setShowOtherDetails(false)
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
            Create Ticket
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
                        placeholder="Search For A Company"
                        disabled={loading}
                      >
                        <MenuItem value="">
                          <em>{loading ? 'Loading companies...' : 'Search For A Company'}</em>
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
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          minHeight: 150,
                          backgroundColor: 'background.paper'
                        }}
                      >
                        {/* Toolbar */}
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            mb: 2,
                            pb: 1,
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select defaultValue="Normal" variant="standard" disableUnderline>
                              <MenuItem value="Normal">Normal</MenuItem>
                              <MenuItem value="Heading">Heading</MenuItem>
                            </Select>
                          </FormControl>
                          <Divider orientation="vertical" flexItem />
                          <IconButton size="small">
                            <i className="ri-list-unordered" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-list-ordered" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-indent-decrease" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-indent-increase" />
                          </IconButton>
                          <Divider orientation="vertical" flexItem />
                          <IconButton size="small">
                            <i className="ri-bold" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-italic" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-underline" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-strikethrough" />
                          </IconButton>
                          <Divider orientation="vertical" flexItem />
                          <IconButton size="small">
                            <i className="ri-image-line" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-table-line" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-code-line" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-font-color" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-text-formatting" />
                          </IconButton>
                          <IconButton size="small">
                            <i className="ri-font-size" />
                          </IconButton>
                        </Box>
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={4}
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                          placeholder="Enter description here..."
                          error={!!errors.description}
                        />
                      </Paper>
                      {errors.description && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.description.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />

                {/* Upload File */}
                <Box>
                  <Button
                    variant="text"
                    startIcon={<i className="ri-attachment-line" />}
                    sx={{ color: 'primary.main' }}
                  >
                    Upload File
                  </Button>
                </Box>
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
                Save
              </Button>
            </Stack>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default AddSupportTicketDrawer