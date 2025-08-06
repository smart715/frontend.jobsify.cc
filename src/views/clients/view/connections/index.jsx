
'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const ConnectionsTab = () => {
  const connections = [
    {
      name: 'Google',
      description: 'Calendar, Contacts, Gmail',
      icon: 'ri-google-fill',
      connected: true,
      color: 'error'
    },
    {
      name: 'Slack',
      description: 'Communication, Notifications',
      icon: 'ri-slack-fill',
      connected: false,
      color: 'warning'
    },
    {
      name: 'GitHub',
      description: 'Manage your Git repositories',
      icon: 'ri-github-fill',
      connected: true,
      color: 'secondary'
    },
    {
      name: 'Mailchimp',
      description: 'Email marketing service',
      icon: 'ri-mail-line',
      connected: false,
      color: 'info'
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Connected Accounts' subheader='Display content from your connected accounts on your site' />
          <CardContent>
            <Grid container spacing={4}>
              {connections.map((connection, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <div className='border rounded p-4'>
                    <div className='flex items-center justify-between mbe-4'>
                      <div className='flex items-center gap-3'>
                        <div className={`p-2 rounded bg-${connection.color} bg-opacity-10`}>
                          <i className={`${connection.icon} text-xl text-${connection.color}`} />
                        </div>
                        <div>
                          <Typography variant='h6'>{connection.name}</Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {connection.description}
                          </Typography>
                        </div>
                      </div>
                      <Chip
                        label={connection.connected ? 'Connected' : 'Not Connected'}
                        color={connection.connected ? 'success' : 'secondary'}
                        size='small'
                        variant='tonal'
                      />
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ConnectionsTab
