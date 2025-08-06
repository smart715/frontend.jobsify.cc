
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

// Third-party Imports
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns'

// Component Imports
import CalendarHeader from './CalendarHeader'
import WeeklyCalendarGrid from './WeeklyCalendarGrid'
import StaffSidebar from './StaffSidebar'

const StaffCalendarView = () => {
  // States
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedStaff, setSelectedStaff] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [viewOptions, setViewOptions] = useState('week')

  // Mock staff data
  const staffMembers = [
    {
      id: 1,
      name: 'Chad Brookshire',
      avatar: '/images/avatars/1.png',
      color: '#FFB84D',
      shifts: [
        {
          id: 1,
          date: '2024-04-01',
          startTime: '14:00',
          endTime: '17:00',
          title: '2:00p - 5:00p'
        }
      ]
    },
    {
      id: 2,
      name: 'Mike Jones',
      avatar: '/images/avatars/2.png',
      color: '#28C76F',
      shifts: []
    }
  ]

  // Get week dates
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday start
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Navigation handlers
  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1))
  }

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
      {/* Left Sidebar */}
      <StaffSidebar
        staffMembers={staffMembers}
        selectedStaff={selectedStaff}
        setSelectedStaff={setSelectedStaff}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Calendar Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Calendar Header */}
        <CalendarHeader
          currentDate={currentDate}
          viewOptions={viewOptions}
          setViewOptions={setViewOptions}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
        />

        {/* Calendar Grid */}
        <WeeklyCalendarGrid
          weekDays={weekDays}
          staffMembers={staffMembers}
          selectedStaff={selectedStaff}
        />
      </Box>
    </Box>
  )
}

export default StaffCalendarView
