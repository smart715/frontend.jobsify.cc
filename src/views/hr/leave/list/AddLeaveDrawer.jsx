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
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormLabel from '@mui/material/FormLabel'
import Box from '@mui/material/Box'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const AddLeaveDrawer = ({ open, handleClose, onSuccess }) => {
  // States
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeId: '',
      leaveType: '',
      status: 'Pending',
      duration: 'Full Day',
      leaveDate: null,
      reason: '',
      attachmentFile: null,
    },
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

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          paid: data.duration === 'Full Day', // Auto set paid based on duration for now
        }),
      })

      if (response.ok) {
        onSuccess()
        handleClose()
        reset()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create leave')
      }
    } catch (error) {
      console.error('Error creating leave:', error)
      setError('Failed to create leave')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setError('')
    reset({
      employeeId: '',
      leaveType: '',
      status: 'Pending',
      duration: 'Full Day',
      leaveDate: null,
      reason: '',
      attachmentFile: null,
    })
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 450 } } }}
    >
      <div className="flex items-center justify-between p-6">
        <Typography variant="h5">New Leave</Typography>
        <IconButton size="small" onClick={handleClose}>
          <i className="ri-close-line text-2xl" />
        </IconButton>
      </div>
      <Divider />
      <div className="p-6">
        <Typography variant="h6" className="mb-4">
          Assign Leave
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* First Row: Choose Member, Leave Type, Status */}
          <Box className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Controller
              name="employeeId"
              control={control}
              rules={{ required: 'Choose Member is required' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.employeeId}>
                  <InputLabel>Choose Member *</InputLabel>
                  <Select {...field} label="Choose Member *">
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {`${employee.firstName} ${employee.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.employeeId && (
                    <Typography variant="caption" color="error">
                      {errors.employeeId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="leaveType"
              control={control}
              rules={{ required: 'Leave Type is required' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.leaveType}>
                  <InputLabel>Leave Type *</InputLabel>
                  <Select {...field} label="Leave Type *">
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Medical">Medical</MenuItem>
                    <MenuItem value="Emergency">Emergency</MenuItem>
                    <MenuItem value="Vacation">Vacation</MenuItem>
                    <MenuItem value="Sick">Sick</MenuItem>
                    <MenuItem value="Personal">Personal</MenuItem>
                  </Select>
                  {errors.leaveType && (
                    <Typography variant="caption" color="error">
                      {errors.leaveType.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>

          {/* Second Row: Select Duration and Date in one row */}
          <Box className="flex flex-col gap-4">
            <Box className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" className="flex-1">
                    <FormLabel component="legend">Select Duration</FormLabel>
                    <RadioGroup {...field} row className="mt-2 flex-wrap">
                      <FormControlLabel
                        value="Full Day"
                        control={<Radio />}
                        label="Full Day"
                      />
                      <FormControlLabel
                        value="Multiple"
                        control={<Radio />}
                        label="Multiple"
                      />
                      <FormControlLabel
                        value="First Half"
                        control={<Radio />}
                        label="First Half"
                      />
                      <FormControlLabel
                        value="Second Half"
                        control={<Radio />}
                        label="Second Half"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />

              <Controller
                name="leaveDate"
                control={control}
                rules={{ required: 'Date is required' }}
                render={({ field }) => (
                  <Box className="md:w-100 w-full md:mt-6">
                    <AppReactDatepicker
                      selected={field.value}
                      onChange={field.onChange}
                      placeholderText="Select Date"
                      dateFormat="MM-dd-yyyy"
                      customInput={
                        <TextField
                          fullWidth
                          label="Date *"
                          error={!!errors.leaveDate}
                          helperText={errors.leaveDate?.message}
                        />
                      }
                    />
                  </Box>
                )}
              />
            </Box>
          </Box>

          {/* Reason for absence */}
          <Controller
            name="reason"
            control={control}
            rules={{ required: 'Reason for absence is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label="Reason for absence *"
                placeholder="e.g. Feeling not well"
                error={!!errors.reason}
                helperText={errors.reason?.message}
              />
            )}
          />

          {/* Add File */}
          <Box>
            <Typography variant="body2" className="mb-2">
              Add File <i className="ri-information-line text-sm" />
            </Typography>
            <Controller
              name="attachmentFile"
              control={control}
              render={({ field }) => (
                <Box
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    hidden
                    onChange={(e) => field.onChange(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <i className="ri-upload-cloud-line text-3xl text-gray-400 mb-2" />
                  <Typography variant="body2" color="textSecondary">
                    Choose a file
                  </Typography>
                </Box>
              )}
            />
          </Box>

          <div className="flex items-center gap-4 mt-6">
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={<i className="ri-save-line" />}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              type="reset"
              onClick={handleReset}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddLeaveDrawer
