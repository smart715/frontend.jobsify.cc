
'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid2'

// Component Imports
import AddEmployeeDrawer from './AddEmployeeDrawer'

// Utils Imports
import { getLocalizedUrl } from '@/utils/i18n'

const AddEmployee = () => {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    router.push('/en/employees')
  }

  const handleEmployeeAdded = () => {
    setOpen(false)
    router.push('/en/employees')
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Button
            variant='outlined'
            component={Link}
            startIcon={<i className='ri-arrow-left-line' />}
            href={getLocalizedUrl('/employees', 'en')}
            className='max-sm:is-full'
          >
            Back to Employees
          </Button>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant='h4' className='mbe-6'>
              Add New Employee
            </Typography>
            <AddEmployeeDrawer
              open={open}
              handleClose={handleClose}
              onEmployeeAdded={handleEmployeeAdded}
              embedded={true}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AddEmployee
