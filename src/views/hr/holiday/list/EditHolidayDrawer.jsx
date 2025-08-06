
// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const EditHolidayDrawer = ({ open, handleClose, onSubmit, holidayData, dictionary }) => {
  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      date: null,
      type: '',
      description: '',
      status: 'Active'
    }
  })

  useEffect(() => {
    if (holidayData) {
      setValue('name', holidayData.name || '')
      setValue('date', holidayData.date ? new Date(holidayData.date) : null)
      setValue('type', holidayData.type || '')
      setValue('description', holidayData.description || '')
      setValue('status', holidayData.status || 'Active')
    }
  }, [holidayData, setValue])

  const onFormSubmit = data => {
    onSubmit(data)
    reset()
    handleClose()
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
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Edit Holiday</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(onFormSubmit)} className='flex flex-col gap-5'>
          <Controller
            name='name'
            control={control}
            rules={{ required: 'Holiday name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Holiday Name'
                placeholder='Enter holiday name'
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name='date'
            control={control}
            rules={{ required: 'Date is required' }}
            render={({ field }) => (
              <AppReactDatepicker
                selected={field.value}
                onChange={field.onChange}
                placeholderText='Select Date'
                customInput={
                  <TextField
                    fullWidth
                    label='Date'
                    error={!!errors.date}
                    helperText={errors.date?.message}
                  />
                }
              />
            )}
          />

          <Controller
            name='type'
            control={control}
            rules={{ required: 'Type is required' }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Type</InputLabel>
                <Select {...field} label='Type'>
                  <MenuItem value='Public'>Public</MenuItem>
                  <MenuItem value='Company'>Company</MenuItem>
                  <MenuItem value='Optional'>Optional</MenuItem>
                </Select>
                {errors.type && (
                  <Typography variant='caption' color='error'>
                    {errors.type.message}
                  </Typography>
                )}
              </FormControl>
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
                placeholder='Enter description'
              />
            )}
          />

          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select {...field} label='Status'>
                  <MenuItem value='Active'>Active</MenuItem>
                  <MenuItem value='Inactive'>Inactive</MenuItem>
                </Select>
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

export default EditHolidayDrawer
