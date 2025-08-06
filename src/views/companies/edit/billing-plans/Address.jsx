
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// Utils
import { showSuccessToast, showErrorToast, showLoadingToast, updateToast } from '@/utils/toast'

const Address = () => {
  const params = useParams()
  const [formData, setFormData] = useState({
    companyName: '',
    billingEmail: '',
    taxId: '',
    vatNumber: '',
    phoneNumber: '',
    country: 'United States',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: ''
  })
  const [loading, setLoading] = useState(true)
  const [autocomplete, setAutocomplete] = useState(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  useEffect(() => {
    fetchBillingAddress()
  }, [params.id])

  const fetchBillingAddress = async () => {
    try {
      const response = await fetch(`/api/billing-address?companyId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setFormData({
            companyName: data.companyName || '',
            billingEmail: data.billingEmail || '',
            taxId: data.taxId || '',
            vatNumber: data.vatNumber || '',
            phoneNumber: data.phoneNumber || '',
            country: data.country || 'United States',
            address1: data.address1 || '',
            address2: data.address2 || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || ''
          })
        }
      }
    } catch (error) {
      console.error('Error fetching billing address:', error)
    } finally {
      setLoading(false)
    }
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
        let address1 = place.name

        if (streetNumber && route) {
          address1 = `${streetNumber} ${route}`
        } else if (route) {
          address1 = route
        } else if (place.name) {
          address1 = place.name
        }

        const city = getAddressComponent(place.address_components, 'locality')
        const state = getAddressComponent(place.address_components, 'administrative_area_level_1', true)
        const zipCode = getAddressComponent(place.address_components, 'postal_code')
        const country = getAddressComponent(place.address_components, 'country')

        setFormData((prevFormData) => ({
          ...prevFormData,
          address1: address1,
          city: city,
          state: state,
          zipCode: zipCode,
          country: country || 'United States'
        }))
      }
    }
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = async () => {
    const loadingToastId = showLoadingToast('Saving billing address...')

    try {
      const response = await fetch('/api/billing-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyId: params.id,
          ...formData
        })
      })

      if (response.ok) {
        updateToast(loadingToastId, 'Billing address saved successfully!', 'success')
      } else {
        const error = await response.json()
        updateToast(loadingToastId, `Error: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Error saving billing address:', error)
      updateToast(loadingToastId, 'An error occurred while saving billing address', 'error')
    }
  }

  const handleReset = () => {
    fetchBillingAddress()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader title="Billing Address" />
        <CardContent>
          <div>Loading billing address...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title="Billing Address" />
      <CardContent>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Billing Email"
              type="email"
              value={formData.billingEmail}
              onChange={(e) => handleChange('billingEmail', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="TAX ID"
              value={formData.taxId}
              onChange={(e) => handleChange('taxId', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="VAT Number"
              value={formData.vatNumber}
              onChange={(e) => handleChange('vatNumber', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Mobile Number"
              value={formData.phoneNumber}
              onChange={(e) => {
                // Format phone number as user types
                let value = e.target.value.replace(/\D/g, '') // Remove non-digits
                if (value.length >= 6) {
                  value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
                } else if (value.length >= 3) {
                  value = `(${value.slice(0, 3)}) ${value.slice(3)}`
                }
                handleChange('phoneNumber', value)
              }}
              placeholder="(202) 555-0111"
              inputProps={{ 
                maxLength: 14,
                pattern: "\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}"
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                value={formData.country}
                label="Country"
                onChange={(e) => handleChange('country', e.target.value)}
              >
                <MenuItem value="United States">United States</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                <MenuItem value="Australia">Australia</MenuItem>
                <MenuItem value="Germany">Germany</MenuItem>
                <MenuItem value="France">France</MenuItem>
                <MenuItem value="India">India</MenuItem>
              </Select>
            </FormControl>
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
              >
                <TextField
                  fullWidth
                  label="Address1"
                  value={formData.address1}
                  onChange={(e) => handleChange('address1', e.target.value)}
                />
              </Autocomplete>
            ) : (
              <TextField
                fullWidth
                label="Address1"
                value={formData.address1}
                onChange={(e) => handleChange('address1', e.target.value)}
                placeholder="Loading Google Maps..."
                disabled
              />
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Address2"
              value={formData.address2}
              onChange={(e) => handleChange('address2', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="State"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Zip"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className="flex gap-4">
              <Button variant="contained" onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Address
