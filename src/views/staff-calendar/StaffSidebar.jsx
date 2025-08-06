
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

const StaffSidebar = ({
  staffMembers,
  selectedStaff,
  setSelectedStaff,
  searchQuery,
  setSearchQuery
}) => {
  const [showUnassigned, setShowUnassigned] = useState(true)

  const handleStaffSelection = (staffId) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter(id => id !== staffId))
    } else {
      setSelectedStaff([...selectedStaff, staffId])
    }
  }

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      sx={{
        width: 300,
        borderRight: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Search Section */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search us..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <i className="ri-search-line" />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Labor Costs Section */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <i className="ri-money-dollar-circle-line" />
          <Typography variant="body2" color="text.secondary">
            Labor costs
          </Typography>
          <IconButton size="small">
            <i className="ri-more-line" />
          </IconButton>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          —
        </Typography>
      </Box>

      {/* Daily Info Section */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <i className="ri-calendar-line" />
          <Typography variant="body2" color="text.secondary">
            Daily info
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Unassigned Shifts */}
      <Box sx={{ px: 2, py: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer'
          }}
          onClick={() => setShowUnassigned(!showUnassigned)}
        >
          <IconButton size="small">
            <i className={showUnassigned ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"} />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            Unassigned shifts
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Staff List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List dense>
          {filteredStaff.map((staff) => (
            <ListItem
              key={staff.id}
              sx={{
                py: 1,
                px: 2,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar
                  src={staff.avatar}
                  sx={{
                    width: 32,
                    height: 32,
                    border: `2px solid ${staff.color}`,
                    fontSize: '0.75rem'
                  }}
                >
                  {staff.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {staff.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                    <Chip
                      size="small"
                      label="00:00"
                      sx={{ fontSize: '0.65rem', height: 16 }}
                    />
                    <Chip
                      size="small"
                      label="$0"
                      sx={{ fontSize: '0.65rem', height: 16 }}
                    />
                  </Box>
                }
              />
              <Checkbox
                size="small"
                checked={selectedStaff.includes(staff.id)}
                onChange={() => handleStaffSelection(staff.id)}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Weekly Summary */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Weekly summary
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className="ri-time-line" style={{ fontSize: '14px' }} />
            <Typography variant="body2">Hours: 08:00</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className="ri-group-line" style={{ fontSize: '14px' }} />
            <Typography variant="body2">Shifts: 1</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className="ri-user-line" style={{ fontSize: '14px' }} />
            <Typography variant="body2">Users: 1</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className="ri-money-dollar-circle-line" style={{ fontSize: '14px' }} />
            <Typography variant="body2">Labor: —</Typography>
          </Box>
        </Box>

        <Button
          variant="text"
          size="small"
          sx={{ mt: 1, color: 'primary.main' }}
        >
          Add more users +
        </Button>
      </Box>
    </Box>
  )
}

export default StaffSidebar
