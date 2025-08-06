'use client'

// React Imports
import { forwardRef, useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'

// MUI Imports
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { IMaskInput } from 'react-imask'

// Utils Imports
import { showSuccessToast, showErrorToast, showLoadingToast, updateToast } from '@/utils/toast'
import { generateCustomerId } from '@/utils/customerUtils'

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
  customerId: '',
  salutation: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  mobile: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  company: '',
  companyAddress: '',
  status: 'Active',
  notes: '',
  gender: 'Male',
  language: 'English',
  loginAllowed: false,
  receiveNotifications: false,
  officialWebsite: '',
  taxName: '',
  officePhone: '',
}

const CustomerAccountDetails = ({ activeStep, handleNext, handlePrev, steps }) => {
  // States
  const [formData, setFormData] = useState({ ...initialData })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerIdGenerated, setCustomerIdGenerated] = useState(false)
  const router = useRouter()
  const [autocomplete, setAutocomplete] = useState(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  // Generate customer ID on component mount
  useEffect(() => {
    const generateAndSetCustomerId = async () => {
      if (!customerIdGenerated) {
        try {
          // Get next available customer ID from API
          const response = await fetch('/api/customers/next-id?moduleCode=MD&companyCode=0001')
          if (response.ok) {
            const data = await response.json()
            setFormData(prev => ({ ...prev, customerId: data.customerId }))
            setCustomerIdGenerated(true)
          } else {
            // Fallback to preview format
            const previewId = generateCustomerId('MD', '0001')
            setFormData(prev => ({ ...prev, customerId: previewId }))
            setCustomerIdGenerated(true)
          }
        } catch (error) {
          console.error('Error generating customer ID:', error)
          // Fallback to preview format
          const previewId = generateCustomerId('MD', '0001')
          setFormData(prev => ({ ...prev, customerId: previewId }))
          setCustomerIdGenerated(true)
        }
      }
    }

    generateAndSetCustomerId()
  }, [customerIdGenerated])

  if (!isLoaded) {
    console.log('Google Maps API is loading...')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    }
    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = 'Company address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getAddressComponent = (addressComponents, type, useShortName = false) => {
    const component = addressComponents.find((component) =>
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
        let companyAddress = place.name

        if (streetNumber && route) {
          companyAddress = `${streetNumber} ${route}`
        } else if (route) {
          companyAddress = route
        } else if (place.name) {
          companyAddress = place.name
        }

        const city = getAddressComponent(place.address_components, 'locality')
        const state = getAddressComponent(place.address_components, 'administrative_area_level_1', true)
        const zipCode = getAddressComponent(place.address_components, 'postal_code')

        setFormData((prevFormData) => ({
          ...prevFormData,
          companyAddress: companyAddress,
          city: city,
          state: state,
          zipCode: zipCode,
        }))
      }
    }
  }

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const resetForm = () => {
    setFormData({ ...initialData })
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showErrorToast('Please fix the validation errors')
      return
    }

    setIsSubmitting(true)

    const loadingToastId = showLoadingToast('Creating customer...')

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        updateToast(loadingToastId, 'Customer created successfully!', 'success')
        resetForm()
        router.push('/customers')
      } else {
        const errorData = await response.json()
        updateToast(
          loadingToastId, 
          `Error creating customer: ${errorData.error || response.statusText}`, 
          'error'
        )
      }
    } catch (error) {
      console.error('Submission error:', error)
      updateToast(loadingToastId, 'An unexpected error occurred during submission.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={6}>
            {/* Customer ID */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Customer ID"
                value={formData.customerId}
                InputProps={{ readOnly: true }}
                helperText="This ID will be automatically assigned when the customer is created"
                color="success"
              />
            </Grid>

            {/* Personal Information */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" className="mb-4">Personal Information</Typography>
            </Grid>

            {/* Salutation, First Name, Last Name in one row */}
            <Grid size={{ xs: 12, sm: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Salutation</InputLabel>
                <Select
                  value={formData.salutation}
                  label="Salutation"
                  onChange={(e) => handleFormChange('salutation', e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Mr.">Mr.</MenuItem>
                  <MenuItem value="Mrs.">Mrs.</MenuItem>
                  <MenuItem value="Ms.">Ms.</MenuItem>
                  <MenuItem value="Dr.">Dr.</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleFormChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleFormChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>

            {/* Contact Information */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  inputComponent: PhoneNumberInput,
                }}
                required
              />
            </Grid>

            {/* Company Information */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.company}
                onChange={(e) => handleFormChange('company', e.target.value)}
                error={!!errors.company}
                helperText={errors.company}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Office Phone Number"
                name="officePhone"
                value={formData.officePhone}
                onChange={(e) => handleFormChange('officePhone', e.target.value)}
                InputProps={{
                  inputComponent: PhoneNumberInput,
                }}
              />
            </Grid>

            {/* Company Address */}
            <Grid size={{ xs: 12 }}>
              {isLoaded ? (
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={handlePlaceChanged}
                  options={{
                    types: ['address'],
                    fields: ['address_components', 'geometry', 'name'],
                  }}
                >
                  <TextField
                    fullWidth
                    label="Company Address"
                    value={formData.companyAddress}
                    onChange={(e) => handleFormChange('companyAddress', e.target.value)}
                    error={!!errors.companyAddress}
                    helperText={errors.companyAddress}
                    required
                  />
                </Autocomplete>
              ) : (
                <TextField
                  fullWidth
                  label="Company Address"
                  placeholder="Loading Google Maps..."
                  disabled
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => handleFormChange('city', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={(e) => handleFormChange('state', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.zipCode}
                onChange={(e) => handleFormChange('zipCode', e.target.value)}
              />
            </Grid>

            {/* Additional Information */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <Typography variant="body2" className="mb-2">Gender</Typography>
                <RadioGroup
                  row
                  value={formData.gender}
                  onChange={(e) => handleFormChange('gender', e.target.value)}
                >
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={formData.language}
                  label="Language"
                  onChange={(e) => handleFormChange('language', e.target.value)}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl>
                <Typography variant="body2" className="mb-2">Login Allowed?</Typography>
                <RadioGroup
                  row
                  value={formData.loginAllowed}
                  onChange={(e) => handleFormChange('loginAllowed', e.target.value === 'true')}
                >
                  <FormControlLabel value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} className="flex gap-4 flex-wrap pbs-6">
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Customer'}
            </Button>
            <Button
              variant="outlined"
              type="reset"
              color="secondary"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CustomerAccountDetails