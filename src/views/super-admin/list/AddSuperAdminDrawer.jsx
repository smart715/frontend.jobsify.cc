'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

const AddSuperAdminDrawer = ({ open, setOpen, onSuccess }) => {
  // States
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      userRole: 'SUPER_ADMIN',
    },
  })

  const handleClose = () => {
    setOpen(false)
    reset()
    setSelectedFile(null)
    setPreviewUrl('')
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Generate a temporary password for the super admin
      const tempPassword = 'TempPass123!'
      
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: tempPassword
      }

      const response = await fetch('/api/super-admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onSuccess()
        handleClose()
      } else {
        const errorData = await response.json()
        console.error('Error creating super admin:', errorData.error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    reset()
    setSelectedFile(null)
    setPreviewUrl('')
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className="flex items-center justify-between pli-6 plb-5">
        <Typography variant="h5">Create Superadmin</Typography>
        <IconButton size="small" onClick={handleClose}>
          <i className="ri-close-line" />
        </IconButton>
      </div>
      <Divider />
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    placeholder="e.g. John"
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    placeholder="e.g. Doe"
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email (Temporary password will be emailed)"
                    placeholder="e.g. johndoe@example.com"
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="userRole"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>User Role</InputLabel>
                    <Select {...field} label="User Role">
                      <MenuItem value="SUPER_ADMIN">Superadmin</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            

            <Grid item xs={12}>
              <div className="flex items-center gap-4">
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outlined" type="button" onClick={handleReset}>
                  Cancel
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
    </Drawer>
  )
}

export default AddSuperAdminDrawer
