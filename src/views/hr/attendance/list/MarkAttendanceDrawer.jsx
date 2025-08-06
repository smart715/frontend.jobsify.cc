
'use client'

import { useState } from 'react'
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
  Stack,
  Paper,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

const MarkAttendanceDrawer = ({ open, handleClose, onSubmit, employees, departments, dictionary }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      department: '',
      employees: [],
      markBy: 'Month',
      year: '2025',
      month: 'July',
      date: '',
      clockIn: '09:00 AM',
      clockInLocation: 'Worksite',
      clockInWorkingFrom: 'Office',
      clockOut: '06:00 PM',
      clockOutLocation: 'Worksite',
      clockOutWorkingFrom: 'Office',
      late: 'No',
      halfDay: 'No',
      attendanceOverwrite: false,
    },
  })

  const watchMarkBy = watch('markBy')

  const handleFormSubmit = (data) => {
    onSubmit(data)
    reset()
  }

  const handleDrawerClose = () => {
    handleClose()
    reset()
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = ['2023', '2024', '2025', '2026']

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleDrawerClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 600, md: 700 },
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Mark Attendance
          </Typography>
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
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ p: 3 }}>
            {/* Attendance Details Section */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Attendance Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Department</InputLabel>
                        <Select {...field} label="Department">
                          <MenuItem value="">--</MenuItem>
                          {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="employees"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Employees *</InputLabel>
                        <Select
                          {...field}
                          multiple
                          label="Employees *"
                          renderValue={(selected) =>
                            selected.length === 0 ? 'Nothing selected' : `${selected.length} selected`
                          }
                        >
                          {employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.id}>
                              <Checkbox checked={field.value.indexOf(employee.id) > -1} />
                              {`${employee.firstName} ${employee.lastName || ''}`.trim()}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>

              {/* Mark Attendance By */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Mark Attendance By
                </Typography>
                <Controller
                  name="markBy"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      row
                      sx={{ gap: 3 }}
                    >
                      <FormControlLabel
                        value="Month"
                        control={<Radio />}
                        label="Month"
                      />
                      <FormControlLabel
                        value="Date"
                        control={<Radio />}
                        label="Date"
                      />
                    </RadioGroup>
                  )}
                />
              </Box>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="year"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Year *</InputLabel>
                        <Select {...field} label="Year *">
                          {years.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                {watchMarkBy === 'Month' ? (
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="month"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Month *</InputLabel>
                          <Select {...field} label="Month *">
                            {months.map((month) => (
                              <MenuItem key={month} value={month}>
                                {month}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Date *"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* Clock In/Out Section */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={3}>
                {/* Clock In */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Clock In *
                  </Typography>
                  <Controller
                    name="clockIn"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder="09:00 AM"
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Location
                  </Typography>
                  <Controller
                    name="clockInLocation"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select {...field} displayEmpty>
                          <MenuItem value="Worksite">Worksite</MenuItem>
                          <MenuItem value="Office">Office</MenuItem>
                          <MenuItem value="Remote">Remote</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Working From *
                  </Typography>
                  <Controller
                    name="clockInWorkingFrom"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <Select {...field} displayEmpty>
                          <MenuItem value="Office">Office</MenuItem>
                          <MenuItem value="Home">Home</MenuItem>
                          <MenuItem value="Client Site">Client Site</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Clock Out */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Clock Out
                  </Typography>
                  <Controller
                    name="clockOut"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder="06:00 PM"
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Location
                  </Typography>
                  <Controller
                    name="clockOutLocation"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select {...field} displayEmpty>
                          <MenuItem value="Worksite">Worksite</MenuItem>
                          <MenuItem value="Office">Office</MenuItem>
                          <MenuItem value="Remote">Remote</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Working From *
                  </Typography>
                  <Controller
                    name="clockOutWorkingFrom"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <Select {...field} displayEmpty>
                          <MenuItem value="Office">Office</MenuItem>
                          <MenuItem value="Home">Home</MenuItem>
                          <MenuItem value="Client Site">Client Site</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Additional Options */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Late
                  </Typography>
                  <Controller
                    name="late"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                      </RadioGroup>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Half Day
                  </Typography>
                  <Controller
                    name="halfDay"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio />} label="No" />
                      </RadioGroup>
                    )}
                  />
                </Grid>
              </Grid>

              <Controller
                name="attendanceOverwrite"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} />}
                    label="Attendance Overwrite"
                    sx={{ mt: 2 }}
                  />
                )}
              />
            </Paper>
          </Box>

          {/* Footer Actions */}
          <Box
            sx={{
              p: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleDrawerClose}
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                color="error"
                sx={{ minWidth: 100 }}
              >
                Save
              </Button>
            </Stack>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default MarkAttendanceDrawer
