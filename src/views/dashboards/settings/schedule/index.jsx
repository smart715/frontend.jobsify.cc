"use client"

import { useState, useEffect, forwardRef, useCallback } from 'react'

import Grid from '@mui/material/Grid2'

import {
  Card,
  CardContent,
  Typography,
  Switch,
  IconButton,
  Button,
  TextField,
  Divider,
  Box,
} from '@mui/material'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

import { RiAddCircleLine, RiAddLine, RiCloseLine, RiDeleteBinLine, RiEdit2Fill, RiPencilLine } from 'react-icons/ri'

import { format, addDays, isValid, isSameDay } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const defaultTimeSlot = { start: '08:00', end: '18:00' }

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const ScheduleTab = () => {

  const [editorVisibility, setEditorVisibility] = useState(() =>
    daysOfWeek.reduce((acc, _, idx) => ({ ...acc, [idx]: false }), {})
  )

  const [schedule, setSchedule] = useState(
    daysOfWeek.map((day, i) => ({
      name: day,
      enabled: i !== 0,
      periods: i !== 0 ? [{ ...defaultTimeSlot }] : []
    }))
  )

  const handleToggle = (index) => {
    const updated = [...schedule]

    updated[index].enabled = !updated[index].enabled

    if (updated[index].enabled && updated[index].periods.length === 0) {
      updated[index].periods.push({ ...defaultTimeSlot })
    }

    setSchedule(updated)

    if(updated[index].enabled){
      setEditorVisibility(prev => ({
        ...prev,
        [index]: true
      }))
    }
  }

  const handleTimeChange = (dayIdx, periodIdx, field, value) => {
    const updated = [...schedule]

    updated[dayIdx].periods[periodIdx][field] = value
    setSchedule(updated)
  }

  const addTimePeriod = (dayIdx) => {
    const updated = [...schedule]

    updated[dayIdx].periods.push({ ...defaultTimeSlot })
    setSchedule(updated)
  }

  const removeTimePeriod = (dayIdx, periodIdx) => {
    const updated = [...schedule]
    
    updated[dayIdx].periods.splice(periodIdx, 1)
    setSchedule(updated)
  }

  const [scheduleDays, setScheduleDays] = useState([])
  const [days, setDays] = useState([])
  const [pickerType, setPickerType] = useState('Single Day')
  const [date, setDate] = useState(new Date())
  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 1))
  const [showAddSection, setShowAddSection] = useState(false)

  const [showAddScheduleSection, setShowAddScheduleSection] = useState(false)
  const [newPeriods, setNewPeriods] = useState([{ start: '08:00', end: '18:00' }])
  const [editingIndex, setEditingIndex] = useState(null);

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates

    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleAddDay = () => {
    if (pickerType === 'Single Day') {
      if (date) {
        setDays(prev => [...prev, { start: date, end: date }])
        setDate(new Date())
      }
    } else {
      if (startDateRange && endDateRange) {
        setDays(prev => [...prev, { start: startDateRange, end: endDateRange }])
        setStartDateRange(new Date())
        setEndDateRange(addDays(new Date(), 1))
      }
    }
  
    // Close the add section after saving
    setShowAddSection(false)
  }

  const handleScheduleAddDay = () => {
    const periods = newPeriods.filter(p => p.start && p.end);
  
    if (periods.length === 0) return;
  
    const newEntry = pickerType === 'Single Day'
      ? { start: date, end: date, periods }
      : { start: startDateRange, end: endDateRange, periods };
  
    if (editingIndex !== null) {
      const updated = [...scheduleDays];
      
      updated[editingIndex] = newEntry;
      setScheduleDays(updated);
    } else {
      setScheduleDays(prev => [...prev, newEntry]);
    }
  
    // Reset form
    setEditingIndex(null);
    setDate(new Date());
    setStartDateRange(new Date());
    setEndDateRange(addDays(new Date(), 1));
    setNewPeriods([{ start: '08:00', end: '18:00' }]);
    setShowAddScheduleSection(false);
  };

  const handleScheduleTimeChange = (idx, field, value) => {
    const updated = [...newPeriods]

    updated[idx][field] = value
    setNewPeriods(updated)
  }
  
  const addScheduleTimePeriod = () => {
    setNewPeriods([...newPeriods, { start: '08:00', end: '18:00' }])
  }
  
  const removeScheduleTimePeriod = (idx) => {
    const updated = newPeriods.filter((_, i) => i !== idx)

    setNewPeriods(updated)
  }

  const CustomInputSingle = forwardRef(({ value, onClick, label }, ref) => {
    let displayValue = ''
    const parsedDate = new Date(value)
  
    if (isValid(parsedDate)) {
      displayValue = format(parsedDate, 'MM/dd/yyyy')
    }
  
    return (
      <TextField
        fullWidth
        inputRef={ref}
        onClick={onClick}
        label={label}
        value={displayValue}
        readOnly
      />
    )
  })

  const CustomInputRange = forwardRef((props, ref) => {
    const { label, start, end, ...rest } = props

    const startDate = format(start, 'MM/dd/yyyy')
    const endDate = end !== null ? ` - ${format(end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <TextField fullWidth inputRef={ref} {...rest} label={label} value={value} />
  })
  
  return (
    <Grid container spacing={10} sx={{mt: 3}}>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>General Weekly Schedule</Typography>
          </div>
          <Card>
            <CardContent>
              {schedule.map((day, dayIdx) => (
                <div key={day.name}>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid size={{ xs: 10 }}>
                      <Switch
                        checked={day.enabled}
                        onChange={() => handleToggle(dayIdx)}
                      />
                      <Typography
                        variant='subtitle1'
                        component="span"
                        style={{
                          color: day.enabled ? 'var(--secondary-color)' : 'var(--mui-palette-error-main)',
                          textDecoration: day.enabled ? 'none' : 'line-through',
                          opacity: day.enabled ? 1 : 0.5,
                          cursor: 'pointer'
                        }}
                        onClick={() =>
                          setEditorVisibility(prev => ({
                            ...prev,
                            [dayIdx]: !prev[dayIdx]
                          }))
                        }
                      >
                        {day.name}
                      </Typography>
                    </Grid>
                    {day.enabled && (
                      <Grid size={{ xs: 2 }} sx={{display: 'flex', alignItems: 'center'}} onClick={() =>
                        setEditorVisibility(prev => ({
                          ...prev,
                          [dayIdx]: !prev[dayIdx]
                        }))
                      }>
                        <Typography variant="body2" color="text.secondary" sx={{cursor: 'pointer'}}>
                          {day.periods[0].start}am–{day.periods[0].end}pm
                        </Typography>
                        <IconButton size="small">
                          <RiPencilLine size={18} />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>

                  {day.enabled && editorVisibility[dayIdx] && day.periods.map((period, periodIdx) => (
                    <Grid container spacing={6} key={periodIdx} sx={{marginTop: 5, marginBottom: 5}}>
                      <Grid size={{ xs: 5 }}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Start"
                          value={period.start}
                          onChange={(e) => handleTimeChange(dayIdx, periodIdx, 'start', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 5 }}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Finish"
                          value={period.end}
                          onChange={(e) => handleTimeChange(dayIdx, periodIdx, 'end', e.target.value)}
                        />
                      </Grid>
                      {day.periods.length > 1 && (
                        <Grid item xs={2}>
                          <IconButton onClick={() => removeTimePeriod(dayIdx, periodIdx)} color="error">
                            <RiCloseLine size={20} />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  ))}

                  {/* Add another period */}
                  {day.enabled && editorVisibility[dayIdx] && (
                    <Button
                      onClick={() => addTimePeriod(dayIdx)}
                      startIcon={<RiAddLine />}
                      variant="outlined"
                      color='secondary'
                      sx={{ mb: 2, borderStyle: 'dashed', width: '100%' }}
                    >
                      Add another work period for {day.name}
                    </Button>
                  )}

                  <Divider sx={{ mb: 2 }} />
                </div>
              ))}

              <Grid container justifyContent="flex-end">
                <Button variant="contained" className='mt-5'>Save Weekly Schedule</Button>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>General Weekly Schedule</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6}>
              {scheduleDays.map((d, idx) => {
                const isRange = !isSameDay(d.start, d.end)
                const sameMonth = format(d.start, 'MMM') === format(d.end, 'MMM')

                return (
                  <Grid key={idx} sx={{textAlign: 'center'}}>
                    <Box
                      sx={{
                        border: '1px solid',
                        borderRadius: 1,
                        py: 5,
                        px: 2,
                        textAlign: 'center',
                        position: 'relative',
                        minWidth: '100px',
                        height: '100px',
                        '&:hover .schedule-actions': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        className="schedule-actions"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          left: 4,
                          right: 4,
                          display: 'flex',
                          justifyContent: 'space-between',
                          px: 1,
                          opacity: 0,
                          transition: 'opacity 0.2s ease-in-out',
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => {
                            const item = scheduleDays[idx];

                            setPickerType(isSameDay(item.start, item.end) ? 'Single Day' : 'Date Range');
                            setDate(item.start);
                            setStartDateRange(item.start);
                            setEndDateRange(item.end);
                            setNewPeriods(item.periods || []);
                            setEditingIndex(idx);
                            setShowAddScheduleSection(true);
                          }}
                        >
                          <RiEdit2Fill size={16} />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => setScheduleDays(scheduleDays.filter((_, i) => i !== idx))}
                          color="error"
                        >
                          <RiDeleteBinLine size={16} />
                        </IconButton>
                      </Box>
                      {/* Date or Date Range */}
                      <Typography color="error" variant="h4" className='px-2'>
                        {isRange
                          ? `${format(d.start, 'dd')}–${format(d.end, 'dd')}`
                          : format(d.start, 'dd')}
                      </Typography>
                      <Divider />
                      <Typography color="error" variant="h4" className='px-2'>
                        {isRange
                          ? sameMonth
                            ? format(d.start, 'MMM')
                            : `${format(d.start, 'MMM')} – ${format(d.end, 'MMM')}`
                          : format(d.start, 'MMM')}
                      </Typography>

                      {/* Show time periods */}
                     

                      {/* Delete button */}
                      {/* <IconButton
                        size="small"
                        onClick={() => setScheduleDays(scheduleDays.filter((_, i) => i !== idx))}
                        sx={{ position: 'absolute', top: 4, right: 4 }}
                      >
                        <RiDeleteBinLine size={16} />
                      </IconButton> */}
                    </Box>
                    <Box mt={2}>
                      {d.periods?.map((p, pidx) => (
                        <Typography
                          key={pidx}
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          {p.start} – {p.end}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                )
              })}
                <Grid>
                  <Button
                    sx={{
                      border: '1px dashed',
                      p: 5,
                      textAlign: 'center',
                      height: '100px',
                      flexDirection: 'column'
                    }}
                    onClick={() =>{setNewPeriods([{ start: '08:00', end: '18:00' }]); setShowAddScheduleSection(true);}}
                  >
                    <RiAddCircleLine />
                    <Typography>Add Day</Typography>
                  </Button>
                </Grid>
              </Grid>

              {showAddScheduleSection && (
                <Box mt={4} p={3} border="1px dashed grey" borderRadius={2}>
                  {/* Type Picker */}
                  <FormControl fullWidth>
                    <InputLabel id='type-select-label'>Type</InputLabel>
                    <Select
                      label='Type'
                      id='type-select'
                      labelId='type-select-label'
                      value={pickerType}
                      onChange={(e) => setPickerType(e.target.value)}
                    >
                      <MenuItem value='Single Day'>Single Day</MenuItem>
                      <MenuItem value='Date Range'>Date Range</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Date Inputs */}
                  <Box mt={3}>
                    {pickerType === 'Single Day' && (
                      <AppReactDatepicker
                        selected={date}
                        id='single-date-picker'
                        onChange={date => setDate(date)}
                        placeholderText='Click to select a date'
                        customInput={<CustomInputSingle label='Select Single Day' />}
                      />
                    )}

                    {pickerType === 'Date Range' && (
                      <AppReactDatepicker
                        selectsRange
                        monthsShown={2}
                        selected={startDateRange}
                        startDate={startDateRange}
                        endDate={endDateRange}
                        shouldCloseOnSelect={false}
                        id='date-range-picker'
                        onChange={handleOnChangeRange}
                        customInput={<CustomInputRange label='Select Date Range' start={startDateRange} end={endDateRange} />}
                      />
                    )}
                  </Box>


                  {newPeriods.map((period, periodIdx) => (
                    <Grid container spacing={6} key={periodIdx} sx={{marginTop: 5, marginBottom: 5}}>
                      <Grid size={{ xs: 5 }}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Start"
                          value={period.start}
                          onChange={(e) => handleScheduleTimeChange(periodIdx, 'start', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 5 }}>
                        <TextField
                          fullWidth
                          type="time"
                          label="Finish"
                          value={period.end}
                          onChange={(e) => handleScheduleTimeChange(periodIdx, 'end', e.target.value)}
                        />
                      </Grid>
                      {newPeriods.length > 1 && (
                        <Grid item xs={2}>
                          <IconButton onClick={() => removeScheduleTimePeriod(periodIdx)} color="error">
                            <RiCloseLine size={20} />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  ))}

                  {/* Add another period */}
                  <Button
                    onClick={() => addScheduleTimePeriod()}
                    startIcon={<RiAddLine />}
                    variant="outlined"
                    color='secondary'
                    sx={{ mb: 2, borderStyle: 'dashed', width: '100%' }}
                  >
                    Add another work period
                  </Button>

                  {/* Save and Cancel */}
                  <Box mt={3} display="flex" gap={2}>
                    <Button variant="contained" onClick={handleScheduleAddDay}>Save</Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        setEditingIndex(null);
                        setShowAddScheduleSection(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Holidays & Days Off</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6}>
                {days.map((d, idx) => {
                  const isRange = !isSameDay(d.start, d.end)
                  const sameMonth = format(d.start, 'MMM') === format(d.end, 'MMM')

                  return (
                    <Grid key={idx}>
                      <Box
                         sx={{
                          border: '1px solid',
                          borderRadius: 1,
                          py: 5,
                          px: 2,
                          textAlign: 'center',
                          position: 'relative',
                          minWidth: '100px',
                          height: '100px',
                          '&:hover .holiday-actions': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Box
                        className="holiday-actions"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          display: 'flex',
                          justifyContent: 'space-between',
                          px: 1,
                          opacity: 0,
                          transition: 'opacity 0.2s ease-in-out',
                        }}
                      >
                         <IconButton
                          size="small"
                          onClick={() => setDays(days.filter((_, i) => i !== idx))}
                          sx={{ position: 'absolute', top: 4, right: 4 }}
                          color="error"
                        >
                          <RiDeleteBinLine size={16} />
                        </IconButton>
                      </Box>
                       <Typography
                          variant='h4'
                          style={{
                            color: 'var(--mui-palette-error-main)'
                          }}
                          className='px-2'
                        >
                          {isRange
                            ? `${format(d.start, 'dd')}–${format(d.end, 'dd')}`
                            : format(d.start, 'dd')}
                        </Typography>
                        <Divider/>
                        <Typography
                          variant='h4'
                          style={{
                            color: 'var(--mui-palette-error-main)'
                          }}
                          className='px-2'
                        >
                          {isRange
                            ? sameMonth
                              ? format(d.start, 'MMM')
                              : `${format(d.start, 'MMM')} – ${format(d.end, 'MMM')}`
                            : format(d.start, 'MMM')}
                        </Typography>
                       
                      </Box>
                    </Grid>
                  )
                })}
                <Grid>
                  <Button
                    sx={{
                      border: '1px dashed',
                      p: 5,
                      textAlign: 'center',
                      height: '100px',
                      flexDirection: 'column'
                    }}
                    onClick={() => setShowAddSection(true)}
                  >
                    <RiAddCircleLine />
                    <Typography>Add Day</Typography>
                  </Button>
                </Grid>
              </Grid>

              {showAddSection && (
                <Box mt={4} p={3} border="1px dashed grey" borderRadius={2}>
                  {/* Type Picker */}
                  <FormControl fullWidth>
                    <InputLabel id='type-select-label'>Type</InputLabel>
                    <Select
                      label='Type'
                      id='type-select'
                      labelId='type-select-label'
                      value={pickerType}
                      onChange={(e) => setPickerType(e.target.value)}
                    >
                      <MenuItem value='Single Day'>Single Day</MenuItem>
                      <MenuItem value='Date Range'>Date Range</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Date Inputs */}
                  <Box mt={3}>
                    {pickerType === 'Single Day' && (
                      <AppReactDatepicker
                        selected={date}
                        id='single-date-picker'
                        onChange={date => setDate(date)}
                        placeholderText='Click to select a date'
                        customInput={<CustomInputSingle label='Select Single Day' />}
                      />
                    )}

                    {pickerType === 'Date Range' && (
                      <AppReactDatepicker
                        selectsRange
                        monthsShown={2}
                        selected={startDateRange}
                        startDate={startDateRange}
                        endDate={endDateRange}
                        shouldCloseOnSelect={false}
                        id='date-range-picker'
                        onChange={handleOnChangeRange}
                        customInput={<CustomInputRange label='Select Date Range' start={startDateRange} end={endDateRange} />}
                      />
                    )}
                  </Box>

                  {/* Save and Cancel */}
                  <Box mt={3} display="flex" gap={2}>
                    <Button variant="contained" onClick={handleAddDay}>Save</Button>
                    <Button variant="outlined" color="secondary" onClick={() => setShowAddSection(false)}>Cancel</Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </div>
      </Grid>
    </Grid>
  )
}

export default ScheduleTab
