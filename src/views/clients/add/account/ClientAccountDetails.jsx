'use client'

// React Imports
import { forwardRef, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Google Maps Imports
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
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

// Third-party Imports
import { IMaskInput } from 'react-imask'

// Utils Imports (Toast)
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  updateToast,
} from '@/utils/toast'

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
  mobile: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  company: '',
  status: 'Active',
  notes: '',
  salutation: '',
  gender: 'Male',
  language: 'English',
  loginAllowed: false,
  receiveNotifications: false,
  officialWebsite: '',
  taxName: '',
  officePhone: '',
  postalCode: '',
  companyAddress: '',
}

const ClientAccountDetails = () => {
  // States
  const [formData, setFormData] = useState(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autocomplete, setAutocomplete] = useState(null)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  if (!isLoaded) {
    console.log('Google Maps API is loading...')
  }

  const getAddressComponent = (
    addressComponents,
    type,
    useShortName = false
  ) => {
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
        const streetNumber = getAddressComponent(
          place.address_components,
          'street_number'
        )
        const route = getAddressComponent(place.address_components, 'route')
        let streetAddress = place.name // Fallback to place.name

        if (streetNumber && route) {
          streetAddress = `${streetNumber} ${route}`
        } else if (route) {
          streetAddress = route
        } else if (place.name) {
          streetAddress = place.name
        }

        const city = getAddressComponent(place.address_components, 'locality')
        const state = getAddressComponent(
          place.address_components,
          'administrative_area_level_1',
          true
        )
        const zipCode = getAddressComponent(
          place.address_components,
          'postal_code'
        )

        setFormData((prevFormData) => ({
          ...prevFormData,
          companyAddress: streetAddress,
          city: city,
          state: state,
          postalCode: zipCode,
        }))

        // Clear validation errors for address fields when autocomplete fills them
        setErrors(prevErrors => ({
          ...prevErrors,
          companyAddress: '',
          city: '',
          state: '',
          postalCode: ''
        }))
      } else {
        console.log('Place details do not include address components:', place)
      }
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.loginAllowed === 'Yes' && !formData.email.trim()) {
      newErrors.email = 'Email is required when login is allowed'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number'
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

  const handleInputChange = (fieldName, value) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: value
    }))

    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [fieldName]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Run validation before submitting
    if (!validateForm()) {
      showErrorToast('Please fix the validation errors before submitting.')
      return
    }

    setIsSubmitting(true)

    const loadingToastId = showLoadingToast('Creating client...')

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const savedClient = await response.json()
        updateToast(loadingToastId, 'Client created successfully!', 'success')
        resetForm()
        router.push('/clients') // Redirect to client list page
      } else {
        const errorData = await response.json()
        updateToast(
          loadingToastId,
          `Error creating client: ${errorData.error || response.statusText}`,
          'error'
        )
      }
    } catch (error) {
      console.error('Error saving client:', error)
      updateToast(
        loadingToastId,
        'An unexpected error occurred during submission.',
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData(initialData)
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Account Details Section */}
      <Card className="mb-6">
        <CardContent>
          <Typography variant="h6" className="mb-4">
            Account Details
          </Typography>
          <Grid container spacing={4}>
            
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}
              >
                <Avatar sx={{ width: 80, height: 80 }}>
                  <i className="ri-upload-cloud-line text-2xl" />
                </Avatar>
                <Box>
                  <Button variant="contained" component="label" sx={{ mr: 2 }}>
                    Upload New Photo
                    <input type="file" hidden accept="image/*" />
                  </Button>
                  <Button variant="outlined">Reset</Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Allowed JPG, GIF or PNG. Max size of 800K
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Salutation</InputLabel>
                <Select
                  value={formData.salutation}
                  label="Salutation"
                  onChange={(e) =>
                    setFormData({ ...formData, salutation: e.target.value })
                  }
                >
                  <MenuItem value="Mr.">Mr.</MenuItem>
                  <MenuItem value="Mrs.">Mrs.</MenuItem>
                  <MenuItem value="Ms.">Ms.</MenuItem>
                  <MenuItem value="Dr.">Dr.</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  handleInputChange('firstName', e.target.value)
                }
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  handleInputChange('lastName', e.target.value)
                }
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  handleInputChange('email', e.target.value)
                }
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Mobile"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  handleInputChange('phone', e.target.value)
                }
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  inputComponent: PhoneNumberInput,
                }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  <MenuItem value="Prefer not to say">
                    Prefer not to say
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Change Language</InputLabel>
                <Select
                  value={formData.language}
                  label="Change Language"
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={4} className="mt-6">
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl>
                <Typography variant="body2" className="mb-2">
                  Login Allowed?
                </Typography>
                <RadioGroup
                  row
                  value={formData.loginAllowed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      loginAllowed: e.target.value === 'true',
                    })
                  }
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl>
                <Typography variant="body2" className="mb-2">
                  Receive email notifications?
                </Typography>
                <RadioGroup
                  row
                  value={formData.receiveNotifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      receiveNotifications: e.target.value === 'true',
                    })
                  }
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Company Details Section */}
      <Card className="mb-6">
        <CardContent>
          <Typography variant="h6" className="mb-4">
            Company Details
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.company}
                onChange={(e) =>
                  handleInputChange('company', e.target.value)
                }
                error={!!errors.company}
                helperText={errors.company}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Official Website"
                value={formData.officialWebsite}
                onChange={(e) =>
                  setFormData({ ...formData, officialWebsite: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Tax Name"
                value={formData.taxName}
                onChange={(e) =>
                  setFormData({ ...formData, taxName: e.target.value })
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Office Phone Number"
                name="officePhone"
                value={formData.officePhone}
                onChange={(e) =>
                  setFormData({ ...formData, officePhone: e.target.value })
                }
                InputProps={{
                  inputComponent: PhoneNumberInput,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {isLoaded ? (
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={handlePlaceChanged}
                  options={{
                    types: ['address'],
                    fields: ['address_components', 'geometry', 'name'],
                  }}
                  className="w-full"
                >
                  <TextField
                    fullWidth
                    label="Company Address"
                    value={formData.companyAddress}
                    placeholder="e.g., 1600 Amphitheatre Parkway"
                    onChange={(e) =>
                      handleInputChange('companyAddress', e.target.value)
                    }
                    error={!!errors.companyAddress}
                    helperText={errors.companyAddress}
                    id="company-address-input"
                    required
                  />
                </Autocomplete>
              ) : (
                <TextField
                  fullWidth
                  label="Company Address"
                  placeholder="Loading Google Maps..."
                  disabled
                  id="company-address-input-loading"
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                placeholder="e.g., Mountain View"
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                id="city-input"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                placeholder="e.g., CA"
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                id="state-input"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Postal code"
                value={formData.postalCode}
                placeholder="e.g., 94043"
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
                id="postal-code-input"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Note"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="outlined"
          type="button"
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Reset
        </Button>
      </div>
    </form>
  )
}

export default ClientAccountDetails