
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

// Third-party Imports
import { format } from 'date-fns'

const WeeklyCalendarGrid = ({ weekDays, staffMembers, selectedStaff }) => {
  const [draggedShift, setDraggedShift] = useState(null)

  const handleShiftClick = (shift) => {
    // Handle shift click
    console.log('Shift clicked:', shift)
  }

  const getDayShifts = (date, staffId) => {
    const staff = staffMembers.find(s => s.id === staffId)
    if (!staff) return []
    
    return staff.shifts.filter(shift => {
      return format(new Date(shift.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    })
  }

  const renderShift = (shift) => (
    <Box
      key={shift.id}
      sx={{
        backgroundColor: '#4A90E2',
        color: 'white',
        borderRadius: 1,
        p: 1,
        mb: 0.5,
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#357ABD'
        }
      }}
      onClick={() => handleShiftClick(shift)}
    >
      <Typography variant="caption" sx={{ fontWeight: 500 }}>
        {shift.title}
      </Typography>
      <Button
        size="small"
        variant="contained"
        sx={{
          position: 'absolute',
          right: 4,
          top: '50%',
          transform: 'translateY(-50%)',
          minWidth: 'auto',
          width: 60,
          height: 20,
          fontSize: '0.65rem',
          backgroundColor: 'rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.3)'
          }
        }}
      >
        Add shift
      </Button>
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
      {/* Header Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        {weekDays.map((day) => (
          <Box
            key={day.toISOString()}
            sx={{
              p: 1,
              textAlign: 'center',
              borderRight: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderRight: 'none'
              }
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {format(day, 'EEE M/d')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                S
              </Typography>
              <Typography variant="caption" color="text.secondary">
                A
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Staff Rows */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Scheduled/Actual Row Headers */}
        <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ width: 60, p: 1, borderRight: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">Scheduled</Typography>
            <br />
            <Typography variant="caption" color="text.secondary">Actual</Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {weekDays.map((day) => (
              <Box
                key={day.toISOString()}
                sx={{
                  p: 1,
                  borderRight: '1px solid',
                  borderColor: 'divider',
                  minHeight: 60,
                  '&:last-child': {
                    borderRight: 'none'
                  }
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  —
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  —
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Staff Shift Rows */}
        {staffMembers.map((staff) => (
          <Box
            key={staff.id}
            sx={{
              display: 'flex',
              borderBottom: '1px solid',
              borderColor: 'divider',
              opacity: selectedStaff.length === 0 || selectedStaff.includes(staff.id) ? 1 : 0.3
            }}
          >
            <Box sx={{ width: 60, p: 1, borderRight: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">Scheduled</Typography>
              <br />
              <Typography variant="caption" color="text.secondary">Actual</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {weekDays.map((day) => {
                const dayShifts = getDayShifts(day, staff.id)
                return (
                  <Box
                    key={day.toISOString()}
                    sx={{
                      p: 1,
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      minHeight: 60,
                      position: 'relative',
                      '&:last-child': {
                        borderRight: 'none'
                      },
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    {dayShifts.map(renderShift)}
                    {dayShifts.length === 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          '&:hover': {
                            opacity: 1
                          }
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.65rem' }}
                        >
                          Add shift
                        </Button>
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default WeeklyCalendarGrid
