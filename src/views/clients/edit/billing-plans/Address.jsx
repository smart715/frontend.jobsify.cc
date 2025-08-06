
'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const Address = () => {
  return (
    <Card>
      <CardHeader title='Billing Address' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label='Company Name' placeholder='Materialize Inc.' />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label='Billing Email' placeholder='john.doe@example.com' />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label='Tax ID' placeholder='Enter Tax ID' />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label='VAT Number' placeholder='Enter VAT Number' />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label='Billing Address' placeholder='Enter billing address' multiline rows={3} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label='State' placeholder='New York' />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label='Zip Code' placeholder='10001' />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button variant='contained' className='mie-4'>
              Save Changes
            </Button>
            <Button variant='outlined' color='secondary'>
              Discard
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Address
