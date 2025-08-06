
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Utils
import { toast } from '@/utils/toast'

const NotificationsTab = ({ companyId }) => {
  const [preferences, setPreferences] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    fetchPreferences()
  }, [companyId])

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching preferences for company:', companyId)
      
      const response = await fetch(`/api/company-notification-preferences?companyId=${companyId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch notification preferences')
      }
      
      const data = await response.json()
      console.log('Fetched preferences:', data)
      setPreferences(data)
    } catch (err) {
      console.error('Error fetching notification preferences:', err)
      setError(err.message)
      toast.error('Failed to load notification preferences')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      console.log('Saving preferences:', { companyId, ...preferences })
      
      const response = await fetch('/api/company-notification-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyId,
          ...preferences
        })
      })

      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save notification preferences')
      }

      toast.success('Notification preferences updated successfully')
      
      // Refresh preferences to show the updated values
      await fetchPreferences()
    } catch (err) {
      console.error('Error saving notification preferences:', err)
      toast.error(`Failed to save notification preferences: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    fetchPreferences()
  }

  if (loading) {
    return (
      <Grid container spacing={6} justifyContent="center">
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading notification preferences...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchPreferences}>
            Retry
          </Button>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader 
            title='Notification Preferences' 
            subheader='Configure how you want to receive notifications about company activities'
          />
          <CardContent>
            <Typography variant="body2" className="mb-4" color="text.secondary">
              We need permission from your browser to show notifications.{' '}
              <Button variant="text" size="small" color="primary">
                Request Permission
              </Button>
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
                          checked={preferences?.[`${type.id}Email`] || false}
                          onChange={(e) => handlePreferenceChange(`${type.id}Email`, e.target.checked)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={preferences?.[`${type.id}Browser`] || false}
                          onChange={(e) => handlePreferenceChange(`${type.id}Browser`, e.target.checked)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={preferences?.[`${type.id}App`] || false}
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
                    value={preferences?.notificationFrequency || 'online'}
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

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid size="auto">
                <Button 
                  variant="contained" 
                  onClick={handleSave}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : null}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Grid>
              <Grid size="auto">
                <Button 
                  variant="outlined" 
                  onClick={handleReset}
                  disabled={saving}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default NotificationsTab
