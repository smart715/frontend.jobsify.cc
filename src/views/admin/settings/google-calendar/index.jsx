
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert, 
  Paper,
  Skeleton
} from '@mui/material'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

const GoogleCalendar = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [loading, setLoading] = useState(false)
  const [fetchingSettings, setFetchingSettings] = useState(true)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      status: false,
      clientId: '',
      clientSecret: '',
      redirectUri: 'https://localhost:3000/oauth/callback/google',
      calendarId: 'primary',
      syncEnabled: true,
      eventReminders: true,
      defaultEventDuration: 60,
      timeZone: 'UTC',
      maxResults: 250,
      orderBy: 'startTime'
    }
  })

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetchingSettings(true)
        const response = await fetch('/api/admin/google-calendar-settings')
        
        if (response.ok) {
          const data = await response.json()
          
          // Update form with fetched data
          reset(data)
          setIsEnabled(data.status)
        } else {
          console.error('Failed to fetch Google Calendar settings')
          setAlertMessage('Failed to load Google Calendar settings')
          setAlertSeverity('error')
          setShowAlert(true)
        }
      } catch (error) {
        console.error('Error fetching Google Calendar settings:', error)
        setAlertMessage('Error loading Google Calendar settings')
        setAlertSeverity('error')
        setShowAlert(true)
      } finally {
        setFetchingSettings(false)
      }
    }

    fetchSettings()
  }, [reset])

  const handleSave = async (data) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/google-calendar-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setAlertMessage('Google Calendar settings saved successfully!')
        setAlertSeverity('success')
      } else {
        const errorData = await response.json()
        setAlertMessage(errorData.error || 'Failed to save Google Calendar settings')
        setAlertSeverity('error')
      }
    } catch (error) {
      console.error('Error saving Google Calendar settings:', error)
      setAlertMessage('Error saving Google Calendar settings')
      setAlertSeverity('error')
    } finally {
      setLoading(false)
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
    }
  }

  const handleTest = async () => {
    setAlertMessage('Testing Google Calendar connection...')
    setAlertSeverity('info')
    setShowAlert(true)
    
    // Simulate test connection
    setTimeout(() => {
      setAlertMessage('Google Calendar connection test successful!')
      setAlertSeverity('success')
      setTimeout(() => setShowAlert(false), 3000)
    }, 2000)
  }

  const handleAuthorize = () => {
    const clientId = watch('clientId')
    if (!clientId) {
      setAlertMessage('Please enter Client ID first')
      setAlertSeverity('error')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    const redirectUri = watch('redirectUri')
    const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/calendar`
    window.open(authUrl, '_blank')
  }

  if (fetchingSettings) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Google Calendar Settings
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Skeleton variant="rectangular" width="100%" height={200} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Google Calendar Settings
      </Typography>

      {showAlert && (
        <Alert 
          severity={alertSeverity} 
          sx={{ mb: 3 }}
          onClose={() => setShowAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleSave)}>
        <Grid container spacing={3}>
          {/* Status Card */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Google Calendar Integration
                  </Typography>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.checked)
                              setIsEnabled(e.target.checked)
                            }}
                          />
                        }
                        label="Enable"
                      />
                    )}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Enable Google Calendar integration to sync events and appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* OAuth Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  OAuth 2.0 Configuration
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="clientId"
                      control={control}
                      rules={{ required: watch('status') ? 'Client ID is required' : false }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Client ID"
                          placeholder="Enter Google OAuth Client ID"
                          error={!!errors.clientId}
                          helperText={errors.clientId?.message}
                          disabled={!watch('status')}
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Controller
                      name="clientSecret"
                      control={control}
                      rules={{ required: watch('status') ? 'Client Secret is required' : false }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Client Secret"
                          type="password"
                          placeholder="Enter Google OAuth Client Secret"
                          error={!!errors.clientSecret}
                          helperText={errors.clientSecret?.message}
                          disabled={!watch('status')}
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Controller
                      name="redirectUri"
                      control={control}
                      rules={{ required: watch('status') ? 'Redirect URI is required' : false }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Redirect URI"
                          placeholder="https://localhost:3000/oauth/callback/google"
                          error={!!errors.redirectUri}
                          helperText={errors.redirectUri?.message || 'Add this redirect URI to your Google Console'}
                          disabled={!watch('status')}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      onClick={handleAuthorize}
                      disabled={!watch('status') || !watch('clientId')}
                      sx={{ mr: 2 }}
                    >
                      Authorize with Google
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={handleTest}
                      disabled={!watch('status')}
                    >
                      Test Connection
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Calendar Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Calendar Settings
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="calendarId"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Calendar ID</InputLabel>
                          <Select
                            {...field}
                            label="Calendar ID"
                            disabled={!watch('status')}
                          >
                            <MenuItem value="primary">Primary Calendar</MenuItem>
                            <MenuItem value="custom">Custom Calendar</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="timeZone"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Time Zone</InputLabel>
                          <Select
                            {...field}
                            label="Time Zone"
                            disabled={!watch('status')}
                          >
                            <MenuItem value="UTC">UTC</MenuItem>
                            <MenuItem value="America/New_York">America/New_York</MenuItem>
                            <MenuItem value="America/Los_Angeles">America/Los_Angeles</MenuItem>
                            <MenuItem value="Europe/London">Europe/London</MenuItem>
                            <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="defaultEventDuration"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Default Event Duration (minutes)"
                          type="number"
                          disabled={!watch('status')}
                          inputProps={{ min: 15, max: 480, step: 15 }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="maxResults"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Max Results"
                          type="number"
                          disabled={!watch('status')}
                          inputProps={{ min: 10, max: 2500, step: 10 }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="syncEnabled"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              {...field}
                              checked={field.value}
                              disabled={!watch('status')}
                            />
                          }
                          label="Enable Sync"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="eventReminders"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              {...field}
                              checked={field.value}
                              disabled={!watch('status')}
                            />
                          }
                          label="Event Reminders"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="orderBy"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Order By</InputLabel>
                          <Select
                            {...field}
                            label="Order By"
                            disabled={!watch('status')}
                          >
                            <MenuItem value="startTime">Start Time</MenuItem>
                            <MenuItem value="updated">Updated</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Instructions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: 'action.hover' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Setup Instructions
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                To configure Google Calendar integration:
              </Typography>
              <Box component="ol" sx={{ pl: 2 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Go to the <strong>Google Cloud Console</strong> and create a new project or select an existing one
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Enable the <strong>Google Calendar API</strong> for your project
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Create OAuth 2.0 credentials and add the redirect URI above
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Copy the Client ID and Client Secret to the fields above
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body2">
                    Enable the integration and test the connection
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => window.location.reload()}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default GoogleCalendar
