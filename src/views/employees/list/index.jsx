
'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Component Imports
import EmployeeListTable from './EmployeeListTable'
import AddEmployeeDrawer from '../add/AddEmployeeDrawer'

// Utils Imports
import { getLocalizedUrl } from '@/utils/i18n'

const EmployeeList = () => {
  const [employeeData, setEmployeeData] = useState([])
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false)

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployeeData(data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleEmployeeAdded = () => {
    setAddEmployeeOpen(false)
    fetchEmployees()
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Typography variant='h4'>
            Employees
          </Typography>
          <div className='flex items-center gap-4 flex-wrap'>
            <Button
              variant='contained'
              component={Link}
              startIcon={<i className='ri-add-line' />}
              href={getLocalizedUrl('/employees/add', 'en')}
              className='max-sm:is-full'
            >
              Add Employee
            </Button>
          </div>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <EmployeeListTable tableData={employeeData} />
          </CardContent>
        </Card>
      </Grid>
      <AddEmployeeDrawer
        open={addEmployeeOpen}
        handleClose={() => setAddEmployeeOpen(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </Grid>
  )
}

export default EmployeeList
