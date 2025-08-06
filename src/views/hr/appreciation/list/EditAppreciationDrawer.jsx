
'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import {
  Drawer,
  Typography,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Paper,
  Stack,
  InputAdornment,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useForm, Controller } from 'react-hook-form'

const EditAppreciationDrawer = ({ open, handleClose, onSuccess, appreciationData }) => {
  const [employees, setEmployees] = useState([])
  const [photoFile, setPhotoFile] = useState(null)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      award: '',
      givenTo: '',
      givenOn: '',
      summary: '',
    },
  })

  useEffect(() => {
    if (appreciationData && open) {
      setValue('award', appreciationData.award || '')
      setValue('givenTo', appreciationData.givenTo || '')
      setValue('givenOn', appreciationData.givenOn ? appreciationData.givenOn.split('T')[0] : '')
      setValue('summary', appreciationData.summary || '')
    }
  }, [appreciationData, open, setValue])

  const handleFormSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        photo: photoFile,
        updatedAt: new Date().toISOString(),
      }
      
      const response = await fetch(`/api/appreciations/${appreciationData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        onSuccess()
        reset()
        setPhotoFile(null)
        handleClose()
      } else {
        console.error('Failed to update appreciation')
      }
    } catch (error) {
      console.error('Error updating appreciation:', error)
    }
  }

  const handleDrawerClose = () => {
    handleClose()
    reset()
    setPhotoFile(null)
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setPhotoFile(file)
    }
  }

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

  React.useEffect(() => {
    if (open) {
      fetchEmployees()
    }
  }, [open])

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleDrawerClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 600 },
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Edit Appreciation
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleDrawerClose}
            sx={{ color: 'text.secondary' }}
          >
            <i className="ri-close-line text-xl" />
          </IconButton>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="h-full">
          <Box sx={{ p: 3, pb: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="award"
                    control={control}
                    rules={{ required: 'Award is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth size="medium">
                        <InputLabel>Award</InputLabel>
                        <Select {...field} label="Award" error={!!errors.award}>
                          <MenuItem value="Best Project Manager">Best Project Manager</MenuItem>
                          <MenuItem value="Best Quality Control">Best Quality Control</MenuItem>
                          <MenuItem value="Employee of the Month">Employee of the Month</MenuItem>
                          <MenuItem value="Best Technical Writer">Best Technical Writer</MenuItem>
                          <MenuItem value="Top Sales Performer">Top Sales Performer</MenuItem>
                          <MenuItem value="Best New Hire">Best New Hire</MenuItem>
                          <MenuItem value="Best Mentor">Best Mentor</MenuItem>
                          <MenuItem value="Best Team Player">Best Team Player</MenuItem>
                          <MenuItem value="Most Improved Employee">Most Improved Employee</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="givenTo"
                    control={control}
                    rules={{ required: 'Employee is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth size="medium">
                        <InputLabel>Given To</InputLabel>
                        <Select
                          {...field}
                          label="Given To"
                          error={!!errors.givenTo}
                          startAdornment={
                            <InputAdornment position="start">
                              <i className="ri-user-3-line text-lg" />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="">
                            <em>Select Employee</em>
                          </MenuItem>
                          {employees.map((employee) => (
                            <MenuItem
                              key={employee.id}
                              value={`${employee.firstName} ${employee.lastName || ''}`.trim()}
                            >
                              {`${employee.firstName} ${employee.lastName || ''}`.trim()}
                              {employee.designation && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ ml: 1 }}
                                >
                                  - {employee.designation}
                                </Typography>
                              )}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Controller
                      name="givenOn"
                      control={control}
                      rules={{ required: 'Date is required' }}
                      render={({ field: { onChange, value, ...field } }) => (
                        <DatePicker
                          {...field}
                          label="Date"
                          value={value ? new Date(value) : null}
                          onChange={(newValue) => {
                            onChange(newValue ? newValue.toISOString().split('T')[0] : '')
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              size="medium"
                              error={!!errors.givenOn}
                              helperText={errors.givenOn?.message}
                            />
                          )}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'medium',
                              error: !!errors.givenOn,
                              helperText: errors.givenOn?.message,
                            }
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="summary"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Summary"
                        multiline
                        rows={4}
                        placeholder="Enter appreciation summary..."
                        size="medium"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                      Photo
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'action.hover',
                        },
                      }}
                      onClick={() => document.getElementById('photo-upload-edit').click()}
                    >
                      <i className="ri-upload-cloud-2-line text-4xl text-gray-400 mb-2" />
                      <Typography variant="body2" color="text.secondary">
                        {photoFile ? photoFile.name : 'Choose a file'}
                      </Typography>
                      <input
                        id="photo-upload-edit"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Footer Actions */}
          <Box
            sx={{
              p: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              position: 'sticky',
              bottom: 0,
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDrawerClose}
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                startIcon={<i className="ri-save-line" />}
                sx={{ minWidth: 120 }}
              >
                Update
              </Button>
            </Stack>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default EditAppreciationDrawer
