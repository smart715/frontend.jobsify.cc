'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material'

const TableFilters = ({ setFilteredData, appreciationData }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [awardFilter, setAwardFilter] = useState('')
  const [dateRange, setDateRange] = useState('')

  useEffect(() => {
    let filteredData = appreciationData

    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter(
        (appreciation) =>
          appreciation.givenTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appreciation.award?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by award
    if (awardFilter) {
      filteredData = filteredData.filter((appreciation) => appreciation.award === awardFilter)
    }

    // Filter by date range
    if (dateRange) {
      const now = new Date()
      let filterDate = new Date() // Changed const to let

      switch (dateRange) {
        case 'last7days':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'last30days':
          filterDate.setDate(now.getDate() - 30)
          break
        case 'last90days':
          filterDate.setDate(now.getDate() - 90)
          break
        default:
          filterDate = null
      }

      if (filterDate) {
        filteredData = filteredData.filter(
          (appreciation) => new Date(appreciation.givenOn) >= filterDate
        )
      }
    }

    setFilteredData(filteredData)
  }, [searchTerm, awardFilter, dateRange, appreciationData, setFilteredData])

  // Get unique awards for filter dropdown
  const uniqueAwards = [...new Set(appreciationData?.map((appreciation) => appreciation.award) || [])]

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search by name or award..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="ri-search-line" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Award</InputLabel>
              <Select
                value={awardFilter}
                label="Award"
                onChange={(e) => setAwardFilter(e.target.value)}
              >
                <MenuItem value="">All Awards</MenuItem>
                {uniqueAwards.map((award) => (
                  <MenuItem key={award} value={award}>
                    {award}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="">All Time</MenuItem>
                <MenuItem value="last7days">Last 7 Days</MenuItem>
                <MenuItem value="last30days">Last 30 Days</MenuItem>
                <MenuItem value="last90days">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TableFilters