'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Autocomplete from '@mui/material/Autocomplete'

// Google Maps Imports
import { useJsApiLoader, Autocomplete as GoogleAutocomplete } from '@react-google-maps/api'

// Utils Imports
import { generateEmployeeId } from '@/utils/employeeUtils'
import { showErrorToast, showSuccessToast } from '@/utils/toast'

const libraries = ['places']

// Phone formatting
const formatPhoneNumber = (value) => {
  if (!value) return value
  const phoneNumber = value.replace(/[^\d]/g, '')
  const phoneNumberLength = phoneNumber.length
  if (phoneNumberLength < 4) return phoneNumber
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

const AddEmployeeDrawer = ({ open, handleClose, onEmployeeAdded, embedded = false }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    dateOfJoining: null,
    dateOfBirth: null,
    gender: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    emergencyFirstName: '',
    emergencyLastName: '',
    emergencyContactPhone: '',
    salary: '',
    status: 'Active',
    employeeType: 'Full-time',
    reportingManager: '',
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autocomplete, setAutocomplete] = useState(null)
  const autocompleteRef = useRef(null)
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  })

  useEffect(() => {
    if (open) {
      generateEmployeeId().then(id => {
        setFormData(prev => ({ ...prev, employeeId: id }))
      })

      // Fetch employees for reporting manager dropdown
      fetch('/api/employees')
        .then(response => response.json())
        .then(data => {
          if (data.employees) {
            setEmployees(data.employees.map(emp => ({
              value: emp.id,
              label: `${emp.firstName} ${emp.lastName} (${emp.employeeId})`
            })))
          }
        })
        .catch(error => {
          console.error('Error fetching employees:', error)
        })

      // Fetch departments
      fetch('/api/departments')
        .then(response => response.json())
        .then(data => {
          setDepartments(data.departments || [])
        })
        .catch(error => {
          console.error('Error fetching departments:', error)
        })

      // Fetch designations
      fetch('/api/designations')
        .then(response => response.json())
        .then(data => {
          setDesignations(data.designations || [])
        })
        .catch(error => {
          console.error('Error fetching designations:', error)
        })
    }
  }, [open])

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }


  const handlePhoneChange = (field, value) => {
    const formattedPhone = formatPhoneNumber(value)
    handleFormChange(field, formattedPhone)
  }

  const getAddressComponent = (addressComponents, type, useShortName = false) => {
    const component = addressComponents.find(component =>
      component.types.includes(type)
    )
    return component
      ? useShortName
        ? component.short_name
        : component.long_name
      : ''
  }

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance)
  }

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()

      if (place.address_components) {
        const streetNumber = getAddressComponent(place.address_components, 'street_number')
        const route = getAddressComponent(place.address_components, 'route')
        let streetAddress = place.name

        if (streetNumber && route) {
          streetAddress = `${streetNumber} ${route}`
        } else if (route) {
          streetAddress = route
        } else if (place.name) {
          streetAddress = place.name
        }

        const city = getAddressComponent(place.address_components, 'locality')
        const state = getAddressComponent(place.address_components, 'administrative_area_level_1', true)
        const zipCode = getAddressComponent(place.address_components, 'postal_code')
        const country = getAddressComponent(place.address_components, 'country')

        setFormData(prevFormData => ({
          ...prevFormData,
          address: streetAddress,
          city: city,
          state: state,
          postalCode: zipCode,
          country: country
        }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        showSuccessToast('Employee added successfully')
        setFormData({
          employeeId: '',
          salutation: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          department: '',
          designation: '',
          dateOfJoining: null,
          dateOfBirth: null,
          gender: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          emergencyFirstName: '',
          emergencyLastName: '',
          emergencyContactPhone: '',
          salary: '',
          status: 'Active',
          employeeType: 'Full-time',
          reportingManager: '',
          notes: ''
        })
        onEmployeeAdded?.()
      } else {
        const error = await response.json()
        showErrorToast(error.message || 'Failed to add employee')
      }
    } catch (error) {
      console.error('Error adding employee:', error)
      showErrorToast('Failed to add employee')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderContent = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <Card>
          <CardContent>
            <Typography variant='h5' className='mbe-6'>
              Basic Information
            </Typography>
            <Grid container spacing={6}>
              {/* Employee ID, Salutation, First Name, Last Name in one row */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label='Employee ID'
                  value={formData.employeeId}
                  disabled
                  helperText='Auto-generated'
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Salutation</InputLabel>
                  <Select
                    value={formData.salutation}
                    label='Salutation'
                    onChange={e => handleFormChange('salutation', e.target.value)}
                  >
                    <MenuItem value='Mr.'>Mr.</MenuItem>
                    <MenuItem value='Ms.'>Ms.</MenuItem>
                    <MenuItem value='Mrs.'>Mrs.</MenuItem>
                    <MenuItem value='Dr.'>Dr.</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label='First Name *'
                  value={formData.firstName}
                  onChange={e => handleFormChange('firstName', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label='Last Name'
                  value={formData.lastName}
                  onChange={e => handleFormChange('lastName', e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label='Email *'
                  type='email'
                  value={formData.email}
                  onChange={e => handleFormChange('email', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label='Phone'
                  value={formData.phone}
                  onChange={e => handlePhoneChange('phone', e.target.value)}
                  placeholder='(123) 456-7890'
                  inputProps={{ maxLength: 14 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DatePicker
                  label='Date of Birth'
                  value={formData.dateOfBirth}
                  onChange={(date) => handleFormChange('dateOfBirth', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl>
                  <Typography variant='body2' className='mb-2'>Gender</Typography>
                  <RadioGroup
                    row
                    value={formData.gender}
                    onChange={e => handleFormChange('gender', e.target.value)}
                  >
                    <FormControlLabel value='Male' control={<Radio />} label='Male' />
                    <FormControlLabel value='Female' control={<Radio />} label='Female' />
                    <FormControlLabel value='Other' control={<Radio />} label='Other' />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant='h5' className='mbe-6'>
              Employment Details
            </Typography>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formData.department}
                    label='Department'
                    onChange={e => handleFormChange('department', e.target.value)}
                  >
                    {departments.map(dept => (
                      <MenuItem key={dept.id} value={dept.name}>{dept.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Designation</InputLabel>
                  <Select
                    value={formData.designation}
                    label='Designation'
                    onChange={e => handleFormChange('designation', e.target.value)}
                  >
                    {designations.map(designation => (
                      <MenuItem key={designation.id} value={designation.name}>{designation.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DatePicker
                  label='Date of Joining *'
                  value={formData.dateOfJoining}
                  onChange={(date) => handleFormChange('dateOfJoining', date)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Employee Type</InputLabel>
                  <Select
                    value={formData.employeeType}
                    label='Employee Type'
                    onChange={e => handleFormChange('employeeType', e.target.value)}
                  >
                    <MenuItem value='Full-time'>Full-time</MenuItem>
                    <MenuItem value='Part-time'>Part-time</MenuItem>
                    <MenuItem value='Contract'>Contract</MenuItem>
                    <MenuItem value='Intern'>Intern</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label='Status'
                    onChange={e => handleFormChange('status', e.target.value)}
                  >
                    <MenuItem value='Active'>Active</MenuItem>
                    <MenuItem value='Inactive'>Inactive</MenuItem>
                    <MenuItem value='Terminated'>Terminated</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label='Salary'
                  type='number'
                  value={formData.salary}
                  onChange={e => handleFormChange('salary', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Autocomplete
                  options={employees}
                  value={employees.find(emp => emp.value === formData.reportingManager) || null}
                  onChange={(event, newValue) => {
                    handleFormChange('reportingManager', newValue ? newValue.value : '')
                  }}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Reporting Manager'
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant='h5' className='mbe-6'>
              Address Information
            </Typography>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                {isLoaded ? (
                  <GoogleAutocomplete
                    onLoad={onLoad}
                    onPlaceChanged={handlePlaceChanged}
                    options={{
                      types: ['address'],
                      fields: ['address_components', 'geometry', 'name'],
                      componentRestrictions: { country: 'us' }
                    }}
                  >
                    <TextField
                      fullWidth
                      label='Address'
                      value={formData.address}
                      onChange={e => handleFormChange('address', e.target.value)}
                      placeholder='Start typing your address...'
                    />
                  </GoogleAutocomplete>
                ) : (
                  <TextField
                    fullWidth
                    label='Address'
                    value={formData.address}
                    onChange={e => handleFormChange('address', e.target.value)}
                    placeholder='Loading Google Maps...'
                  />
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label='City'
                  value={formData.city}
                  onChange={e => handleFormChange('city', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label='State'
                  value={formData.state}
                  onChange={e => handleFormChange('state', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label='Postal Code'
                  value={formData.postalCode}
                  onChange={e => handleFormChange('postalCode', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  label='Country'
                  value={formData.country}
                  onChange={e => handleFormChange('country', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant='h5' className='mbe-6'>
              Emergency Contact
            </Typography>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label='Emergency First Name'
                  value={formData.emergencyFirstName}
                  onChange={e => handleFormChange('emergencyFirstName', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label='Emergency Last Name'
                  value={formData.emergencyLastName}
                  onChange={e => handleFormChange('emergencyLastName', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label='Emergency Contact Phone'
                  value={formData.emergencyContactPhone}
                  onChange={e => handlePhoneChange('emergencyContactPhone', e.target.value)}
                  placeholder='(123) 456-7890'
                  inputProps={{ maxLength: 14 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant='h5' className='mbe-6'>
              Additional Information
            </Typography>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label='Notes'
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={e => handleFormChange('notes', e.target.value)}
                  placeholder='Any additional notes about the employee...'
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <div className='flex items-center gap-4'>
          <Button
            variant='contained'
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Employee...' : 'Add Employee'}
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            type='reset'
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </LocalizationProvider>
  )

  if (embedded) {
    return renderContent()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-6 plb-5'>
        <Typography variant='h5'>Add New Employee</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-6'>
        {renderContent()}
      </div>
    </Drawer>
  )
}

export default AddEmployeeDrawer