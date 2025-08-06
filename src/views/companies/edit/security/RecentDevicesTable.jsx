
'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'

// Utils Imports
import { formatLocationDisplay } from '@/utils/geolocation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

const RecentDevicesTable = ({ companyId: propCompanyId }) => {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { data: session } = useSession()
  const params = useParams()
  
  // Get company ID from URL params if not provided as prop
  const companyId = propCompanyId || params?.id

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Company ID from prop:', propCompanyId)
        console.log('Company ID from URL params:', params?.id)
        console.log('Final company ID:', companyId)
        
        const url = companyId 
          ? `/api/recent-devices?companyId=${companyId}`
          : '/api/recent-devices'
        
        console.log('Fetching devices from:', url)
        console.log('Session:', session)
        
        const response = await fetch(url)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch devices')
        }
        
        const data = await response.json()
        console.log('Received devices data:', data)
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setDevices(data)
        } else {
          console.error('Invalid data format received:', data)
          setDevices([])
        }
      } catch (err) {
        console.error('Error fetching devices:', err)
        setError(err.message)
        setDevices([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchDevices()
      
      // Set up periodic refresh every 30 seconds
      const interval = setInterval(fetchDevices, 30000)
      return () => clearInterval(interval)
    }
  }, [session, companyId])

  const getBrowserIcon = (browser) => {
    const browserLower = browser?.toLowerCase() || ''
    if (browserLower.includes('chrome')) {
      return <i className='ri-chrome-line text-xl text-primary' />
    } else if (browserLower.includes('firefox')) {
      return <i className='ri-firefox-line text-xl text-warning' />
    } else if (browserLower.includes('safari')) {
      return <i className='ri-safari-line text-xl text-info' />
    } else if (browserLower.includes('edge')) {
      return <i className='ri-edge-line text-xl text-success' />
    } else {
      return <i className='ri-global-line text-xl text-secondary' />
    }
  }

  const getDeviceIcon = (deviceType) => {
    const type = deviceType?.toLowerCase() || ''
    if (type.includes('mobile') || type.includes('phone')) {
      return <i className='ri-smartphone-line text-xl text-error' />
    } else if (type.includes('tablet')) {
      return <i className='ri-tablet-line text-xl text-warning' />
    } else {
      return <i className='ri-computer-line text-xl text-info' />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader title='Recent Devices' />
        <Box className='flex justify-center items-center p-6'>
          <CircularProgress />
        </Box>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader title='Recent Devices' />
        <Box className='p-6'>
          <Typography color='error'>Error loading devices: {error}</Typography>
        </Box>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='Recent Devices' />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Browser</th>
              <th>Device</th>
              <th>Location</th>
              <th>Recent Activities</th>
              {companyId && <th>User</th>}
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan={companyId ? 5 : 4} className='text-center p-6'>
                  <Typography>No recent devices found</Typography>
                </td>
              </tr>
            ) : (
              devices.map((device, index) => (
                <tr key={device.id || index}>
                  <td>
                    <div className='flex items-center gap-4'>
                      {getBrowserIcon(device.browser)}
                      <Typography color='text.primary'>
                        {device.browser || 'Unknown'} on {device.os || 'Unknown'}
                      </Typography>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center gap-2'>
                      {getDeviceIcon(device.deviceType)}
                      <Typography>
                        {device.deviceName || `${device.deviceType || 'Unknown'} Device`}
                      </Typography>
                    </div>
                  </td>
                  <td>
                    <Typography>
                      {formatLocationDisplay(device.location, device.ipAddress)}
                    </Typography>
                  </td>
                  <td>
                    <Typography>
                      {formatDate(device.lastLogin)}
                    </Typography>
                  </td>
                  {companyId && (
                    <td>
                      <Typography>
                        {device.user ? `${device.user.firstName} ${device.user.lastName}` : 'Unknown User'}
                      </Typography>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default RecentDevicesTable
