'use client'

import { useState, useEffect } from 'react'
import { 
  Drawer, 
  Button, 
  Typography, 
  IconButton, 
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

const AddFeatureDrawer = ({ open, handleClose, feature, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      sortOrder: ''
    }
  })

  useEffect(() => {
    console.log('Feature prop changed:', feature) // Debug log
    console.log('Drawer open state:', open) // Debug log
    if (open && feature) {
      // For editing existing feature
      console.log('Resetting form with feature data:', feature) // Debug log
      reset({
        name: feature.name || '',
        description: feature.description || '',
        isActive: feature.isActive ?? true,
        sortOrder: feature.sortOrder || ''
      })
    } else if (open && !feature) {
      // For adding new feature
      console.log('Resetting form for new feature') // Debug log
      reset({
        name: '',
        description: '',
        isActive: true,
        sortOrder: ''
      })
    }
  }, [feature, reset, open])

  // Additional effect to handle when drawer opens with a feature
  useEffect(() => {
    if (open && feature) {
      console.log('Drawer opened with feature for editing:', feature)
    }
  }, [open, feature])

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    try {
      const url = feature ? `/api/features/${feature.id}` : '/api/features'
      const method = feature ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          sortOrder: data.sortOrder ? parseInt(data.sortOrder) : null
        })
      })

      if (response.ok) {
        onSuccess()
        handleClose()
        reset()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save feature')
      }
    } catch (error) {
      console.error('Error saving feature:', error)
      setError('Failed to save feature')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setError('')
    if (feature) {
      reset({
        name: feature.name || '',
        description: feature.description || '',
        isActive: feature.isActive ?? true,
        sortOrder: feature.sortOrder || ''
      })
    } else {
      reset({
        name: '',
        description: '',
        isActive: true,
        sortOrder: ''
      })
    }
  }

  const handleDrawerClose = () => {
    setError('')
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleDrawerClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between p-6'>
        <Typography variant='h5'>
          {feature ? 'Edit Feature' : 'Add Feature'}
        </Typography>
        <IconButton size='small' onClick={handleDrawerClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
          {error && (
            <Alert severity='error' className='mb-4'>
              {error}
            </Alert>
          )}

          <Controller
            name='name'
            control={control}
            rules={{ required: 'Feature name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Feature Name'
                placeholder='Enter feature name'
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Description'
                placeholder='Enter feature description'
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          <Controller
            name='sortOrder'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='number'
                label='Sort Order'
                placeholder='Enter sort order'
                error={!!errors.sortOrder}
                helperText={errors.sortOrder?.message}
              />
            )}
          />

          <Controller
            name='isActive'
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                  />
                }
                label='Active'
              />
            )}
          />

          <div className='flex items-center gap-4'>
            <Button
              fullWidth
              variant='contained'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Saving...' : (feature ? 'Update' : 'Submit')}
            </Button>
            <Button
              fullWidth
              variant='outlined'
              color='secondary'
              type='reset'
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddFeatureDrawer