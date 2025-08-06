
'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material'

const AttendanceTable = ({ employees, attendanceData, loading, selectedMonth, selectedYear }) => {
  // Generate days for the selected month
  const daysInMonth = useMemo(() => {
    const monthIndex = new Date(Date.parse(selectedMonth + ' 1, 2024')).getMonth()
    const year = parseInt(selectedYear)
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    const days = []

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, monthIndex, day)
      const dayOfWeek = currentDate.getDay()
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      
      days.push({
        date: day,
        dayOfWeek: dayNames[dayOfWeek],
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      })
    }

    return days
  }, [selectedMonth, selectedYear])

  const getAttendanceStatus = (employeeId, date) => {
    // This would normally fetch from your attendance data
    // For demo purposes, returning random statuses
    const statuses = ['present', 'absent', 'late', 'half-day', 'holiday', 'leave']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    
    // Weekend logic
    const monthIndex = new Date(Date.parse(selectedMonth + ' 1, 2024')).getMonth()
    const year = parseInt(selectedYear)
    const currentDate = new Date(year, monthIndex, date)
    const dayOfWeek = currentDate.getDay()
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'day-off'
    }
    
    return randomStatus
  }

  const renderAttendanceCell = (status) => {
    switch (status) {
      case 'present':
        return (
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: 'success.main',
              borderRadius: '50%',
              margin: '0 auto',
            }}
          />
        )
      case 'absent':
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            X
          </Typography>
        )
      case 'late':
        return (
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: 'warning.light',
              borderRadius: '50%',
              margin: '0 auto',
            }}
          />
        )
      case 'half-day':
        return (
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: 'secondary.main',
              borderRadius: '50%',
              margin: '0 auto',
            }}
          />
        )
      case 'holiday':
        return (
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: 'warning.main',
              borderRadius: '50%',
              margin: '0 auto',
            }}
          />
        )
      case 'leave':
        return (
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: 'info.main',
              borderRadius: '50%',
              margin: '0 auto',
            }}
          />
        )
      case 'day-off':
        return (
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: 'error.main',
              borderRadius: '50%',
              margin: '0 auto',
            }}
          />
        )
      default:
        return (
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            -
          </Typography>
        )
    }
  }

  const calculateTotalPresent = (employeeId) => {
    let total = 0
    daysInMonth.forEach((day) => {
      const status = getAttendanceStatus(employeeId, day.date)
      if (status === 'present' || status === 'late') {
        total++
      } else if (status === 'half-day') {
        total += 0.5
      }
    })
    return total
  }

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading attendance data...</Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                minWidth: 200,
                backgroundColor: 'background.paper',
                borderRight: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                left: 0,
                zIndex: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Employee
              </Typography>
            </TableCell>
            {daysInMonth.map((day) => (
              <TableCell
                key={day.date}
                align="center"
                sx={{
                  minWidth: 40,
                  backgroundColor: day.isWeekend ? 'action.hover' : 'background.paper',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {day.date}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {day.dayOfWeek}
                  </Typography>
                </Box>
              </TableCell>
            ))}
            <TableCell
              align="center"
              sx={{
                minWidth: 80,
                backgroundColor: 'background.paper',
                position: 'sticky',
                right: 0,
                zIndex: 2,
                borderLeft: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Total
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} hover>
              <TableCell
                sx={{
                  backgroundColor: 'background.paper',
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={employee.avatar || ''}
                    sx={{ width: 32, height: 32 }}
                  >
                    {`${employee.firstName?.[0] || ''}${employee.lastName?.[0] || ''}`}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {`${employee.firstName} ${employee.lastName || ''}`.trim()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {employee.designation || 'Employee'}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              {daysInMonth.map((day) => (
                <TableCell
                  key={day.date}
                  align="center"
                  sx={{
                    backgroundColor: day.isWeekend ? 'action.hover' : 'transparent',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {renderAttendanceCell(getAttendanceStatus(employee.id, day.date))}
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: 'background.paper',
                  position: 'sticky',
                  right: 0,
                  zIndex: 1,
                  borderLeft: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {calculateTotalPresent(employee.id)} / {daysInMonth.length}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AttendanceTable
