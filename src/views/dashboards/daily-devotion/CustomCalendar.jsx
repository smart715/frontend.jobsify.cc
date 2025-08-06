'use client'

import { useEffect, useState } from 'react'

import { Box, IconButton, Typography, Button } from '@mui/material'

import dayjs from 'dayjs'

const CustomCalendar = ({ onDateChange }) => {
  const today = dayjs()
  const [selectedDate, setSelectedDate] = useState(today)

  const startOfMonth = selectedDate.startOf('month')
  const daysInMonth = startOfMonth.daysInMonth()

  useEffect(() => {
    onDateChange(selectedDate.format('YYYY-MM-DD'));
  }, [selectedDate, onDateChange]);

  const getDayLabel = (index) => {
    return selectedDate.date(index + 1).format('ddd')
  }

  const handlePrev = () => {
    const newMonth = selectedDate.subtract(1, 'month').startOf('month')

    setSelectedDate(newMonth.isSame(today, 'month') ? today : newMonth)
  }

  const handleNext = () => {
    const newMonth = selectedDate.add(1, 'month').startOf('month')

    setSelectedDate(newMonth.isSame(today, 'month') ? today : newMonth)
  }

  const handleToday = () => setSelectedDate(today)

  const handleDayClick = (day) => {
    setSelectedDate(selectedDate.date(day))
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box className="relative">
          <Typography variant='caption' className="leading-[80px] text-[80px]">{selectedDate.format('YYYY')}</Typography>
          <Typography variant='h3' className="absolute bottom-0 text-[30px]">
            {selectedDate.format('MMM D')}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            onClick={handleToday}
            variant="outlined"
            color="secondary"
            startIcon={<i className="ri-circle-fill text-red-500 text-[10px]" />}
            sx={{ textTransform: 'none', minWidth: 'auto', px: 2, mr: 2 }}
          >
            Today
          </Button>
          <Button onClick={handlePrev} variant="outlined" color="secondary" sx={{ textTransform: 'none', px: 2 }}>
            <i className="ri-arrow-left-line text-[20px]" />
          </Button>
          <Button onClick={handleNext} variant="outlined" color="secondary" sx={{ textTransform: 'none', px: 2 }}>
            <i className="ri-arrow-right-line text-[20px]" />
          </Button>
        </Box>
      </Box>

      {/* Date Strip */}
      <Box
        display="flex"
        alignItems="center"
        overflow="auto"
        sx={{
          border: '1px solid var(--mui-palette-secondary-darkOpacity)',
          borderRadius: '5px',
          background: 'var(--variant-outlinedBg)',
        }}
      >
        <IconButton onClick={handlePrev}>
          <i className="ri-arrow-left-s-line text-[20px]" />
        </IconButton>
        <Box display="flex" alignItems="center" overflow="auto" sx={{ width: '100%' }}>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const date = selectedDate.date(day)

            const isAfter = date.isAfter(today, 'day')
            const isSelected = selectedDate.isSame(date, 'day')
            const isCurrentDay = today.isSame(date, 'day')

            const borderBottom = isSelected
              ? '8px solid var(--primary-color)'
              : isAfter
              ? '4px solid #80dc6e'
              : '4px solid #eee'

            return (
              <Box
                key={day}
                onClick={() => handleDayClick(day)}
                textAlign="center"
                px={1}
                py={2}
                position="relative"
                sx={{
                  minWidth: 24,
                  width: '100%',
                  borderLeft: i === 0 ? '1px solid var(--mui-palette-secondary-darkOpacity)' : 'none',
                  borderRight: '1px solid var(--mui-palette-secondary-darkOpacity)',
                  borderBottom,
                  height: '70px',
                  overflow: 'hidden',
                  textAlign: 'center',
                  background: getDayLabel(i)[0] === 'S' ? 'var(--mui-palette-primary-lightOpacity)' : 'var(--secondary-color)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'flex-end' }}>
                  <Typography variant='body1' sx={{ textTransform: 'uppercase' }} fontSize={20}>
                    {getDayLabel(i)[0]}
                  </Typography>
                  <Typography variant='body1' sx={{ textTransform: 'uppercase', mb: '3px' }} fontSize={14}>
                    {getDayLabel(i).slice(1)}
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  fontSize={isSelected ? 18 : 14}
                  fontWeight={isSelected ? 700 : 500}
                  sx={{ mx: 'auto' }}
                >
                  {day}
                </Typography>
                {isCurrentDay && (
                  <i className="ri-circle-fill text-red-500 text-[8px] absolute top-[2px] right-[2px]" />
                )}
              </Box>
            )
          })}
        </Box>
        <IconButton onClick={handleNext}>
          <i className="ri-arrow-right-s-line text-[20px]" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CustomCalendar
