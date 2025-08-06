
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

const ChangePasswordCard = () => {
  // States
  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  const handlePasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = field => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })
  }

  return (
    <Card>
      <CardHeader title='Change Password' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label='Current Password'
              placeholder='Enter current password'
              type={showPasswords.currentPassword ? 'text' : 'password'}
              value={values.currentPassword}
              onChange={handlePasswordChange('currentPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => handleClickShowPassword('currentPassword')}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={showPasswords.currentPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}></Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label='New Password'
              placeholder='Enter new password'
              type={showPasswords.newPassword ? 'text' : 'password'}
              value={values.newPassword}
              onChange={handlePasswordChange('newPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => handleClickShowPassword('newPassword')}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={showPasswords.newPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label='Confirm New Password'
              placeholder='Confirm new password'
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              value={values.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() => handleClickShowPassword('confirmPassword')}
                      onMouseDown={e => e.preventDefault()}
                    >
                      <i className={showPasswords.confirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button variant='contained' type='submit' className='mie-4'>
              Change Password
            </Button>
            <Button variant='outlined' type='reset' color='secondary'>
              Reset
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard
