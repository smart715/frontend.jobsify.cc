// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'

const SecurityTab = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Change Password' />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              Password management is available in edit mode only.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Two-factor Authentication' subheader='Keep your account secure with authentication step.' />
          <CardContent>
            <Typography className='font-medium' color='text.primary'>
              Authenticator App
            </Typography>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col items-start'>
                <Typography color='text.primary'>Two-factor Authentication via Authenticator App</Typography>
                <Typography variant='body2'>Two-factor authentication settings are available in edit mode only.</Typography>
              </div>
              <Switch disabled checked={false} />
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Recent Devices' subheader='Devices that have recently accessed your account.' />
          <CardContent>
            <Typography variant='body2' color='text.secondary'>
              No recent device activity to display.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SecurityTab