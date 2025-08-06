
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const TableFilters = ({ setData, tableData }) => {
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const filteredData = tableData?.filter(employee => {
      if (department && employee.department !== department) return false
      if (status && employee.status !== status) return false
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          employee.firstName?.toLowerCase().includes(searchLower) ||
          employee.lastName?.toLowerCase().includes(searchLower) ||
          employee.email?.toLowerCase().includes(searchLower) ||
          employee.employeeId?.toLowerCase().includes(searchLower)
        )
      }
      return true
    })

    setData(filteredData || [])
  }, [department, status, searchTerm, tableData, setData])

  const handleReset = () => {
    setDepartment('')
    setStatus('')
    setSearchTerm('')
  }

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            value={searchTerm}
            label='Search Employee'
            placeholder='Search by name, email, or ID'
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select value={department} onChange={e => setDepartment(e.target.value)} label='Department'>
              <MenuItem value=''>All Departments</MenuItem>
              <MenuItem value='Engineering'>Engineering</MenuItem>
              <MenuItem value='Marketing'>Marketing</MenuItem>
              <MenuItem value='Sales'>Sales</MenuItem>
              <MenuItem value='HR'>HR</MenuItem>
              <MenuItem value='Finance'>Finance</MenuItem>
              <MenuItem value='Operations'>Operations</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={e => setStatus(e.target.value)} label='Status'>
              <MenuItem value=''>All Status</MenuItem>
              <MenuItem value='Active'>Active</MenuItem>
              <MenuItem value='Inactive'>Inactive</MenuItem>
              <MenuItem value='Terminated'>Terminated</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button variant='outlined' color='secondary' onClick={handleReset}>
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
