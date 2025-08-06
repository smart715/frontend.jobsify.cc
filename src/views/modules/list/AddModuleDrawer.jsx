'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Styled Components
const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AddModuleDrawer = ({ open, handleClose, module, onSuccess }) => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = Boolean(module?.id)

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      sortOrder: ''
    }
  })

  // Update form values when module prop changes
  useEffect(() => {
    if (module) {
      reset({
        name: module.name || '',
        description: module.description || '',
        isActive: module.isActive !== undefined ? module.isActive : true,
        sortOrder: module.sortOrder ? module.sortOrder.toString() : ''
      })
    } else {
      reset({
        name: '',
        description: '',
        isActive: true,
        sortOrder: ''
      })
    }
  }, [module, reset])

  const onSubmit = async data => {
    setIsSubmitting(true)

    try {
      const payload = {
        name: data.name,
        description: data.description || null,
        isActive: data.isActive,
        sortOrder: data.sortOrder ? parseInt(data.sortOrder) : null
      }

      const url = isEditMode ? `/api/modules/${module.id}` : '/api/modules'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`Module ${isEditMode ? 'updated' : 'created'} successfully:`, result)

        // Reset form
        reset()

        // Call callback to refresh the list
        if (onSuccess) {
          onSuccess(result)
        }

        // Close drawer
        handleClose()
      } else {
        const errorData = await response.json()
        console.error(`Error ${isEditMode ? 'updating' : 'creating'} module:`, errorData)
        // You might want to show an error toast here
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    handleClose()
    reset()
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
      <Header>
        <Typography variant='h5'>
          {isEditMode ? 'Edit Module' : 'Add New Module'}
        </Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='tabler-x' />
        </IconButton>
      </Header>
      <Divider />
      <div className='p-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <Controller
            name='name'
            control={control}
            rules={{ required: 'Module name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Module Name'
                placeholder='e.g., Mobile Detailing'
                error={!!errors.name}
                helperText={errors.name?.message || 'Module code will be auto-generated from the name (e.g., "Mobile Detailing" → "MD")'}
                disabled={isSubmitting}
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
                multiline
                rows={3}
                label='Description'
                placeholder='Brief description of the module'
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name='isActive'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label='Status'
                disabled={isSubmitting}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </TextField>
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
                placeholder='e.g., 1'
                disabled={isSubmitting}
              />
            )}
          />

          <div className='flex items-center gap-4'>
            <Button
              variant='contained'
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? `${isEditMode ? 'Updating' : 'Creating'}...` 
                : `${isEditMode ? 'Update' : 'Create'} Module`
              }
            </Button>
            <Button
              variant='outlined'
              color='error'
              type='reset'
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddModuleDrawer