'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

const ConnectionsTab = () => {
  const availableConnections = [
    { name: 'Google Analytics', description: 'Track website analytics', status: 'Available', color: 'default' },
    { name: 'Stripe', description: 'Payment processing', status: 'Available', color: 'default' },
    { name: 'Mailchimp', description: 'Email marketing', status: 'Available', color: 'default' },
    { name: 'Slack', description: 'Team communication', status: 'Available', color: 'default' },
    { name: 'Zoom', description: 'Video conferencing', status: 'Available', color: 'default' }
  ]

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Available Integrations' />
          <CardContent>
            <div className='flex flex-col gap-4'>
              <Typography variant='body2' color='text.secondary'>
                Connect with popular services to enhance your company's capabilities. These integrations can be set up after company creation.
              </Typography>

              {availableConnections.map((connection, index) => (
                <div key={index} className='flex items-center justify-between p-4 border rounded'>
                  <div className='flex items-center gap-3'>
                    <div>
                      <Typography variant='h6'>{connection.name}</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {connection.description}
                      </Typography>
                    </div>
                    <Chip
                      label={connection.status}
                      color={connection.color}
                      variant='tonal'
                      size='small'
                    />
                  </div>
                  <Button
                    variant='outlined'
                    size='small'
                    disabled
                  >
                    Connect Later
                  </Button>
                </div>
              ))}

              <Typography variant='body2' color='info.main' className='mt-4'>
                All integrations will be available in the company settings after creation.
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ConnectionsTab