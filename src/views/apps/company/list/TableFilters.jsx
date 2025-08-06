// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'

// import FormControl from '@mui/material/FormControl' // Not used for now
import Grid from '@mui/material/Grid2'

// import InputLabel from '@mui/material/InputLabel' // Not used for now
// import MenuItem from '@mui/material/MenuItem' // Not used for now
// import Select from '@mui/material/Select' // Not used for now

const TableFilters = ({ setData, tableData }) => {
  // States
  // const [role, setRole] = useState('') // Removed user-specific filters
  // const [plan, setPlan] = useState('')
  // const [status, setStatus] = useState('')

  useEffect(() => {
    // Simplified filter logic: pass through data or empty array
    // This can be expanded later with company-specific filters
    if (tableData) {
      setData(tableData)
    } else {
      setData([])
    }
  }, [tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={5}>
        {/* Filters UI removed for now. Can be added here later. */}
        {/* Example:
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='company-type-select'>Select Company Type</InputLabel>
            <Select
              fullWidth
              id='select-company-type'
              // value={companyType}
              // onChange={e => setCompanyType(e.target.value)}
              label='Select Company Type'
              labelId='company-type-select'
            >
              <MenuItem value=''>Select Type</MenuItem>
              <MenuItem value='technology'>Technology</MenuItem>
              <MenuItem value='finance'>Finance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        */}
      </Grid>
    </CardContent>
  )
}

export default TableFilters
