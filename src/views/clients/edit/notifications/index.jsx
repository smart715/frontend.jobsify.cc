
'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'

const NotificationsTab = () => {
  const notificationSettings = [
    {
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      checked: true
    },
    {
      title: 'SMS Notifications',
      description: 'Receive notifications via SMS',
      checked: false
    },
    {
      title: 'Push Notifications',
      description: 'Receive push notifications on your device',
      checked: true
    },
    {
      title: 'Marketing Emails',
      description: 'Receive marketing and promotional emails',
      checked: false
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Notification Preferences' />
          <CardContent>
            <div className='space-y-4'>
              {notificationSettings.map((setting, index) => (
                <div key={index} className='flex items-center justify-between py-2'>
                  <div>
                    <Typography variant='body1' className='font-medium'>
                      {setting.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {setting.description}
                    </Typography>
                  </div>
                  <FormControlLabel
                    control={<Switch defaultChecked={setting.checked} />}
                    label=''
                    className='m-0'
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default NotificationsTab
