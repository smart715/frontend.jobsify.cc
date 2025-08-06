'use client'

// React Imports
import { forwardRef, useState, useEffect } from 'react'

// Next Imports
import { useRouter, useParams } from 'next/navigation'
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
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Third-party Imports
import { IMaskInput } from 'react-imask'

// Utils Imports (Toast)
import { showSuccessToast, showErrorToast, showLoadingToast, updateToast } from '@/utils/toast'

// Component Imports
import ModuleDropdown from '@/components/ModuleDropdown'

// Utils Imports
import { getCurrencyOptions, getLanguageOptions } from '@/utils/flagData'

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
  id: '',
  companyName: '',
  moduleId: '',
  status: 'Active',
  companyEmail: '',
  companyPhone: '',
  companyLogoUrl: '',
  companyWebsite: '',
  defaultCurrency: 'USD',
  language: 'English',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
}

const AccountDetails = () => {
  // States
  const [formData, setFormData] = useState({ ...initialData })
  const [selectedModule, setSelectedModule] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const [autocomplete, setAutocomplete] = useState(null)
  const [errors, setErrors] = useState({})
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')

  // Image cropping states
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState('')
  const [crop, setCrop] = useState({ aspect: 1, width: 200, height: 200, x: 0, y: 0 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [imageRef, setImageRef] = useState(null)
  const [originalFile, setOriginalFile] = useState(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  // Get currency and language options with flags
  const currencyOptions = getCurrencyOptions()
  const languageOptions = getLanguageOptions()

  // Fetch company data on component mount
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (params.id) {
        try {
          const response = await fetch(`/api/companies/${params.id}`)
          if (response.ok) {
            const companyData = await response.json()
            const moduleId = companyData.modules && companyData.modules.length > 0 ? companyData.modules[0].id : ''

            const initialFormData = {
              id: companyData.id,
              companyId: companyData.companyId || '',
              companyName: companyData.companyName || '',
              companyEmail: companyData.companyEmail || '',
              companyWebsite: companyData.companyWebsite || companyData.website || '',
              moduleId: moduleId,
              status: companyData.status || 'Active',
              companyPhone: companyData.companyPhone || '',
              companyLogoUrl: companyData.companyLogo || companyData.companyLogoUrl || '',
              adminFirstName: companyData.adminFirstName || '',
              adminLastName: companyData.adminLastName || '',
              adminEmail: companyData.adminEmail || '',
              streetAddress: companyData.companyAddress || companyData.streetAddress || '',
              city: companyData.city || '',
              state: companyData.state || '',
              zipCode: companyData.zipcode || companyData.zipCode || '',
              defaultCurrency: companyData.defaultCurrency || 'USD',
              language: companyData.language || 'English',
            }

            setFormData(initialFormData)
            setSelectedModule(moduleId)
            // Set logo preview if exists
            if (companyData.companyLogo || companyData.companyLogoUrl) {
              setLogoPreview(companyData.companyLogo || companyData.companyLogoUrl)
            }
          } else {
            showErrorToast('Failed to fetch company data')
          }
        } catch (error) {
          console.error('Error fetching company data:', error)
          showErrorToast('Error loading company data')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchCompanyData()
  }, [params.id])

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
        let streetAddress = place.name

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
          streetAddress: streetAddress,
          city: city,
          state: state,
          zipCode: zipCode,
        }))
      }
    }
  }

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleModuleChange = (event) => {
    const moduleId = event.target.value
    setSelectedModule(moduleId)
    setFormData((prev) => ({ ...prev, moduleId: moduleId }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      companyName: formData.companyName,
      companyEmail: formData.companyEmail,
      website: formData.companyWebsite,
      moduleId: formData.moduleId,
      status: formData.status,
      companyPhone: formData.companyPhone,
      adminFirstName: formData.adminFirstName,
      adminLastName: formData.adminLastName,
      adminEmail: formData.adminEmail,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      defaultCurrency: formData.defaultCurrency,
      language: formData.language,
    }

    const loadingToastId = showLoadingToast('Updating company...')

    try {
      const response = await fetch(`/api/companies/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        updateToast(loadingToastId, 'Company updated successfully!', 'success')
        router.push('/companies')
      } else {
        const errorData = await response.json()
        updateToast(
          loadingToastId, 
          `Error updating company: ${errorData.error || response.statusText}`, 
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

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setOriginalFile(file)
      // Create preview URL for cropping
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageSrc(reader.result)
        setCropModalOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const onImageLoad = (e) => {
    setImageRef(e.currentTarget)
  }

  const getCroppedImg = async (image, crop) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.9)
    })
  }

  const handleCropComplete = async () => {
    if (imageRef && completedCrop) {
      try {
        const croppedImageBlob = await getCroppedImg(imageRef, completedCrop)

        // Create cropped file
        const croppedFile = new File([croppedImageBlob], originalFile.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        })

        setLogoFile(croppedFile)

        // Create preview URL for cropped image
        const reader = new FileReader()
        reader.onloadend = () => {
          setLogoPreview(reader.result)
        }
        reader.readAsDataURL(croppedFile)

        // Update form data with filename
        handleFormChange('companyLogoUrl', croppedFile.name)

        setCropModalOpen(false)
      } catch (error) {
        console.error('Error cropping image:', error)
        showErrorToast('Error cropping image. Please try again.')
      }
    }
  }

  const handleCropCancel = () => {
    setCropModalOpen(false)
    setImageSrc('')
    setOriginalFile(null)
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex justify-center items-center p-8">
            Loading company data...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={6}>
            {/* Module Selection */}
            <Grid size={{ xs: 6 }}>
              <ModuleDropdown
                value={formData.moduleId || selectedModule}
                onChange={handleModuleChange}
                label="Select Module"
                required
              />
            </Grid>

            {/* Company Basic Information */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Company ID"
                value={formData.companyId || formData.id}
                InputProps={{ readOnly: true }}
                helperText="Company ID cannot be changed"
                color="success"
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.companyName}
                placeholder="Acme Corp"
                onChange={(e) =>
                  handleFormChange('companyName', e.target.value)
                }
                required
              />
            </Grid>

            {/* Status Dropdown */}
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Company Website"
                type="url"
                value={formData.companyWebsite}
                placeholder="https://www.example.com"
                onChange={(e) =>
                  handleFormChange('companyWebsite', e.target.value)
                }
              />
            </Grid>

            {/* Contact Information */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Company Email"
                type="email"
                value={formData.companyEmail}
                placeholder="johndoe@example.com"
                onChange={(e) =>
                  handleFormChange('companyEmail', e.target.value)
                }
                required
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Company Phone"
                name="companyPhone"
                value={formData.companyPhone}
                placeholder="(123) 456-7890"
                onChange={(e) =>
                  handleFormChange('companyPhone', e.target.value)
                }
                InputProps={{
                  inputComponent: PhoneNumberInput,
                }}
              />
            </Grid>

            {/* Company Settings */}
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Default Currency</InputLabel>
                <Select
                  label='Default Currency'
                  value={formData.defaultCurrency}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultCurrency: e.target.value }))}
                >
                  {currencyOptions.map((currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '20px' }}>{currency.flag}</span>
                        <span>{currency.code}</span>
                        <span style={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          ({currency.country})
                        </span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  label='Language'
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                >
                  {languageOptions.map((language) => (
                    <MenuItem key={language.name} value={language.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '20px' }}>{language.flag}</span>
                        <span>{language.name}</span>
                        <span style={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          ({language.country})
                        </span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              {/* Display current company logo if it exists */}
              {formData.companyLogoUrl && (
                <div className="mb-4">
                  <Typography variant="body2" className="mb-2">Current Company Logo:</Typography>
                  <img 
                    src={formData.companyLogoUrl} 
                    alt="Company Logo" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '100px', 
                      objectFit: 'contain',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '8px'
                    }} 
                  />
                </div>
              )}
              <TextField
                fullWidth
                type="file"
                label="Upload New Company Logo"
                InputLabelProps={{ shrink: true }}
                inputProps={{ 
                  accept: 'image/*',
                  'aria-describedby': 'logo-helper-text'
                }}
                onChange={handleLogoChange}
                helperText="Upload a new company logo (JPG, PNG, GIF) to replace the current one"
              />
            </Grid>
          </Grid>

          <Grid container spacing={5} className="flex gap-4 flex-wrap pbs-6">
            {/* Address Section */}
            <Grid size={{ xs: 6 }}>
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
                    label="Street Address"
                    value={formData.streetAddress}
                    placeholder="e.g., 1600 Amphitheatre Parkway"
                    onChange={(e) =>
                      handleFormChange('streetAddress', e.target.value)
                    }
                    id="street-address-input"
                  />
                </Autocomplete>
              ) : (
                <TextField
                  fullWidth
                  label="Street Address"
                  placeholder="Loading Google Maps..."
                  disabled
                  id="street-address-input-loading"
                />
              )}
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                placeholder="e.g., Mountain View"
                onChange={(e) => handleFormChange('city', e.target.value)}
                id="city-input"
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                placeholder="e.g., CA"
                onChange={(e) => handleFormChange('state', e.target.value)}
                id="state-input"
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Zip Code"
                value={formData.zipCode}
                placeholder="e.g., 94043"
                onChange={(e) => handleFormChange('zipCode', e.target.value)}
                id="zip-code-input"
              />
            </Grid>
          </Grid>

          <Grid container spacing={5} className="flex gap-4 flex-wrap pbs-6">
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Admin First Name"
                value={formData.adminFirstName}
                placeholder="e.g. John"
                onChange={(e) => handleFormChange('adminFirstName', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Admin Last Name"
                value={formData.adminLastName}
                placeholder="e.g. Doe"
                onChange={(e) => handleFormChange('adminLastName', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Admin Email"
                type="email"
                value={formData.adminEmail}
                placeholder="e.g. johndoe@example.com"
                onChange={(e) => handleFormChange('adminEmail', e.target.value)}
                required
              />
            </Grid>
          </Grid>

          <Grid item xs={12} className="flex gap-4 flex-wrap pbs-6">
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Company'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push('/companies')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
