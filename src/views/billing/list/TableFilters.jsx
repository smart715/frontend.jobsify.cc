
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const TableFilters = ({ setData, tableData }) => {
  // States
  const [status, setStatus] = useState('')
  const [dateRange, setDateRange] = useState('')

  // Filter function
  const applyFilters = () => {
    let filteredData = [...tableData]

    // Filter by status
    if (status) {
      filteredData = filteredData.filter(invoice => 
        invoice.status?.toLowerCase() === status.toLowerCase()
      )
    }

    // Filter by date range (simplified - you can enhance this)
    if (dateRange) {
      const today = new Date()
      let startDate = new Date()
      
      switch (dateRange) {
        case 'thisWeek':
          startDate.setDate(today.getDate() - 7)
          break
        case 'thisMonth':
          startDate.setMonth(today.getMonth() - 1)
          break
        case 'thisYear':
          startDate.setFullYear(today.getFullYear() - 1)
          break
        default:
          break
      }

      if (dateRange !== '') {
        filteredData = filteredData.filter(invoice => {
          const invoiceDate = new Date(invoice.issueDate || invoice.createdAt)
          return invoiceDate >= startDate
        })
      }
    }

    setData(filteredData)
  }

  // Reset filters
  const resetFilters = () => {
    setStatus('')
    setDateRange('')
    setData(tableData)
  }

  // Apply filters when values change
  useEffect(() => {
    applyFilters()
  }, [status, dateRange])

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CustomTextField
              select
              fullWidth
              label="Status"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="OVERDUE">Overdue</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CustomTextField
              select
              fullWidth
              label="Date Range"
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
            >
              <MenuItem value="">All Time</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button 
              variant="outlined" 
              onClick={resetFilters}
              fullWidth
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TableFilters
