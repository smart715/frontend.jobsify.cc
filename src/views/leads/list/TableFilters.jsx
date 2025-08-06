
'use client'

import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material'

const TableFilters = ({ filterType, setFilterType, filterStatus, setFilterStatus }) => {
  return (
    <Box className='flex items-center gap-4 p-6 pt-0'>
      <FormControl size='small' sx={{ minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={filterType}
          label='Type'
          onChange={(e) => setFilterType(e.target.value)}
        >
          <MenuItem value='all'>All</MenuItem>
          <MenuItem value='Website'>Website</MenuItem>
          <MenuItem value='Referral'>Referral</MenuItem>
          <MenuItem value='Cold Call'>Cold Call</MenuItem>
          <MenuItem value='Email Campaign'>Email Campaign</MenuItem>
          <MenuItem value='Social Media'>Social Media</MenuItem>
          <MenuItem value='Trade Show'>Trade Show</MenuItem>
          <MenuItem value='Advertisement'>Advertisement</MenuItem>
          <MenuItem value='Partner'>Partner</MenuItem>
          <MenuItem value='Other'>Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl size='small' sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filterStatus}
          label='Status'
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value='all'>All</MenuItem>
          <MenuItem value='New'>New</MenuItem>
          <MenuItem value='Contacted'>Contacted</MenuItem>
          <MenuItem value='Qualified'>Qualified</MenuItem>
          <MenuItem value='Converted'>Converted</MenuItem>
          <MenuItem value='Lost'>Lost</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default TableFilters
