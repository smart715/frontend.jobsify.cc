'use client'

// React Imports
import { useState, useEffect, forwardRef } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

// Third-party Imports
import { IMaskInput } from 'react-imask'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Utils Imports
import { getInitials } from '@/utils/getInitials'

// Toast Imports
import toast from 'react-hot-toast'

// Custom Phone Input Component
const PhoneNumberInput = forwardRef((props, ref) => {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})

PhoneNumberInput.displayName = 'PhoneNumberInput'

const initialData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  company: '',
  status: 'Active',
  notes: '',
  salutation: '',
  country: 'United States',
  gender: 'Male',
  language: 'English',
  category: '',
  subCategory: '',
  loginAllowed: false,
  receiveNotifications: false,
  officialWebsite: '',
  taxName: '',
  gstNumber: '',
  officePhone: '',
  postalCode: '',
  companyAddress: '',
  shippingAddress: ''
}

const AddClientDrawer = ({ open, handleClose, clientData, updateData }) => {
  // States
  const [formData, setFormData] = useState(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set form data when editing
  useEffect(() => {
    if (clientData) {
      setFormData({ ...initialData, ...clientData })
    } else {
      setFormData(initialData)
    }
  }, [clientData])

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form data
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0]
      toast.error(firstError)
      setIsSubmitting(false)

      return
    }

    try {
      const url = clientData ? `/api/clients/${clientData.id}` : '/api/clients'
      const method = clientData ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const savedClient = await response.json()
        updateData(savedClient)
        handleClose()
        setFormData(initialData)
        
        // Show appropriate success message
        if (savedClient.user && formData.loginAllowed) {
          toast.success(`Client ${clientData ? 'updated' : 'created'} successfully! User account created for login access.`)
        } else {
          toast.success(savedClient.message || `Client ${clientData ? 'updated' : 'created'} successfully!`)
        }
      } else {
        const errorData = await response.json()

        if (response.status === 409 && errorData.field === 'email') {
          toast.error('A client with this email already exists. Please use a different email.')
        } else if (response.status === 409) {
          toast.error(errorData.error || 'Client already exists with this information.')
        } else if (response.status === 401) {
          toast.error('You are not authorized to perform this action.')
        } else {
          toast.error(errorData.error || 'Failed to save client. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error saving client:', error)
      toast.error('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData(clientData || initialData)
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required'
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (formData.loginAllowed && !formData.email?.trim()) {
      errors.email = 'Email is required when login is allowed'
    }

    return errors
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600, md: 800 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{clientData ? 'Edit Client' : 'Add Client'}</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit}>
          {/* Account Details Section */}
          <Card className='mb-6'>
            <CardContent>
              <Typography variant='h6' className='mb-4'>
                Account Details
              </Typography>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Salutation</InputLabel>
                    <Select
                      value={formData.salutation}
                      label='Salutation'
                      onChange={e => handleFormChange('salutation', e.target.value)}
                    >
                      <MenuItem value='Mr.'>Mr.</MenuItem>
                      <MenuItem value='Mrs.'>Mrs.</MenuItem>
                      <MenuItem value='Ms.'>Ms.</MenuItem>
                      <MenuItem value='Dr.'>Dr.</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label='Client Name *'
                    value={formData.firstName}
                    onChange={e => handleFormChange('firstName', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label='Last Name'
                    value={formData.lastName}
                    onChange={e => handleFormChange('lastName', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='Email'
                    type='email'
                    value={formData.email}
                    onChange={e => handleFormChange('email', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 80, height: 80 }}>
                      <i className='ri-upload-cloud-line text-2xl' />
                    </Avatar>
                    <Button variant='outlined' component='label'>
                      Choose a file
                      <input type='file' hidden accept='image/*' />
                    </Button>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={formData.country}
                      label='Country'
                      onChange={e => handleFormChange('country', e.target.value)}
                    >
                      <MenuItem value='United States'>United States</MenuItem>
                      <MenuItem value='United Kingdom'>United Kingdom</MenuItem>
                      <MenuItem value='Canada'>Canada</MenuItem>
                      <MenuItem value='Australia'>Australia</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    label='Mobile'
                    value={formData.phone}
                    onChange={e => handleFormChange('phone', e.target.value)}
                    InputProps={{
                      inputComponent: PhoneNumberInput,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl>
                    <Typography variant='body2' className='mb-2'>Gender</Typography>
                    <RadioGroup
                      row
                      value={formData.gender}
                      onChange={e => handleFormChange('gender', e.target.value)}
                    >
                      <FormControlLabel value='Male' control={<Radio />} label='Male' />
                      <FormControlLabel value='Female' control={<Radio />} label='Female' />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Change Language</InputLabel>
                    <Select
                      value={formData.language}
                      label='Change Language'
                      onChange={e => handleFormChange('language', e.target.value)}
                    >
                      <MenuItem value='English'>English</MenuItem>
                      <MenuItem value='Spanish'>Spanish</MenuItem>
                      <MenuItem value='French'>French</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Client Category</InputLabel>
                    <Select
                      value={formData.category}
                      label='Client Category'
                      onChange={e => handleFormChange('category', e.target.value)}
                    >
                      <MenuItem value='Premium'>Premium</MenuItem>
                      <MenuItem value='Standard'>Standard</MenuItem>
                      <MenuItem value='Basic'>Basic</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Client Sub Category</InputLabel>
                    <Select
                      value={formData.subCategory}
                      label='Client Sub Category'
                      onChange={e => handleFormChange('subCategory', e.target.value)}
                    >
                      <MenuItem value='VIP'>VIP</MenuItem>
                      <MenuItem value='Regular'>Regular</MenuItem>
                      <MenuItem value='New'>New</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl>
                    <Typography variant='body2' className='mb-2'>Login Allowed?</Typography>
                    <RadioGroup
                      row
                      value={formData.loginAllowed}
                      onChange={e => handleFormChange('loginAllowed', e.target.value === 'true')}
                    >
                      <FormControlLabel value={true} control={<Radio />} label='Yes' />
                      <FormControlLabel value={false} control={<Radio />} label='No' />
                    </RadioGroup>
                    {formData.loginAllowed && (
                      <Typography variant='caption' color='primary' className='mt-1'>
                        A user account will be created for this client with their email address.
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl>
                    <Typography variant='body2' className='mb-2'>Receive email notifications?</Typography>
                    <RadioGroup
                      row
                      value={formData.receiveNotifications}
                      onChange={e => handleFormChange('receiveNotifications', e.target.value === 'true')}
                    >
                      <FormControlLabel value={true} control={<Radio />} label='Yes' />
                      <FormControlLabel value={false} control={<Radio />} label='No' />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Company Details Section */}
          <Card>
            <CardContent>
              <Typography variant='h6' className='mb-4'>
                Company Details
              </Typography>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='Company Name'
                    value={formData.company}
                    onChange={e => handleFormChange('company', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='Official Website'
                    value={formData.officialWebsite}
                    onChange={e => handleFormChange('officialWebsite', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='Tax Name'
                    value={formData.taxName}
                    onChange={e => handleFormChange('taxName', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='GST/VAT Number'
                    value={formData.gstNumber}
                    onChange={e => handleFormChange('gstNumber', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='Office Phone Number'
                    value={formData.officePhone}
                    onChange={e => handleFormChange('officePhone', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='City'
                    value={formData.city}
                    onChange={e => handleFormChange('city', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='State'
                    value={formData.state}
                    onChange={e => handleFormChange('state', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label='Postal code'
                    value={formData.postalCode}
                    onChange={e => handleFormChange('postalCode', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label='Company Address'
                    value={formData.companyAddress}
                    onChange={e => handleFormChange('companyAddress', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label='Shipping Address'
                    value={formData.shippingAddress}
                    onChange={e => handleFormChange('shippingAddress', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label='Note'
                    value={formData.notes}
                    onChange={e => handleFormChange('notes', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <div className='flex items-center gap-4 mt-6'>
            <Button variant='contained' type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button variant='outlined' type='button' onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddClientDrawer