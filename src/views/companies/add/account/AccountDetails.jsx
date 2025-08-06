'use client'

// React Imports

import { forwardRef, useState, useEffect } from 'react'

// Next Imports

import { useRouter } from 'next/navigation'

import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-toastify'
import FormHelperText from '@mui/material/FormHelperText'

// Third-party Imports
import { IMaskInput } from 'react-imask'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

// MUI Dialog Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Utils Imports (Toast)
import { showSuccessToast, showErrorToast, showLoadingToast, updateToast } from '@/utils/toast'

// Utils Imports
import { getCurrencyOptions, getLanguageOptions } from '@/utils/flagData'

// Component Imports

// Removed Typography, FormControl, InputLabel, Select, MenuItem, Chip as they are not used or replaced by simpler TextFields for now

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

// Utils Imports
import { generateCompanyId, MODULE_CODES } from '@/utils/companyUtils' // Adjust path if necessary

const initialData = {
  id: '', // Will be generated after module selection
  companyName: '',
  status: 'Active', // Default status

  companyEmail: '',
  companyPhone: '',
  companyLogoUrl: '', // Will store filename or a placeholder
  companyWebsite: '',
  defaultCurrency: 'USD', // Default value
  language: 'English', // Default value
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  adminFirstName: '',
  adminLastName: '',
  adminEmail: '',
  adminPassword: '',
}

const AccountDetails = ({ onNext }) => {
  // States
  const [formData, setFormData] = useState({ ...initialData })
  const [selectedModule, setSelectedModule] = useState('')
  const [moduleOptions, setModuleOptions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const [autocomplete, setAutocomplete] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [errors, setErrors] = useState({})

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

  // Fetch modules from API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules')
        if (response.ok) {
          const modules = await response.json()
          setModuleOptions(modules.filter(m => m.isActive))
        }
      } catch (error) {
        console.error('Error fetching modules:', error)
      }
    }
    fetchModules()
  }, [])

  if (!isLoaded) {
    console.log('Google Maps API is loading...')

    // You might want to return a loading spinner here in a real app
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
          streetAddress: streetAddress,
          city: city,
          state: state,
          zipCode: zipCode,
        }))
      } else {
        console.log('Place details do not include address components:', place)
      }
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
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

  const handleModuleChange = async (moduleId) => {
    setSelectedModule(moduleId)
    handleFormChange('module', moduleId) // This now correctly saves the module ID

    if (moduleId) {
      try {
        // Fetch the specific module data
        const moduleResponse = await fetch(`/api/modules/${moduleId}`)
        if (moduleResponse.ok) {
          const moduleData = await moduleResponse.json()
          console.log('Module data:', moduleData) // Debug log

          // Set module type for ID generation (actual ID will be generated by API)
          const moduleNameForId = moduleData.name.toUpperCase().replace(/\s+/g, '_')
          console.log('Module type for ID generation:', moduleNameForId) // Debug log

          // Fetch the actual next available company ID from API
          try {
            const response = await fetch(`/api/companies/next-id?moduleType=${encodeURIComponent(moduleNameForId)}`)
            if (response.ok) {
              const data = await response.json()
              setFormData((prev) => ({ 
                ...prev, 
                id: data.companyId,  // Show actual next available ID
                moduleType: moduleNameForId 
              }))
            } else {
              console.error('Failed to fetch next company ID')
              // Fallback to preview format
              const previewId = generateCompanyId(moduleNameForId)
              setFormData((prev) => ({ 
                ...prev, 
                id: previewId,
                moduleType: moduleNameForId 
              }))
            }
          } catch (error) {
            console.error('Error fetching next company ID:', error)
            // Fallback to preview format
            const previewId = generateCompanyId(moduleNameForId)
            setFormData((prev) => ({ 
              ...prev, 
              id: previewId,
              moduleType: moduleNameForId 
            }))
          }
        } else {
          console.error('Failed to fetch module data:', moduleResponse.statusText)
          console.error('Module ID that failed:', moduleId)
        }
      } catch (error) {
        console.error('Error fetching module data:', error)
      }
    } else {
      setFormData((prev) => ({ ...prev, id: '', moduleType: '' }))
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Helper functions for currency flags and labels
  const getCurrencyFlag = (currency) => {
    const flags = {
      USD: '🇺🇸',
      EUR: '🇪🇺',
      GBP: '🇬🇧',
      CAD: '🇨🇦',
      AUD: '🇦🇺',
      JPY: '🇯🇵',
      CHF: '🇨🇭',
      CNY: '🇨🇳',
      INR: '🇮🇳'
    }
    return flags[currency] || '🏳️'
  }

  const getCurrencyLabel = (currency) => {
    const labels = {
      USD: 'USD - US Dollar',
      EUR: 'EUR - Euro',
      GBP: 'GBP - British Pound',
      CAD: 'CAD - Canadian Dollar',
      AUD: 'AUD - Australian Dollar',
      JPY: 'JPY - Japanese Yen',
      CHF: 'CHF - Swiss Franc',
      CNY: 'CNY - Chinese Yuan',
      INR: 'INR - Indian Rupee'
    }
    return labels[currency] || currency
  }

  // Helper functions for language flags and labels
  const getLanguageFlag = (language) => {
    const flags = {
      English: '🇺🇸',
      Spanish: '🇪🇸',
      French: '🇫🇷',
      German: '🇩🇪',
      Italian: '🇮🇹',
      Portuguese: '🇵🇹',
      Chinese: '🇨🇳',
      Japanese: '🇯🇵',
      Korean: '🇰🇷',
      Arabic: '🇸🇦',
      Hindi: '🇮🇳'
    }
    return flags[language] || '🏳️'
  }

  const getLanguageLabel = (language) => {
    return language || ''
  }

  const currencyOptions = getCurrencyOptions()
  const languageOptions = getLanguageOptions()


  // No initial company ID generation - will be set when package is selected

  const resetForm = () => {
    setFormData({
      ...initialData,
      id: '',
      moduleType: '',
      companyName: '',
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
      adminPassword: '',
    })
    setSelectedModule('')
    setLogoFile(null)
    setLogoPreview('')
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Show loading toast
    const loadingToastId = showLoadingToast('Creating company...')

    try {
      // First, upload logo if exists
      let logoUrl = ''
      if (logoFile) {
        const logoFormData = new FormData()
        logoFormData.append('logo', logoFile)
        logoFormData.append('companyId', formData.id)

        const logoResponse = await fetch('/api/companies/upload-logo', {
          method: 'POST',
          body: logoFormData,
        })

        if (logoResponse.ok) {
          const logoResult = await logoResponse.json()
          logoUrl = logoResult.logoUrl
        } else {
          console.warn('Logo upload failed, continuing without logo')
        }
      }

      const payload = {
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        website: formData.companyWebsite, // Mapped from companyWebsite
        module: formData.module, // Send the module ID
        moduleType: formData.moduleType, // Include module type for ID generation
        status: formData.status,
        companyPhone: formData.companyPhone,
        adminFirstName: formData.adminFirstName,
        adminLastName: formData.adminLastName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        defaultCurrency: formData.defaultCurrency,
        language: formData.language,
        id: formData.id,
        companyLogoUrl: logoUrl || formData.companyLogoUrl,
      }

      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        updateToast(loadingToastId, 'success', result.message || 'Company account details saved successfully!')

        // Redirect to edit page after successful creation with security tab active
        setTimeout(() => {
          window.location.href = `/companies/edit/${result.company.id}?fromAdd=true`
        }, 1500) // Small delay to show success message
      } else {
        // Handle specific validation errors
        if (result.type === 'validation' && result.field === 'companyEmail') {
          updateToast(loadingToastId, 'error', result.error || 'A company with this email address already exists. Please use a different email.')
        } else if (result.type === 'connection') {
          updateToast(loadingToastId, 'error', 'Database connection failed. Please try again.')
        } else if (result.type === 'timeout') {
          updateToast(loadingToastId, 'error', 'Request timed out. Please try again.')
        } else {
          updateToast(loadingToastId, 'error', result.error || result.message || 'Failed to create company')
        }

        // Log detailed error for debugging
        console.error('Company creation failed:', result)
      }
    } catch (error) {
      console.error('Error creating company:', error)
      updateToast(loadingToastId, 'error', 'An error occurred while creating the company')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={6}>


            {/* Module Selection First */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="module-select-label">Module</InputLabel>
                <Select
                  labelId="module-select-label"
                  id="module-select"
                  value={selectedModule}
                  label="Module"
                  onChange={(e) => handleModuleChange(e.target.value)}
                >
                  {moduleOptions.map((module) => (
                    <MenuItem key={module.id} value={module.id}>
                      {module.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Company Basic Information */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Company ID"
                value={formData.id}
                onChange={(e) => handleFormChange('id', e.target.value)}
                helperText={formData.moduleType ? "Company ID (editable)" : "Select a module to enable Company ID generation"}
                color={formData.moduleType ? "success" : "primary"}
                required
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
              <FormControl fullWidth error={!!errors.defaultCurrency}>
                <InputLabel>Default Currency</InputLabel>
                <Select
                  label='Default Currency'
                  name='defaultCurrency'
                  value={formData.defaultCurrency}
                  onChange={handleChange}
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>
                        {getCurrencyFlag(selected)}
                      </span>
                      {getCurrencyLabel(selected)}
                    </div>
                  )}
                >
                  <MenuItem value='USD'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇺🇸</span>
                      USD - US Dollar
                    </div>
                  </MenuItem>
                  <MenuItem value='EUR'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇪🇺</span>
                      EUR - Euro
                    </div>
                  </MenuItem>
                  <MenuItem value='GBP'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇬🇧</span>
                      GBP - British Pound
                    </div>
                  </MenuItem>
                  <MenuItem value='CAD'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇨🇦</span>
                      CAD - Canadian Dollar
                    </div>
                  </MenuItem>
                  <MenuItem value='AUD'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇦🇺</span>
                      AUD - Australian Dollar
                    </div>
                  </MenuItem>
                  <MenuItem value='JPY'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇯🇵</span>
                      JPY - Japanese Yen
                    </div>
                  </MenuItem>
                  <MenuItem value='CHF'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇨🇭</span>
                      CHF - Swiss Franc
                    </div>
                  </MenuItem>
                  <MenuItem value='CNY'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇨🇳</span>
                      CNY - Chinese Yuan
                    </div>
                  </MenuItem>
                  <MenuItem value='INR'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇮🇳</span>
                      INR - Indian Rupee
                    </div>
                  </MenuItem>
                </Select>
                {errors.defaultCurrency && <FormHelperText>{errors.defaultCurrency}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth error={!!errors.language}>
                <InputLabel>Language</InputLabel>
                <Select
                  label='Language'
                  name='language'
                  value={formData.language}
                  onChange={handleChange}
                  renderValue={(selected) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>
                        {getLanguageFlag(selected)}
                      </span>
                      {getLanguageLabel(selected)}
                    </div>
                  )}
                >
                  <MenuItem value='English'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇺🇸</span>
                      English
                    </div>
                  </MenuItem>
                  <MenuItem value='Spanish'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇪🇸</span>
                      Spanish
                    </div>
                  </MenuItem>
                  <MenuItem value='French'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇫🇷</span>
                      French
                    </div>
                  </MenuItem>
                  <MenuItem value='German'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇩🇪</span>
                      German
                    </div>
                  </MenuItem>
                  <MenuItem value='Italian'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇮🇹</span>
                      Italian
                    </div>
                  </MenuItem>
                  <MenuItem value='Portuguese'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇵🇹</span>
                      Portuguese
                    </div>
                  </MenuItem>
                  <MenuItem value='Chinese'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇨🇳</span>
                      Chinese
                    </div>
                  </MenuItem>
                  <MenuItem value='Japanese'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇯🇵</span>
                      Japanese
                    </div>
                  </MenuItem>
                  <MenuItem value='Korean'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇰🇷</span>
                      Korean
                    </div>
                  </MenuItem>
                  <MenuItem value='Arabic'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇸🇦</span>
                      Arabic
                    </div>
                  </MenuItem>
                  <MenuItem value='Hindi'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>🇮🇳</span>
                      Hindi
                    </div>
                  </MenuItem>
                </Select>
                {errors.language && <FormHelperText>{errors.language}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="file"
                label="Company Logo"
                InputLabelProps={{ shrink: true }}
                inputProps={{ 
                  accept: 'image/*',
                  'aria-describedby': 'logo-helper-text'
                }}
                onChange={handleLogoChange}
                helperText="Upload company logo (JPG, PNG, GIF)"
              />
              {logoPreview && (
                <div className="mt-4">
                  <Typography variant="body2" className="mb-2">Logo Preview:</Typography>
                  <img 
                    src={logoPreview} 
                    alt="Company Logo Preview" 
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
            </Grid>
          </Grid>

          <Grid container spacing={5} className="flex gap-4 flex-wrap pbs-6">
            {/* Street Address with ID for Google Places Autocomplete */}

            <Grid size={{ xs: 6 }}>
              {isLoaded ? (
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={handlePlaceChanged}
                  options={{
                    types: ['address'],
                    fields: ['address_components', 'geometry', 'name'],
                    componentRestrictions: { country: 'us' }
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
              {/*
                TODO: Google Places Autocomplete Integration
                1. Include Google Maps JavaScript API with 'places' library in your HTML.
                   <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initAutocomplete"></script>
                2. Create an initAutocomplete function (if not using a React-specific library):
                   function initAutocomplete() {
                     const streetAddressInput = document.getElementById('street-address-input');
                     const autocomplete = new google.maps.places.Autocomplete(streetAddressInput, {
                       types: ['address'],
                       componentRestrictions: { 'country': 'us' }, // Optional: restrict to a country
                       fields: ['address_components', 'geometry'] // Request specific fields
                     });
                     autocomplete.addListener('place_changed', () => {
                       const place = autocomplete.getPlace();
                       // Logic to parse place.address_components and populate city, state, zipCode fields
                       // For example:
                       // const city = place.address_components.find(c => c.types.includes('locality'))?.long_name;
                       // const state = place.address_components.find(c => c.types.includes('administrative_area_level_1'))?.short_name;
                       // const zipCode = place.address_components.find(c => c.types.includes('postal_code'))?.short_name;
                       // setFormData(prev => ({ ...prev, streetAddress: streetAddressInput.value, city, state, zipCode }));
                     });
                   }
                3. Or, use a React library for Google Places Autocomplete (e.g., react-google-autocomplete, @react-google-maps/api).
                   This often involves wrapping the input or using a provided component.
                   Example with a conceptual library:
                   <GooglePlacesAutocomplete
                     apiKey="YOUR_API_KEY"
                     onPlaceSelected={(place) => {
                       // Parse place and update formData for streetAddress, city, state, zipCode
                     }}
                     renderInput={(props) => (
                       <TextField
                         {...props} // Spread props from the library
                         fullWidth
                         label='Street Address'
                         // value will be handled by the library or by setting formData.streetAddress
                         id='street-address-input'
                       />
                     )}
                   />
              */}
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                placeholder="e.g., Mountain View"
                onChange={(e) => handleFormChange('city', e.target.value)}
                id="city-input" // Optional ID, can be useful for autocomplete filling
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                placeholder="e.g., CA"
                onChange={(e) => handleFormChange('state', e.target.value)}
                id="state-input" // Optional ID
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Zip Code"
                value={formData.zipCode}
                placeholder="e.g., 94043"
                onChange={(e) => handleFormChange('zipCode', e.target.value)}
                id="zip-code-input" // Optional ID
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
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="password"
                label="Admin Password"
                value={formData.adminPassword}
                placeholder="Enter password for admin user"
                onChange={(e) => handleFormChange('adminPassword', e.target.value)}
                required
              />
            </Grid>
          </Grid>

          <Grid item xs={12} className="flex gap-4 flex-wrap pbs-6">
            <Button variant="contained" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save & Continue to Security'}
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

      {/* Image Crop Modal */}
      <Dialog 
        open={cropModalOpen} 
        onClose={handleCropCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Crop Company Logo</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                minWidth={100}
                minHeight={100}
                keepSelection
              >
                <img
                  src={imageSrc}
                  onLoad={onImageLoad}
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                  alt="Crop preview"
                />
              </ReactCrop>
            )}
          </div>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Drag to select the area you want to crop. The image will be cropped to a square format.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCropCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCropComplete} variant="contained" color="primary">
            Crop & Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default AccountDetails