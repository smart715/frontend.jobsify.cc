// React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Vars
const defaultState = {
  name: '',
  date: new Date(),
  time: '',
  type: 'General',
  notes: ''
}

const PickersComponent = forwardRef(({ ...props }, ref) => (
  <TextField
    inputRef={ref}
    fullWidth
    {...props}
    label={props.label || ''}
    error={props.error}
  />
))

const CreateAppointmentDrawer = ({ open, toggle, selectedAppointment, onSubmitData, onDelete }) => {
  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const [values, setValues] = useState(defaultState)

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { name: '' } })

  const resetToStored = useCallback(() => {
    if (selectedAppointment) {
      const item = selectedAppointment
      
      setValue('name', item.name || '')
      setValues({
        name: item.name || '',
        date: item.date ? new Date(item.date) : new Date(),
        time: item.time || '',
        type: item.type || 'General',
        notes: item.notes || ''
      })
    }
  }, [selectedAppointment, setValue])

  const resetToEmpty = useCallback(() => {
    setValue('name', '')
    setValues(defaultState)
  }, [setValue])

  const handleClose = () => {
    clearErrors()
    resetToEmpty()
    toggle()
  }

  const handleFormSubmit = data => {
    const payload = {
      ...data,
      ...values
    }

    if (selectedAppointment) {
      payload.id = selectedAppointment.id
    }

    onSubmitData(payload)
    handleClose()
  }

  const ScrollWrapper = isBelowSmScreen ? 'div' : PerfectScrollbar

  useEffect(() => {
    if (selectedAppointment) {
      resetToStored()
    } else {
      resetToEmpty()
    }
  }, [open, selectedAppointment, resetToStored, resetToEmpty])

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', 400] } }}
    >
      <Box className='flex justify-between items-center sidebar-header pli-5 plb-4 border-be'>
        <Typography variant='h5'>
          {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
        </Typography>
        <Box className='flex items-center gap-2'>
          {selectedAppointment && (
            <IconButton size='small' onClick={() => onDelete(selectedAppointment.id)}>
              <i className='ri-delete-bin-7-line text-2xl' />
            </IconButton>
          )}
          <IconButton size='small' onClick={handleClose}>
            <i className='ri-close-line text-2xl' />
          </IconButton>
        </Box>
      </Box>

      <ScrollWrapper
        {...(isBelowSmScreen
          ? { className: 'bs-full overflow-y-auto overflow-x-hidden' }
          : { options: { wheelPropagation: false, suppressScrollX: true } })}
      >
        <Box className='sidebar-body p-5'>
          <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete='off'>
            <FormControl fullWidth className='mbe-5'>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label='Client Name'
                    value={value}
                    onChange={onChange}
                    {...(errors.name && { error: true, helperText: 'Name is required' })}
                  />
                )}
              />
            </FormControl>

            <div className='mbe-5'>
              <AppReactDatepicker
                id='appointment-date'
                selected={values.date}
                onChange={date => date && setValues({ ...values, date: new Date(date) })}
                customInput={<PickersComponent label='Appointment Date' />}
              />
            </div>

            <TextField
              fullWidth
              label='Time'
              type='time'
              value={values.time}
              onChange={e => setValues({ ...values, time: e.target.value })}
              className='mbe-5'
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />

            <FormControl fullWidth className='mbe-5'>
              <InputLabel id='type-select'>Type</InputLabel>
              <Select
                labelId='type-select'
                label='Type'
                value={values.type}
                onChange={e => setValues({ ...values, type: e.target.value })}
              >
                <MenuItem value='General'>General</MenuItem>
                <MenuItem value='Checkup'>Checkup</MenuItem>
                <MenuItem value='Follow-up'>Follow-up</MenuItem>
                <MenuItem value='Consultation'>Consultation</MenuItem>
              </Select>
            </FormControl>

            <TextField
              rows={4}
              multiline
              fullWidth
              className='mbe-5'
              label='Notes'
              value={values.notes}
              onChange={e => setValues({ ...values, notes: e.target.value })}
            />

            <Box className='flex gap-4 items-center'>
              <Button type='submit' variant='contained'>
                {selectedAppointment ? 'Update' : 'Create'}
              </Button>
              <Button variant='outlined' color='secondary' onClick={selectedAppointment ? resetToStored : resetToEmpty}>
                Reset
              </Button>
            </Box>
          </form>
        </Box>
      </ScrollWrapper>
    </Drawer>
  )
}

export default CreateAppointmentDrawer
