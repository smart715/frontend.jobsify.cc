
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { format } from 'date-fns'

const CalendarHeader = ({
  currentDate,
  viewOptions,
  setViewOptions,
  onPrevWeek,
  onNextWeek,
  onToday
}) => {
  const [viewOptionsAnchor, setViewOptionsAnchor] = useState(null)
  const [actionsAnchor, setActionsAnchor] = useState(null)
  const [addAnchor, setAddAnchor] = useState(null)

  const handleViewOptionsClick = (event) => {
    setViewOptionsAnchor(event.currentTarget)
  }

  const handleActionsClick = (event) => {
    setActionsAnchor(event.currentTarget)
  }

  const handleAddClick = (event) => {
    setAddAnchor(event.currentTarget)
  }

  const handleClose = () => {
    setViewOptionsAnchor(null)
    setActionsAnchor(null)
    setAddAnchor(null)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleViewOptionsClick}
          endIcon={<i className="ri-arrow-down-s-line" />}
        >
          View options
        </Button>
        <Menu
          anchorEl={viewOptionsAnchor}
          open={Boolean(viewOptionsAnchor)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { setViewOptions('week'); handleClose() }}>Week</MenuItem>
          <MenuItem onClick={() => { setViewOptions('month'); handleClose() }}>Month</MenuItem>
        </Menu>

        <Divider orientation="vertical" flexItem />

        <Button variant="outlined" onClick={onToday}>
          Today
        </Button>

        <IconButton onClick={onPrevWeek}>
          <i className="ri-arrow-left-s-line" />
        </IconButton>

        <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
          {format(currentDate, 'MMM d - ')} {format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d')}
        </Typography>

        <IconButton onClick={onNextWeek}>
          <i className="ri-arrow-right-s-line" />
        </IconButton>
      </Box>

      {/* Right Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleActionsClick}
          endIcon={<i className="ri-arrow-down-s-line" />}
        >
          Actions
        </Button>
        <Menu
          anchorEl={actionsAnchor}
          open={Boolean(actionsAnchor)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Export</MenuItem>
          <MenuItem onClick={handleClose}>Print</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
        </Menu>

        <Button
          variant="outlined"
          onClick={handleAddClick}
          endIcon={<i className="ri-arrow-down-s-line" />}
        >
          Add
        </Button>
        <Menu
          anchorEl={addAnchor}
          open={Boolean(addAnchor)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Add Shift</MenuItem>
          <MenuItem onClick={handleClose}>Add Staff</MenuItem>
        </Menu>

        <Button variant="outlined">
          Publish
        </Button>

        <IconButton>
          <i className="ri-more-2-line" />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CalendarHeader
