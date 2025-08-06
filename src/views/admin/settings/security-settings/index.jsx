
'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Grid,
  Divider,
  Chip,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { showSuccessToast, showErrorToast } from '@/utils/toast'

const SecuritySettings = () => {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    emailTwoFactorEnabled: false,
    googleAuthEnabled: false,
    recaptchaEnabled: false,
    recaptchaSiteKey: '',
    recaptchaSecretKey: '',
    smtpConfigured: false,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15
  })

  useEffect(() => {
    fetchSecuritySettings()
  }, [])

  const fetchSecuritySettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/security-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        showErrorToast('Failed to fetch security settings')
      }
    } catch (error) {
      console.error('Error fetching security settings:', error)
      showErrorToast('Failed to fetch security settings')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/security-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        showSuccessToast('Security settings saved successfully')
      } else {
        showErrorToast('Failed to save security settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      showErrorToast('Failed to save security settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordPolicyChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [field]: value
      }
    }))
  }

  const testEmailSettings = async () => {
    try {
      const response = await fetch('/api/admin/notification-settings/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: session?.user?.email,
          subject: 'Test Email - Security Settings',
          message: 'This is a test email to verify SMTP configuration for security settings.'
        }),
      })

      if (response.ok) {
        showSuccessToast('Test email sent successfully')
        handleSettingChange('smtpConfigured', true)
      } else {
        showErrorToast('Failed to send test email')
        handleSettingChange('smtpConfigured', false)
      }
    } catch (error) {
      console.error('Error testing email:', error)
      showErrorToast('Failed to test email settings')
      handleSettingChange('smtpConfigured', false)
    }
  }

  const TwoFactorTab = () => (
    <Box sx={{ p: 3 }}>
      {/* Header Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>Increase your account's security by enabling Two-Factor Authentication (2FA)</AlertTitle>
      </Alert>

      {/* Email SMTP Alert */}
      {!settings.smtpConfigured && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography>Email SMTP settings not configured.</Typography>
            <Button variant="contained" color="error" size="small" onClick={testEmailSettings}>
              Test & Verify
            </Button>
          </Box>
        </Alert>
      )}

      {/* Setup Using Email */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}
          >
            <i className="ri-mail-line" style={{ color: 'white', fontSize: '24px' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Setup Using Email
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enabling this feature will send code on your email account {session?.user?.email || 'user@example.com'} for log in.
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailTwoFactorEnabled}
                onChange={(e) => handleSettingChange('emailTwoFactorEnabled', e.target.checked)}
                disabled={!settings.smtpConfigured}
              />
            }
            label={settings.emailTwoFactorEnabled ? 'Enabled' : 'Disabled'}
          />
        </Box>
      </Paper>

      {/* Setup Using Google Authenticator */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#4285f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}
          >
            <i className="ri-google-line" style={{ color: 'white', fontSize: '24px' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Setup Using Google Authenticator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use the Authenticator app to get free verification codes, even when your phone is offline. Available for Android and iPhone.
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={settings.googleAuthEnabled}
                onChange={(e) => handleSettingChange('googleAuthEnabled', e.target.checked)}
              />
            }
            label={settings.googleAuthEnabled ? 'Enabled' : 'Disabled'}
          />
        </Box>
      </Paper>

      {/* Master 2FA Toggle */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Two-Factor Authentication
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enable or disable two-factor authentication globally
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={settings.twoFactorEnabled}
                onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
              />
            }
            label={settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
          />
        </Box>
      </Paper>
    </Box>
  )

  const GoogleRecaptchaTab = () => (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Google reCAPTCHA Configuration
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="reCAPTCHA Site Key"
            value={settings.recaptchaSiteKey}
            onChange={(e) => handleSettingChange('recaptchaSiteKey', e.target.value)}
            placeholder="Enter your reCAPTCHA site key"
            helperText="Get your site key from Google reCAPTCHA console"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="reCAPTCHA Secret Key"
            type="password"
            value={settings.recaptchaSecretKey}
            onChange={(e) => handleSettingChange('recaptchaSecretKey', e.target.value)}
            placeholder="Enter your reCAPTCHA secret key"
            helperText="Keep this key secure and private"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.recaptchaEnabled}
                onChange={(e) => handleSettingChange('recaptchaEnabled', e.target.checked)}
                color="primary"
              />
            }
            label="Enable Google reCAPTCHA"
          />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              Google reCAPTCHA helps protect your application from spam and abuse. 
              You need to register your domain at{' '}
              <a href="https://www.google.com/recaptcha" target="_blank" rel="noopener noreferrer">
                Google reCAPTCHA
              </a>{' '}
              to get the required keys.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  )

  const PasswordPolicyTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Password Policy Configuration
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Minimum Password Length"
            type="number"
            value={settings.passwordPolicy.minLength}
            onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value))}
            inputProps={{ min: 1, max: 50 }}
            helperText="Set minimum number of characters required"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Session Timeout (minutes)"
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            inputProps={{ min: 1, max: 1440 }}
            helperText="Automatic logout after inactivity"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Max Login Attempts"
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
            inputProps={{ min: 1, max: 10 }}
            helperText="Account lockout after failed attempts"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Lockout Duration (minutes)"
            type="number"
            value={settings.lockoutDuration}
            onChange={(e) => handleSettingChange('lockoutDuration', parseInt(e.target.value))}
            inputProps={{ min: 1, max: 1440 }}
            helperText="How long account stays locked"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Password Requirements
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordPolicy.requireUppercase}
                  onChange={(e) => handlePasswordPolicyChange('requireUppercase', e.target.checked)}
                />
              }
              label="Require uppercase letters"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordPolicy.requireLowercase}
                  onChange={(e) => handlePasswordPolicyChange('requireLowercase', e.target.checked)}
                />
              }
              label="Require lowercase letters"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordPolicy.requireNumbers}
                  onChange={(e) => handlePasswordPolicyChange('requireNumbers', e.target.checked)}
                />
              }
              label="Require numbers"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onChange={(e) => handlePasswordPolicyChange('requireSpecialChars', e.target.checked)}
                />
              }
              label="Require special characters"
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader 
        title="Security Settings"
        subheader="Configure security features to protect your application"
      />
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Two-Factor Authentication
                  <Chip 
                    size="small" 
                    variant="outlined" 
                    color={settings.twoFactorEnabled ? "success" : "error"}
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Google Recaptcha
                  <Chip 
                    size="small" 
                    variant="outlined" 
                    color={settings.recaptchaEnabled ? "success" : "error"}
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Password Policy
                  <Chip 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {activeTab === 0 && <TwoFactorTab />}
        {activeTab === 1 && <GoogleRecaptchaTab />}
        {activeTab === 2 && <PasswordPolicyTab />}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={fetchSecuritySettings}
            disabled={saving}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Save Settings
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SecuritySettings
