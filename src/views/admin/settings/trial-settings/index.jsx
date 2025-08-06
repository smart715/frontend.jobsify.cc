
'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

const TrialSettings = () => {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      trialDuration: 30,
      trialDurationType: 'days',
      trialDays: 30,
      autoExtendTrial: false,
      maxTrialExtensions: 1,
      trialGracePeriod: 7,
      sendTrialReminders: true,
      reminderDays: [7, 3, 1],
      trialFeaturesEnabled: true,
      allowMultipleTrials: false
    }
  })

  // Load current settings
  useEffect(() => {
    fetchTrialSettings()
  }, [])

  const fetchTrialSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/trial-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        reset(data)
      }
    } catch (error) {
      console.error('Error fetching trial settings:', error)
      toast.error('Failed to load trial settings')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/trial-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success('Trial settings updated successfully')
        fetchTrialSettings()
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating trial settings:', error)
      toast.error('Failed to update trial settings')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={6}>
        {/* Trial Duration Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Trial Duration Settings
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="trialDuration"
                    control={control}
                    rules={{ required: 'Trial duration is required', min: 1 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Trial Duration"
                        error={!!errors.trialDuration}
                        helperText={errors.trialDuration?.message}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="trialDurationType"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Duration Type</InputLabel>
                        <Select {...field} label="Duration Type">
                          <MenuItem value="days">Days</MenuItem>
                          <MenuItem value="weeks">Weeks</MenuItem>
                          <MenuItem value="months">Months</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="trialDays"
                    control={control}
                    rules={{ required: 'Trial days is required', min: 1 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Trial Days"
                        error={!!errors.trialDays}
                        helperText={errors.trialDays?.message || "Number of trial days for new users"}
                        InputProps={{ inputProps: { min: 1, max: 365 } }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="trialGracePeriod"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Grace Period (Days)"
                        helperText="Additional days after trial expires"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Trial Extensions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Trial Extensions
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Controller
                    name="autoExtendTrial"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Allow automatic trial extensions"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="maxTrialExtensions"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="Maximum Extensions"
                        helperText="Maximum number of trial extensions allowed"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="allowMultipleTrials"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Allow multiple trials per user/company"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Trial Notifications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Trial Notifications
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Controller
                    name="sendTrialReminders"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Send trial expiration reminders"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Reminder Schedule (days before expiration)
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2">
                      Current: 7 days, 3 days, 1 day before expiration
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Customize reminder schedule in notification settings
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Trial Features */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Trial Features
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Controller
                    name="trialFeaturesEnabled"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Enable full feature access during trial"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info">
                    When enabled, trial users will have access to all premium features. 
                    When disabled, trial users will only have access to basic features.
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
            >
              {loading ? 'Saving...' : 'Save Trial Settings'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

export default TrialSettings
