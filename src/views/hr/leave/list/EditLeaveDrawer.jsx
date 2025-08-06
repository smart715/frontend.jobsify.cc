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
import Alert from '@mui/material/Alert'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const EditLeaveDrawer = ({ open, handleClose, leave, onSuccess }) => {
  // States
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      employeeId: '',
      leaveDate: null,
      duration: 'Full Day',
      leaveType: 'General',
      status: 'Pending',
      paid: false
    }
  })

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees')
        if (response.ok) {
          const data = await response.json()
          setEmployees(data)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    if (open) {
      fetchEmployees()
    }
  }, [open])

  // Reset form when leave data changes
  useEffect(() => {
    if (leave) {
      reset({
        employeeId: leave.employeeId || '',
        leaveDate: leave.leaveDate ? new Date(leave.leaveDate) : null,
        duration: leave.duration || 'Full Day',
        leaveType: leave.leaveType || 'General',
        status: leave.status || 'Pending',
        paid: leave.paid || false
      })
    }
  }, [leave, reset])

  const onSubmit = async (data) => {
    if (!leave) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/leaves/${leave.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        onSuccess()
        handleClose()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update leave')
      }
    } catch (error) {
      console.error('Error updating leave:', error)
      setError('Failed to update leave')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setError('')
    if (leave) {
      reset({
        employeeId: leave.employeeId || '',
        leaveDate: leave.leaveDate ? new Date(leave.leaveDate) : null,
        duration: leave.duration || 'Full Day',
        leaveType: leave.leaveType || '',
        status: leave.status || 'Pending',
        reason: leave.reason || '',
        attachmentFile: leave.attachmentFile || null
      })
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between p-6'>
        <Typography variant='h5'>Edit Leave</Typography>
        <IconButton size='small' onClick={handleClose}>
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
            name='employeeId'
            control={control}
            rules={{ required: 'Employee is required' }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.employeeId}>
                <InputLabel>Employee</InputLabel>
                <Select {...field} label='Employee'>
                  {employees.map(employee => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {`${employee.firstName} ${employee.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
                {errors.employeeId && (
                  <Typography variant='caption' color='error'>
                    {errors.employeeId.message}
                  </Typography>
                )}
              </FormControl>
            )}
          />

          <Controller
            name='leaveDate'
            control={control}
            rules={{ required: 'Leave date is required' }}
            render={({ field }) => (
              <AppReactDatepicker
                selected={field.value}
                onChange={field.onChange}
                placeholderText='Select Leave Date'
                customInput={
                  <TextField
                    fullWidth
                    label='Leave Date'
                    error={!!errors.leaveDate}
                    helperText={errors.leaveDate?.message}
                  />
                }
              />
            )}
          />

          <Controller
            name='duration'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select {...field} label='Duration'>
                  <MenuItem value='Full Day'>Full Day</MenuItem>
                  <MenuItem value='Half Day'>Half Day</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name='leaveType'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select {...field} label='Leave Type'>
                  <MenuItem value='General'>General</MenuItem>
                  <MenuItem value='Medical'>Medical</MenuItem>
                  <MenuItem value='Emergency'>Emergency</MenuItem>
                  <MenuItem value='Vacation'>Vacation</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select {...field} label='Status'>
                  <MenuItem value='Pending'>Pending</MenuItem>
                  <MenuItem value='Approved'>Approved</MenuItem>
                  <MenuItem value='Rejected'>Rejected</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name='paid'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Paid</InputLabel>
                <Select {...field} label='Paid' value={field.value ? 'true' : 'false'} onChange={(e) => field.onChange(e.target.value === 'true')}>
                  <MenuItem value='true'>Paid</MenuItem>
                  <MenuItem value='false'>Unpaid</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <div className='flex items-center gap-4'>
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button fullWidth variant='outlined' color='secondary' type='reset' onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default EditLeaveDrawer