'use client'

import { useState } from 'react'
import React from 'react'
import {
  Drawer,
  Typography,
  IconButton,
  Divider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Paper,
  Stack,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

import { getLeadSources } from '@/utils/leadUtils'
import { useGlobalSettings } from '@/hooks/useGlobalSettings'
import TrialGuard from '@/components/trial-status/TrialGuard'

const AddLeadDrawer = ({ open, handleClose, onSubmit, dictionary }) => {
  const [createDeal, setCreateDeal] = useState(false)
  const [expanded, setExpanded] = useState('panel1')
  const [employees, setEmployees] = useState([])
  const [companyData, setCompanyData] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { formatDate, formatCurrency, currency } = useGlobalSettings()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      salutation: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      source: 'Website',
      status: 'New',
      leadOwner: '',
      addedBy: '',
      image: '',
      // Deal fields
      dealName: '',
      pipeline: 'Sales Pipeline',
      dealStage: 'Generated',
      dealValue: '',
      currency: currency,
      closeDate: '',
      dealCategory: 'Best Case',
      dealAgent: '',
      products: '',
      dealWatcher: '',
      // Company details
      companyName: '',
      companyWebsite: '',
      companyPhone: '',
      companyAddress: '',
      companyCity: '',
      companyState: '',
      companyCountry: '',
      companyZip: '',
    },
  })

  const handleFormSubmit = (data) => {
    const leadData = {
      contactName: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      company: data.company,
      leadSource: data.source,
      leadOwner: data.leadOwner,
      status: data.status,
      notes: data.notes,
      companyId: data.companyId,
      image: data.image || null,
      createDeal,
      createdAt: formatDate(new Date()),
    }
    onSubmit(leadData)
    reset()
    setCreateDeal(false)
    setExpanded('panel1')
    setImagePreview(null)
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('leadId', 'temp')

      const response = await fetch('/api/upload/lead-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      
      // Set the image URL in the form
      setValue('image', result.imageUrl)
      
      // Set preview
      setImagePreview(result.imageUrl)
      
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '')

    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length >= 10) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    } else if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    } else {
      return phoneNumber
    }
  }

  // Fetch employees when component mounts
  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  // Fetch company data to prefill phone number
  const fetchCompanyData = async () => {
    try {
      const response = await fetch('/api/companies/56eb49d8-f73d-4b1c-bc49-35fa3fcf2b1a')
      if (response.ok) {
        const data = await response.json()
        setCompanyData(data)
        // Prefill phone number with company phone
        if (data.companyPhone) {
          setValue('phone', data.companyPhone)
        }
      }
    } catch (error) {
      console.error('Error fetching company data:', error)
    }
  }

  React.useEffect(() => {
    if (open) {
      fetchEmployees()
      fetchCompanyData()
    }
  }, [open])

  const handleDrawerClose = () => {
    handleClose()
    reset()
    setCreateDeal(false)
    setExpanded('panel1')
    setCompanyData(null)
    setImagePreview(null)
  }

  return (
    <TrialGuard companyId={companyData?.id}>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 600, md: 700 },
            backgroundColor: 'background.paper',
          },
        }}
      >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Add Lead Contact
            </Typography>
          </Box>
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
          <Box sx={{ p: 3, pb: 0 }}>
            {/* Lead Contact Information */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Contact Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* Profile Image Upload */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Profile Photo
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          border: '2px dashed',
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          backgroundColor: 'background.paper',
                        }}
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <i className="ri-user-line text-4xl text-gray-400" />
                        )}
                      </Box>
                      <Box>
                        <Button
                          variant="outlined"
                          component="label"
                          size="small"
                          disabled={uploading}
                          startIcon={uploading ? <i className="ri-loader-line animate-spin" /> : <i className="ri-upload-line" />}
                        >
                          {uploading ? 'Uploading...' : 'Upload Photo'}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </Button>
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                          Allowed JPG, PNG or GIF. Max size 2MB
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="salutation"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="medium">
                        <InputLabel>Salutation</InputLabel>
                        <Select {...field} label="Salutation">
                          <MenuItem value="Mr.">Mr.</MenuItem>
                          <MenuItem value="Ms.">Ms.</MenuItem>
                          <MenuItem value="Mrs.">Mrs.</MenuItem>
                          <MenuItem value="Dr.">Dr.</MenuItem>
                          <MenuItem value="Prof.">Prof.</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: 'First name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="First Name"
                        placeholder="Enter first name"
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        required
                        size="medium"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: 'Last name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Last Name"
                        placeholder="Enter last name"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        required
                        size="medium"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email Address"
                        placeholder="Enter email address"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        required
                        size="medium"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <i className="ri-mail-line text-lg" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <TextField
                        {...field}
                        value={value}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value)
                          onChange(formatted)
                        }}
                        fullWidth
                        label="Phone Number"
                        placeholder="(555) 123-4567"
                        size="medium"
                        inputProps={{
                          maxLength: 14, // (XXX) XXX-XXXX
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <i className="ri-phone-line text-lg" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="company"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Company"
                        placeholder="Enter company name"
                        size="medium"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <i className="ri-building-line text-lg" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Job Title"
                        placeholder="Enter job title"
                        size="medium"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Lead Details */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Lead Details
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="source"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="medium">
                        <InputLabel>Lead Source</InputLabel>
                        <Select {...field} label="Lead Source">
                          {getLeadSources().map((source) => (
                            <MenuItem key={source} value={source}>
                              {source}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="medium">
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          <MenuItem value="New">New</MenuItem>
                          <MenuItem value="Contacted">Contacted</MenuItem>
                          <MenuItem value="Qualified">Qualified</MenuItem>
                          <MenuItem value="Converted">Converted</MenuItem>
                          <MenuItem value="Lost">Lost</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="leadOwner"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth size="medium">
                        <InputLabel>Lead Owner</InputLabel>
                        <Select
                          {...field}
                          label="Lead Owner"
                          startAdornment={
                            <InputAdornment position="start">
                              <i className="ri-user-3-line text-lg" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="">
                            <em>Select Lead Owner</em>
                          </MenuItem>
                          {employees.map((employee) => (
                            <MenuItem
                              key={employee.id}
                              value={`${employee.firstName} ${employee.lastName || ''}`.trim()}
                            >
                              {`${employee.firstName} ${employee.lastName || ''}`.trim()}
                              {employee.designation && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ ml: 1 }}
                                >
                                  - {employee.designation}
                                </Typography>
                              )}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="addedBy"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Added By"
                        placeholder="Person who added this lead"
                        size="medium"
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Create Deal Option */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={createDeal}
                      onChange={(e) => setCreateDeal(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Create Deal
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Paper>

            {/* Deal Information - Only show if createDeal is true */}
            {createDeal && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  backgroundColor: 'primary.50',
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 0.5, color: 'primary.main' }}
                  >
                    <i className="ri-handshake-line mr-2" />
                    Deal Information
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="dealName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Deal Name"
                          placeholder="Enter deal name"
                          size="medium"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="pipeline"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="medium">
                          <InputLabel>Pipeline</InputLabel>
                          <Select {...field} label="Pipeline">
                            <MenuItem value="Sales Pipeline">
                              Sales Pipeline
                            </MenuItem>
                            <MenuItem value="Marketing Pipeline">
                              Marketing Pipeline
                            </MenuItem>
                            <MenuItem value="Support Pipeline">
                              Support Pipeline
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="dealStage"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="medium">
                          <InputLabel>Deal Stage</InputLabel>
                          <Select {...field} label="Deal Stage">
                            <MenuItem value="Generated">Generated</MenuItem>
                            <MenuItem value="Qualified">Qualified</MenuItem>
                            <MenuItem value="Proposal">Proposal</MenuItem>
                            <MenuItem value="Negotiation">Negotiation</MenuItem>
                            <MenuItem value="Closed Won">Closed Won</MenuItem>
                            <MenuItem value="Closed Lost">Closed Lost</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="dealValue"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Deal Value"
                          type="number"
                          placeholder="0.00"
                          size="medium"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Controller
                                  name="currency"
                                  control={control}
                                  render={({ field: currencyField }) => (
                                    <Select
                                      {...currencyField}
                                      variant="standard"
                                      disableUnderline
                                      sx={{ minWidth: 60 }}
                                    >
                                      <MenuItem value="USD">$</MenuItem>
                                      <MenuItem value="EUR">€</MenuItem>
                                      <MenuItem value="GBP">£</MenuItem>
                                    </Select>
                                  )}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="closeDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Expected Close Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          size="medium"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="dealCategory"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="medium">
                          <InputLabel>Deal Category</InputLabel>
                          <Select {...field} label="Deal Category">
                            <MenuItem value="Best Case">Best Case</MenuItem>
                            <MenuItem value="Commit">Commit</MenuItem>
                            <MenuItem value="Upside">Upside</MenuItem>
                            <MenuItem value="Omitted">Omitted</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Box>

          {/* Footer Actions */}
          <Box
            sx={{
              p: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              position: 'sticky',
              bottom: 0,
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDrawerClose}
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                startIcon={<i className="ri-save-line" />}
                sx={{ minWidth: 120 }}
              >
                Save Lead
              </Button>
            </Stack>
          </Box>
        </form>
      </Box>
    </Drawer>
    </TrialGuard>
  )
}

export default AddLeadDrawer
