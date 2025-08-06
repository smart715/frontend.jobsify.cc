
'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { styled } from '@mui/material/styles'

// Styled Components
const StyledTable = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  '& th, & td': {
    padding: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
    textAlign: 'left'
  },
  '& th': {
    fontWeight: 600,
    color: theme.palette.text.primary
  }
}))

const RecentDevicesTable = () => {
  const devices = [
    {
      browser: 'Chrome on Windows',
      device: 'HP Spectre 360',
      location: 'Switzerland',
      recentActivity: '10, July 2024',
      status: 'current'
    },
    {
      browser: 'Chrome on iPhone',
      device: 'iPhone 12x',
      location: 'Australia',
      recentActivity: '13, July 2024',
      status: 'active'
    },
    {
      browser: 'Chrome on Android',
      device: 'Oneplus 9 Pro',
      location: 'Dubai',
      recentActivity: '14, July 2024',
      status: 'active'
    }
  ]

  return (
    <Card>
      <CardHeader title='Recent Devices' />
      <div className='overflow-x-auto'>
        <StyledTable>
          <thead>
            <tr>
              <th>Browser</th>
              <th>Device</th>
              <th>Location</th>
              <th>Recent Activities</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr key={index}>
                <td>
                  <div className='flex items-center gap-2'>
                    <i className='ri-computer-line text-xl' />
                    <div>
                      <Typography className='font-medium' color='text.primary'>
                        {device.browser}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td>
                  <Typography color='text.primary'>{device.device}</Typography>
                </td>
                <td>
                  <Typography color='text.primary'>{device.location}</Typography>
                </td>
                <td>
                  <div className='flex items-center gap-3'>
                    <Typography color='text.primary'>{device.recentActivity}</Typography>
                    <Chip
                      label={device.status}
                      size='small'
                      color={device.status === 'current' ? 'primary' : 'secondary'}
                      variant='tonal'
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </div>
    </Card>
  )
}

export default RecentDevicesTable
