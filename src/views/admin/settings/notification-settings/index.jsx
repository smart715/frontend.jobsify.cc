'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { toast } from '@/utils/toast'
import TestEmailDialog from '@components/dialogs/test-email-dialog'

const NotificationSettings = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [emailSettings, setEmailSettings] = useState({
    mailFromName: 'Jobsify LLC',
    mailFromEmail: 'email@mg.infinitylabsai.com',
    enableEmailQueue: false,
    mailDriver: 'SMTP',
    mailHost: 'smtp.mailgun.org',
    mailPort: '2525',
    mailUsername: 'email@mg.infinitylabsai.com',
    mailPassword: 'd159fb8230c9670c0538cdb1feb49487-10b6f382-8d898f8c',
    mailEncryption: 'tls',
    emailVerified: false
  })
  const [pushSettings, setPushSettings] = useState({
    enableBeams: false,
    enableOneSignal: false
  })
  const [pusherSettings, setPusherSettings] = useState({
    status: false,
    taskBoard: true,
    messages: false
  })
  const [loading, setLoading] = useState(false)
  const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/notification-settings')
      if (response.ok) {
        const data = await response.json()
        setEmailSettings(data.emailSettings || emailSettings)
        setPushSettings(data.pushSettings || pushSettings)
        setPusherSettings(data.pusherSettings || pusherSettings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleEmailSettingsChange = (field, value) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePushSettingsChange = (field, value) => {
    setPushSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePusherSettingsChange = (field, value) => {
    setPusherSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/notification-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emailSettings,
          pushSettings,
          pusherSettings
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Notification settings saved successfully!')
        console.log('Settings saved successfully')
      } else {
        const errorData = await response.json()
        toast.error(`Failed to save settings: ${errorData.error || 'Unknown error'}`)
        console.error('Failed to save settings')
      }
    } catch (error) {
      toast.error('An error occurred while saving settings. Please try again.')
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendTestEmail = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/notification-settings/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailSettings)
      })

      if (response.ok) {
        alert('Test email sent successfully!')
      } else {
        throw new Error('Failed to send test email')
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      alert('Failed to send test email.')
    } finally {
      setLoading(false)
    }
  }

  const EmailTab = () => (
    <Box sx={{ mt: 3 }}>
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Your SMTP details are not correct. Please update to the correct one.
        </Typography>
      </Alert>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Recommendation for SMTP
        </Typography>
        <Typography variant="body2" component="div">
          1. SMTP2GO.COM<br />
          2. SMTP.COM
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mail From Name"
            value={emailSettings.mailFromName}
            onChange={(e) => handleEmailSettingsChange('mailFromName', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mail From Email"
            value={emailSettings.mailFromEmail}
            onChange={(e) => handleEmailSettingsChange('mailFromEmail', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={emailSettings.enableEmailQueue}
                onChange={(e) => handleEmailSettingsChange('enableEmailQueue', e.target.checked)}
              />
            }
            label="Enable Email Queue"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Mail Driver</InputLabel>
            <Select
              value={emailSettings.mailDriver}
              label="Mail Driver"
              onChange={(e) => handleEmailSettingsChange('mailDriver', e.target.value)}
            >
              <MenuItem value="Mail">Mail</MenuItem>
              <MenuItem value="SMTP">SMTP</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mail Host"
            value={emailSettings.mailHost}
            onChange={(e) => handleEmailSettingsChange('mailHost', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mail Port"
            value={emailSettings.mailPort}
            onChange={(e) => handleEmailSettingsChange('mailPort', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mail Username"
            value={emailSettings.mailUsername}
            onChange={(e) => handleEmailSettingsChange('mailUsername', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mail Password"
            type={showPassword ? 'text' : 'password'}
            value={emailSettings.mailPassword}
            onChange={(e) => handleEmailSettingsChange('mailPassword', e.target.value)}
            placeholder="Mail Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Mail Encryption</InputLabel>
            <Select
              value={emailSettings.mailEncryption}
              label="Mail Encryption"
              onChange={(e) => handleEmailSettingsChange('mailEncryption', e.target.value)}
            >
              <MenuItem value="ssl">ssl</MenuItem>
              <MenuItem value="tls">tls</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Email Verified</InputLabel>
            <Select
              value={emailSettings.emailVerified ? 'Yes' : 'No'}
              label="Email Verified"
              onChange={(e) => handleEmailSettingsChange('emailVerified', e.target.value === 'Yes')}
            >
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="outlined" onClick={() => setTestEmailDialogOpen(true)} disabled={loading}>
          Send Test Email
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Please configure the SMTP details to make email application.
      </Typography>

      <TestEmailDialog
        open={testEmailDialogOpen}
        onClose={() => setTestEmailDialogOpen(false)}
        onSendTestEmail={handleSendTestEmail}
        emailSettings={emailSettings}
      />
    </Box>
  )

  const PushNotificationTab = () => (
    <Box sx={{ mt: 3 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Only one push notification service can be active at a time.
        </Typography>
      </Alert>

      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={pushSettings.enableBeams}
              onChange={(e) => handlePushSettingsChange('enableBeams', e.target.checked)}
            />
          }
          label="Enable Beams Push Notification (Recommended)"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={pushSettings.enableOneSignal}
              onChange={(e) => handlePushSettingsChange('enableOneSignal', e.target.checked)}
            />
          }
          label="Enable One Signal Push Notification"
        />
      </Box>

      <Button 
        variant="contained" 
        color="success" 
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </Box>
  )

  const PusherTab = () => (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Checkbox
          checked={pusherSettings.status}
          onChange={(e) => handlePusherSettingsChange('status', e.target.checked)}
        />
        <Typography>Status</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Enable Pusher For
        </Typography>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={pusherSettings.taskBoard}
                onChange={(e) => handlePusherSettingsChange('taskBoard', e.target.checked)}
              />
            }
            label="Task Board"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={pusherSettings.messages}
                onChange={(e) => handlePusherSettingsChange('messages', e.target.checked)}
              />
            }
            label="Messages"
          />
        </Box>
      </Box>

      <Button 
        variant="contained" 
        color="success" 
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </Box>
  )

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Notification Settings
        </Typography>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Email" />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Push Notification
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Pusher
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
              </Box>
            } 
          />
        </Tabs>

        {activeTab === 0 && <EmailTab />}
        {activeTab === 1 && <PushNotificationTab />}
        {activeTab === 2 && <PusherTab />}
      </CardContent>
    </Card>
  )
}

export default NotificationSettings