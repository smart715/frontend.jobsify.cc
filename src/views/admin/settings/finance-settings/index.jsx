'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Utils
import { showSuccessToast, showErrorToast } from '@/utils/toast'

const FinanceSettings = () => {
  const [formData, setFormData] = useState({
    invoiceLogo: null,
    language: 'English',
    showAdvancedSignatory: false,
    billingName: '',
    taxName: '',
    taxId: '',
    billingAddress: '',
    termsAndConditions: 'Thank you for your business.'
  })

  const [logoPreview, setLogoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Fetch existing finance settings on component mount
  useEffect(() => {
    fetchFinanceSettings()
  }, [])

  const fetchFinanceSettings = async () => {
    try {
      setInitialLoading(true)
      const response = await fetch('/api/admin/finance-settings')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setFormData(prev => ({
            ...prev,
            ...data.data
          }))
          if (data.data.invoiceLogo) {
            setLogoPreview(data.data.invoiceLogo)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching finance settings:', error)
    } finally {
      setInitialLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const onDropLogo = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        invoiceLogo: file
      }))

      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps, isDragActive: isLogoDragActive } = useDropzone({
    onDrop: onDropLogo,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      const saveData = new FormData()

      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'invoiceLogo' && formData[key] instanceof File) {
          saveData.append(key, formData[key])
        } else if (key !== 'invoiceLogo') {
          saveData.append(key, formData[key])
        }
      })

      const response = await fetch('/api/admin/finance-settings', {
        method: 'POST',
        body: saveData
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showSuccessToast('Finance settings saved successfully!')
      } else {
        showErrorToast(result.message || 'Failed to save finance settings')
      }
    } catch (error) {
      console.error('Error saving finance settings:', error)
      showErrorToast('Failed to save finance settings')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
          Finance Settings
        </Typography>
        <Alert severity="info">Loading finance settings...</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Finance Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Invoice Logo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Invoice Logo
              </Typography>

              <Box
                {...getLogoRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isLogoDragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    borderColor: 'primary.main'
                  }
                }}
              >
                <input {...getLogoInputProps()} />
                {logoPreview ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <img 
                      src={logoPreview} 
                      alt="Invoice Logo" 
                      style={{ maxWidth: '100%', maxHeight: '150px', marginBottom: '10px' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Click or drag to replace image
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {isLogoDragActive ? 'Drop the image here' : 'Click or drag to upload invoice logo'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      PNG, JPG, JPEG, GIF up to 10MB
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Language */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Language
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  label="Language"
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                  <MenuItem value="German">German</MenuItem>
                  <MenuItem value="Italian">Italian</MenuItem>
                  <MenuItem value="Portuguese">Portuguese</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Signatory */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Advanced Settings
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.showAdvancedSignatory}
                    onChange={(e) => handleInputChange('showAdvancedSignatory', e.target.checked)}
                  />
                }
                label="Show Advanced Signatory"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Billing Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Billing Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Billing Name"
                    value={formData.billingName}
                    onChange={(e) => handleInputChange('billingName', e.target.value)}
                    placeholder="Enter billing name"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tax Name"
                    value={formData.taxName}
                    onChange={(e) => handleInputChange('taxName', e.target.value)}
                    placeholder="Enter tax name"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tax ID"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    placeholder="Enter tax ID"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Billing Address"
                    value={formData.billingAddress}
                    onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                    placeholder="Enter billing address"
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Terms and Conditions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Terms and Conditions
              </Typography>

              <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Terms and Conditions"
                  value={formData.termsAndConditions}
                  onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                  placeholder="Enter your custom terms and conditions"
                />
            </CardContent>
          </Card>
        </Grid>

        {/* Action Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              startIcon={<i className="ri-save-line" />}
              sx={{ minWidth: 120 }}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FinanceSettings