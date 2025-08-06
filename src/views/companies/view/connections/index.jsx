// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'

// Vars
const connectedAccountsArr = [
  {
    checked: true,
    title: 'Google',
    logo: '/images/logos/google.png',
    subtitle: 'Calendar and Contacts'
  },
  {
    checked: false,
    title: 'Slack',
    logo: '/images/logos/slack.png',
    subtitle: 'Communications'
  },
  {
    checked: true,
    title: 'Github',
    logo: '/images/logos/github.png',
    subtitle: 'Manage your Git repositories'
  },
  {
    checked: true,
    title: 'Mailchimp',
    subtitle: 'Email marketing service',
    logo: '/images/logos/mailchimp.png'
  },
  {
    title: 'Asana',
    checked: false,
    subtitle: 'Task Communication',
    logo: '/images/logos/asana.png'
  }
]

const socialAccountsArr = [
  {
    title: 'Facebook',
    isConnected: false,
    logo: '/images/logos/facebook.png'
  },
  {
    title: 'Twitter',
    isConnected: true,
    username: '@Pixinvent',
    logo: '/images/logos/twitter.png',
    href: 'https://twitter.com/pixinvents'
  },
  {
    title: 'Linkedin',
    isConnected: true,
    username: '@Pixinvent',
    logo: '/images/logos/linkedin.png',
    href: 'https://www.linkedin.com/in/pixinvent-creative-studio-561a4713b'
  },
  {
    title: 'Dribbble',
    isConnected: false,
    logo: '/images/logos/dribbble.png'
  },
  {
    title: 'Behance',
    isConnected: false,
    logo: '/images/logos/behance.png'
  }
]

const Connections = () => {
  return (
    <Card>
      <Grid container>
        <Grid size={{ xs: 12, md: 6 }}>
          <CardHeader
            title='Connected Accounts'
            subheader='Display content from your connected accounts on your site'
          />
          <CardContent className='flex flex-col gap-4'>
            {connectedAccountsArr.map((item, index) => (
              <div key={index} className='flex items-center justify-between gap-4'>
                <div className='flex flex-grow items-center gap-4'>
                  <img height={32} width={32} src={item.logo} alt={item.title} />
                  <div className='flex-grow'>
                    <Typography className='font-medium' color='text.primary'>
                      {item.title}
                    </Typography>
                    <Typography variant='body2'>{item.subtitle}</Typography>
                  </div>
                </div>
                <Switch defaultChecked={item.checked} />
              </div>
            ))}
          </CardContent>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CardHeader title='Social Accounts' subheader='Display content from social accounts on your site' />
          <CardContent className='flex flex-col gap-4'>
            {socialAccountsArr.map((item, index) => (
              <div key={index} className='flex items-center justify-between gap-4'>
                <div className='flex flex-grow items-center gap-4'>
                  <img height={32} width={32} src={item.logo} alt={item.title} />
                  <div className='flex-grow'>
                    <Typography className='font-medium' color='text.primary'>
                      {item.title}
                    </Typography>
                    {item.isConnected ? (
                      <Typography color='primary.main' component={Link} href={item.href || '/'} target='_blank'>
                        {item.username}
                      </Typography>
                    ) : (
                      <Typography variant='body2'>Not Connected</Typography>
                    )}
                  </div>
                </div>
                <CustomIconButton variant='outlined' color={item.isConnected ? 'error' : 'secondary'}>
                  <i className={item.isConnected ? 'ri-delete-bin-line' : 'ri-link'} />
                </CustomIconButton>
              </div>
            ))}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

// MUI Imports
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

const ConnectionsTab = () => {
  const connections = [
    { name: 'Google Analytics', status: 'Connected', color: 'success' },
    { name: 'Stripe', status: 'Connected', color: 'success' },
    { name: 'PayPal', status: 'Disconnected', color: 'error' },
    { name: 'Mailgun', status: 'Connected', color: 'success' },
  ]

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Connected Applications' />
          <CardContent>
            <Typography variant='body2' className='mbe-4'>
              Manage your company's connections to third-party services.
            </Typography>
            <div className='flex flex-col gap-4'>
              {connections.map((connection, index) => (
                <div key={index} className='flex items-center justify-between p-4 border rounded'>
                  <div className='flex items-center gap-3'>
                    <Typography variant='h6'>{connection.name}</Typography>
                    <Chip 
                      label={connection.status} 
                      color={connection.color} 
                      variant='tonal' 
                      size='small' 
                    />
                  </div>
                  <Button 
                    variant={connection.status === 'Connected' ? 'outlined' : 'contained'}
                    color={connection.status === 'Connected' ? 'error' : 'primary'}
                    size='small'
                  >
                    {connection.status === 'Connected' ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Connections
export { ConnectionsTab }