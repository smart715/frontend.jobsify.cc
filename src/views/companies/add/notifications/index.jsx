
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid2'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'

const NotificationsTab = ({ onNotificationChange, notificationData = {} }) => {
  const [preferences, setPreferences] = useState({
    newForYouEmail: true,
    newForYouBrowser: true,
    newForYouApp: true,
    accountActivityEmail: true,
    accountActivityBrowser: true,
    accountActivityApp: true,
    newBrowserEmail: true,
    newBrowserBrowser: true,
    newBrowserApp: false,
    newDeviceEmail: true,
    newDeviceBrowser: false,
    newDeviceApp: false,
    notificationFrequency: 'online',
    ...notificationData
  })

  const notificationTypes = [
    {
      id: 'newForYou',
      label: 'New For You',
      description: 'Get notified when new features or updates are available'
    },
    {
      id: 'accountActivity',
      label: 'Account Activity',
      description: 'Get notified about important account changes'
    },
    {
      id: 'newBrowser',
      label: 'A New Browser Used To Sign In',
      description: 'Get notified when someone signs in from a new browser'
    },
    {
      id: 'newDevice',
      label: 'A New Device Is Linked',
      description: 'Get notified when a new device is linked to your account'
    }
  ]

  const frequencyOptions = [
    { value: 'online', label: 'Only when I\'m online' },
    { value: 'daily', label: 'Daily digest' },
    { value: 'weekly', label: 'Weekly digest' },
    { value: 'never', label: 'Never' }
  ]

  const handlePreferenceChange = (field, value) => {
    const newPreferences = {
      ...preferences,
      [field]: value
    }
    setPreferences(newPreferences)
    
    // Pass changes to parent component
    if (onNotificationChange) {
      onNotificationChange(newPreferences)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader 
            title='Default Notification Preferences' 
            subheader='Set up default notification preferences for your company. These can be customized later.'
          />
          <CardContent>
            <Typography variant="body2" className="mb-4" color="text.secondary">
              Configure how you want to receive notifications about company activities.
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="bold">
                        TYPE
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight="bold">
                        EMAIL
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight="bold">
                        BROWSER
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" fontWeight="bold">
                        APP
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notificationTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>
                        <div>
                          <Typography variant="body2" fontWeight="medium">
                            {type.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {type.description}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={preferences[`${type.id}Email`] || false}
                          onChange={(e) => handlePreferenceChange(`${type.id}Email`, e.target.checked)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={preferences[`${type.id}Browser`] || false}
                          onChange={(e) => handlePreferenceChange(`${type.id}Browser`, e.target.checked)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={preferences[`${type.id}App`] || false}
                          onChange={(e) => handlePreferenceChange(`${type.id}App`, e.target.checked)}
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>When should we send you notifications?</InputLabel>
                  <Select
                    value={preferences.notificationFrequency || 'online'}
                    label="When should we send you notifications?"
                    onChange={(e) => handlePreferenceChange('notificationFrequency', e.target.value)}
                  >
                    {frequencyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
              Note: These are default settings that will be applied when the company is created. 
              Users can modify these settings later from the company settings page.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default NotificationsTab
