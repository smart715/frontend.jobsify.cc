'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import { Divider } from '@mui/material'

// Vars
const initialData = {
  moduleType: '',
  companyId: '',
  contactFirstName: 'John',
  contactLastName: 'Doe',
  contactPhone: '+1 (917) 543-9876',
  contactEmail: 'john.doe@example.com',
  companyName: 'Pixinvent',
  companyWebsite: 'https://pixinvent.com',
  address: '123 Main St',
  address2: 'Suite 500',
  city: 'New York',
  state: 'New York',
  zipCode: '10001',
  timeZone: 'gmt-12',
  companyPhone: '+1 (917) 555-1234',
  companyEmail: 'contact@pixinvent.com',
  language: ['English'],
  currency: 'usd'
}

const languageData = ['English', 'Arabic', 'French', 'German', 'Portuguese']

const AccountDetails = () => {
  // States
  const [formData, setFormData] = useState(initialData)
  const [fileInput, setFileInput] = useState('')
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [language, setLanguage] = useState(formData.language)

  const handleDelete = value => {
    const newLang = language.filter(item => item !== value)
    
    setLanguage(newLang)
    setFormData({ ...formData, language: newLang })
  }

  const handleChange = event => {
    const {
      target: { value }
    } = event

    setLanguage(typeof value === 'string' ? value.split(',') : value)
    setFormData({ ...formData, language: typeof value === 'string' ? value.split(',') : value })
  }

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleFileInputChange = file => {
    const reader = new FileReader()
    const { files } = file.target

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setFileInput(reader.result)
      }
    }
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc('/images/avatars/1.png')
  }

  return (
    <Card>
      <CardContent className='mbe-5'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  value={fileInput}
                  accept='image/png, image/jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </Button>
              <Button variant='outlined' color='error' onClick={handleFileInputReset}>
                Reset
              </Button>
            </div>
            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Module Type'
                value={formData.moduleType}
                placeholder='Module Type'
                onChange={e => handleFormChange('moduleType', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Company ID'
                value={formData.companyId}
                placeholder='Company ID'
                onChange={e => handleFormChange('companyId', e.target.value)}
              />
            </Grid>
          </Grid>
          <Divider sx={{marginTop: 7, marginBottom: 7}} />
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Contact First Name'
                value={formData.contactFirstName}
                placeholder='John'
                onChange={e => handleFormChange('contactFirstName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Contact Last Name'
                value={formData.contactLastName}
                placeholder='Doe'
                onChange={e => handleFormChange('contactLastName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Contact Phone'
                value={formData.contactPhone}
                placeholder='+1 (917) 543-9876'
                onChange={e => handleFormChange('contactPhone', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Contact Email'
                value={formData.contactEmail}
                placeholder='john.doe@example.com'
                onChange={e => handleFormChange('contactEmail', e.target.value)}
              />
            </Grid>
          </Grid>
          <Divider sx={{marginTop: 7, marginBottom: 7}} />
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Company Name'
                value={formData.companyName}
                placeholder='Pixinvent'
                onChange={e => handleFormChange('companyName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Company Website'
                value={formData.companyWebsite}
                placeholder='https://pixinvent.com'
                onChange={e => handleFormChange('companyWebsite', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Address'
                value={formData.address}
                placeholder='123 Main St'
                onChange={e => handleFormChange('address', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Address 2'
                value={formData.address2}
                placeholder='Suite 500'
                onChange={e => handleFormChange('address2', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='City'
                value={formData.city}
                placeholder='New York'
                onChange={e => handleFormChange('city', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='State'
                value={formData.state}
                placeholder='New York'
                onChange={e => handleFormChange('state', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type='text'
                label='Zip'
                value={formData.zipCode}
                placeholder='10001'
                onChange={e => handleFormChange('zipCode', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Time Zone</InputLabel>
                <Select
                  label='Time Zone'
                  value={formData.timeZone}
                  onChange={e => handleFormChange('timeZone', e.target.value)}
                  MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                >
                  <MenuItem value='gmt-12'>(GMT-12:00) International Date Line West</MenuItem>
                  <MenuItem value='gmt-11'>(GMT-11:00) Midway Island, Samoa</MenuItem>
                  <MenuItem value='gmt-10'>(GMT-10:00) Hawaii</MenuItem>
                  <MenuItem value='gmt-09'>(GMT-09:00) Alaska</MenuItem>
                  <MenuItem value='gmt-08'>(GMT-08:00) Pacific Time (US & Canada)</MenuItem>
                  <MenuItem value='gmt-08-baja'>(GMT-08:00) Tijuana, Baja California</MenuItem>
                  <MenuItem value='gmt-07'>(GMT-07:00) Chihuahua, La Paz, Mazatlan</MenuItem>
                  <MenuItem value='gmt-07-mt'>(GMT-07:00) Mountain Time (US & Canada)</MenuItem>
                  <MenuItem value='gmt-06'>(GMT-06:00) Central America</MenuItem>
                  <MenuItem value='gmt-06-ct'>(GMT-06:00) Central Time (US & Canada)</MenuItem>
                  <MenuItem value='gmt-06-mc'>(GMT-06:00) Guadalajara, Mexico City, Monterrey</MenuItem>
                  <MenuItem value='gmt-06-sk'>(GMT-06:00) Saskatchewan</MenuItem>
                  <MenuItem value='gmt-05'>(GMT-05:00) Bogota, Lima, Quito, Rio Branco</MenuItem>
                  <MenuItem value='gmt-05-et'>(GMT-05:00) Eastern Time (US & Canada)</MenuItem>
                  <MenuItem value='gmt-05-ind'>(GMT-05:00) Indiana (East)</MenuItem>
                  <MenuItem value='gmt-04'>(GMT-04:00) Atlantic Time (Canada)</MenuItem>
                  <MenuItem value='gmt-04-clp'>(GMT-04:00) Caracas, La Paz</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Company Phone'
                value={formData.companyPhone}
                placeholder='+1 (917) 555-1234'
                onChange={e => handleFormChange('companyPhone', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label='Company Email'
                value={formData.companyEmail}
                placeholder='contact@pixinvent.com'
                onChange={e => handleFormChange('companyEmail', e.target.value)}
              />
            </Grid>
          </Grid>
          <Divider sx={{marginTop: 7, marginBottom: 7}} />
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  multiple
                  label='Language'
                  value={language}
                  onChange={handleChange}
                  renderValue={selected => (
                    <div className='flex flex-wrap gap-2'>
                      {selected.map(value => (
                        <Chip
                          key={value}
                          clickable
                          deleteIcon={
                            <i
                              className='ri-close-circle-fill'
                              onMouseDown={event => event.stopPropagation()}
                            />
                          }
                          size='small'
                          label={value}
                          onDelete={() => handleDelete(value)}
                        />
                      ))}
                    </div>
                  )}
                >
                  {languageData.map(name => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  label='Currency'
                  value={formData.currency}
                  onChange={e => handleFormChange('currency', e.target.value)}
                >
                  <MenuItem value='usd'>USD</MenuItem>
                  <MenuItem value='euro'>EUR</MenuItem>
                  <MenuItem value='pound'>Pound</MenuItem>
                  <MenuItem value='bitcoin'>Bitcoin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap pbs-6'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
              <Button
                variant='outlined'
                type='reset'
                color='secondary'
                onClick={() => {
                  setFormData(initialData)
                  setLanguage(initialData.language)
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
