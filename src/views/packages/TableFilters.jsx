
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
  const [packageType, setPackageType] = useState('')
  const [status, setStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const filteredData = tableData?.filter(packageItem => {
      if (packageType && packageItem.packageType !== packageType) return false
      if (status && packageItem.status !== status) return false
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          packageItem.name?.toLowerCase().includes(searchLower) ||
          packageItem.description?.toLowerCase().includes(searchLower) ||
          packageItem.packageType?.toLowerCase().includes(searchLower)
        )
      }
      return true
    })

    setData(filteredData || [])
  }, [packageType, status, searchTerm, tableData, setData])

  const handleReset = () => {
    setPackageType('')
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
            label='Search Package'
            placeholder='Search by name, description, or type'
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={e => setStatus(e.target.value)} label='Status'>
              <MenuItem value=''>All Status</MenuItem>
              <MenuItem value='ACTIVE'>Active</MenuItem>
              <MenuItem value='INACTIVE'>Inactive</MenuItem>
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
