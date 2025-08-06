
'use client'

// React Imports
import { useState, useEffect } from 'react'

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
import InputAdornment from '@mui/material/InputAdornment'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from '@/utils/toast'

// Vars
const initialData = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'SUPER_ADMIN'
}

const EditSuperAdminDrawer = ({ open, handleClose, userData, onSuccess }) => {
  // States
  const [formData, setFormData] = useState(initialData)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: initialData
  })

  const handleClickShowPassword = () => setIsPasswordVisible(show => !show)

  useEffect(() => {
    if (userData && open) {
      const updatedFormData = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        role: userData.role || 'SUPER_ADMIN'
      }
      setFormData(updatedFormData)
      reset(updatedFormData)
    }
  }, [userData, open, reset])

  const onSubmit = async data => {
    try {
      const response = await fetch(`/api/super-admins/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success('Super admin updated successfully!')
        handleClose()
        onSuccess && onSuccess()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to update super admin')
      }
    } catch (error) {
      console.error('Error updating super admin:', error)
      toast.error('An error occurred while updating the super admin')
    }
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
    reset(initialData)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Edit Super Admin</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          <Controller
            name='firstName'
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='First Name'
                placeholder='Enter first name'
                {...(errors.firstName && { error: true, helperText: errors.firstName.message })}
              />
            )}
          />
          <Controller
            name='lastName'
            control={control}
            rules={{ required: 'Last name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Last Name'
                placeholder='Enter last name'
                {...(errors.lastName && { error: true, helperText: errors.lastName.message })}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{ 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='email'
                label='Email'
                placeholder='Enter email'
                {...(errors.email && { error: true, helperText: errors.email.message })}
              />
            )}
          />
          <Controller
            name='role'
            control={control}
            rules={{ required: 'Role is required' }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id='role-select'>Role</InputLabel>
                <Select
                  {...field}
                  fullWidth
                  id='role-select'
                  label='Role'
                  labelId='role-select'
                  {...(errors.role && { error: true })}
                >
                  <MenuItem value='SUPER_ADMIN'>Super Admin</MenuItem>
                </Select>
                {errors.role && <Typography color='error'>{errors.role.message}</Typography>}
              </FormControl>
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Update
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default EditSuperAdminDrawer
