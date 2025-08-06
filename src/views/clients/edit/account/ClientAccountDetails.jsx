'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'

// Utils Imports
import { getLocalizedUrl } from '@/utils/i18n'

const ClientAccountDetails = ({ clientData }) => {
  // States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gender: 'Male',
    language: 'English',
    loginAllowed: 'Yes',
    receiveNotifications: 'No',
    companyName: '',
    officialWebsite: '',
    taxName: '',
    officePhoneNumber: '',
    companyAddress: '',
    city: '',
    state: '',
    postalCode: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  // Hooks
  const { lang: locale, id } = useParams()
  const router = useRouter()

  // Populate form with client data
  useEffect(() => {
    if (clientData) {
      setFormData({
        firstName: clientData.firstName || '',
        lastName: clientData.lastName || '',
        email: clientData.email || '',
        mobile: clientData.phone || '',
        gender: clientData.gender || 'Male',
        language: clientData.language || 'English',
        loginAllowed: clientData.loginAllowed ? 'Yes' : 'No',
        receiveNotifications: clientData.receiveNotifications ? 'Yes' : 'No',
        companyName: clientData.company || '',
        officialWebsite: clientData.website || '',
        taxName: clientData.taxName || '',
        officePhone: clientData.officePhone || '',
        address: clientData.address || '',
        city: clientData.city || '',
        state: clientData.state || '',
        zipCode: clientData.zipCode || '',
        notes: clientData.notes || ''
      })
    }
  }, [clientData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.mobile,
          gender: formData.gender,
          language: formData.language,
          loginAllowed: formData.loginAllowed === 'Yes',
          receiveNotifications: formData.receiveNotifications === 'Yes',
          company: formData.companyName,
          website: formData.officialWebsite,
          taxName: formData.taxName,
          officePhone: formData.officePhoneNumber,
          address: formData.companyAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode,
          notes: formData.notes
        }),
      })

      if (response.ok) {
        console.log('Client updated successfully!')
        router.push(getLocalizedUrl('/clients', locale))
      } else {
        console.error('Failed to update client')
      }
    } catch (error) {
      console.error('Error updating client:', error)
      console.error('An error occurred while updating the client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300">
                  <i className="ri-upload-cloud-line text-2xl text-gray-400"></i>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button variant="contained" component="label" size="small">
                      Upload New Photo
                      <input type="file" hidden accept="image/*" />
                    </Button>
                    <Button variant="outlined" size="small">
                      Reset
                    </Button>
                  </div>
                  <Typography variant="caption" color="text.secondary">
                    Allowed JPG, GIF or PNG. Max size of 800K
                  </Typography>
                </div>
              </div>

              <Typography variant="h5" className="mb-6">
                Account Details
              </Typography>

              <Grid container spacing={6}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Salutation</InputLabel>
                    <Select
                      value="Mr."
                      label="Salutation"
                    >
                      <MenuItem value="Mr.">Mr.</MenuItem>
                      <MenuItem value="Ms.">Ms.</MenuItem>
                      <MenuItem value="Mrs.">Mrs.</MenuItem>
                      <MenuItem value="Dr.">Dr.</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name *"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name *"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Mobile *"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender}
                      label="Gender"
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Change Language</InputLabel>
                    <Select
                      value={formData.language}
                      label="Change Language"
                      onChange={(e) => handleInputChange('language', e.target.value)}
                    >
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Spanish">Spanish</MenuItem>
                      <MenuItem value="French">French</MenuItem>
                      <MenuItem value="German">German</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl>
                    <FormLabel>Login Allowed?</FormLabel>
                    <RadioGroup
                      row
                      value={formData.loginAllowed}
                      onChange={(e) => handleInputChange('loginAllowed', e.target.value)}
                    >
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl>
                    <FormLabel>Receive email notifications?</FormLabel>
                    <RadioGroup
                      row
                      value={formData.receiveNotifications}
                      onChange={(e) => handleInputChange('receiveNotifications', e.target.value)}
                    >
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" className="mb-6">
                Company Details
              </Typography>

              <Grid container spacing={6}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Company Name *"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Official Website"
                    value={formData.officialWebsite}
                    onChange={(e) => handleInputChange('officialWebsite', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Tax Name"
                    value={formData.taxName}
                    onChange={(e) => handleInputChange('taxName', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Office Phone Number"
                    value={formData.officePhoneNumber}
                    onChange={(e) => handleInputChange('officePhoneNumber', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Company Address *"
                    value={formData.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Postal code"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Note"
                    multiline
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </Grid>
              </Grid>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outlined"
                  component={Link}
                  href={getLocalizedUrl('/clients', locale)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Client'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}

export default ClientAccountDetails