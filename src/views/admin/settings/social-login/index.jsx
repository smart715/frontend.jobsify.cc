
'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material'

const SocialLogin = () => {
  const [socialProviders, setSocialProviders] = useState({
    google: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      showSecret: false
    },
    facebook: {
      enabled: false,
      appId: '',
      appSecret: '',
      showSecret: false
    },
    linkedin: {
      enabled: false,
      clientId: '',
      clientSecret: '',
      showSecret: false
    },
    twitter: {
      enabled: false,
      apiKey: '',
      apiSecret: '',
      showSecret: false
    }
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: socialProviders
  })

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/social-login-settings')
      
      if (response.ok) {
        const data = await response.json()
        // Add showSecret property for UI state
        const dataWithUIState = Object.keys(data).reduce((acc, key) => {
          acc[key] = {
            ...data[key],
            showSecret: false
          }
          return acc
        }, {})
        
        setSocialProviders(dataWithUIState)
        reset(dataWithUIState)
      } else {
        throw new Error('Failed to fetch settings')
      }
    } catch (error) {
      console.error('Error fetching social login settings:', error)
      setSaveStatus({ 
        type: 'error', 
        message: 'Failed to load social login settings' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProviderToggle = (provider) => {
    setSocialProviders(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        enabled: !prev[provider].enabled
      }
    }))
  }

  const handleInputChange = (provider, field, value) => {
    setSocialProviders(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }))
  }

  const toggleSecretVisibility = (provider) => {
    setSocialProviders(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        showSecret: !prev[provider].showSecret
      }
    }))
  }

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      setSaveStatus(null)

      // Remove showSecret property before saving
      const dataToSave = Object.keys(socialProviders).reduce((acc, key) => {
        acc[key] = {
          enabled: socialProviders[key].enabled,
          ...(socialProviders[key].clientId !== undefined && { clientId: socialProviders[key].clientId }),
          ...(socialProviders[key].clientSecret !== undefined && { clientSecret: socialProviders[key].clientSecret }),
          ...(socialProviders[key].appId !== undefined && { appId: socialProviders[key].appId }),
          ...(socialProviders[key].appSecret !== undefined && { appSecret: socialProviders[key].appSecret }),
          ...(socialProviders[key].apiKey !== undefined && { apiKey: socialProviders[key].apiKey }),
          ...(socialProviders[key].apiSecret !== undefined && { apiSecret: socialProviders[key].apiSecret })
        }
        return acc
      }, {})

      const response = await fetch('/api/admin/social-login-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      })

      if (response.ok) {
        setSaveStatus({ 
          type: 'success', 
          message: 'Social login settings saved successfully!' 
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving social login settings:', error)
      setSaveStatus({ 
        type: 'error', 
        message: error.message || 'Failed to save settings. Please try again.' 
      })
    } finally {
      setSaving(false)
      // Clear status after 5 seconds
      setTimeout(() => setSaveStatus(null), 5000)
    }
  }

  const handleReset = () => {
    setSocialProviders({
      google: { enabled: false, clientId: '', clientSecret: '', showSecret: false },
      facebook: { enabled: false, appId: '', appSecret: '', showSecret: false },
      linkedin: { enabled: false, clientId: '', clientSecret: '', showSecret: false },
      twitter: { enabled: false, apiKey: '', apiSecret: '', showSecret: false }
    })
    reset({
      google: { enabled: false, clientId: '', clientSecret: '' },
      facebook: { enabled: false, appId: '', appSecret: '' },
      linkedin: { enabled: false, clientId: '', clientSecret: '' },
      twitter: { enabled: false, apiKey: '', apiSecret: '' }
    })
  }

  const providerConfig = {
    google: {
      name: 'Google',
      icon: 'ri-google-fill',
      color: '#4285f4',
      fields: [
        { key: 'clientId', label: 'Client ID', required: true },
        { key: 'clientSecret', label: 'Client Secret', required: true, secret: true }
      ]
    },
    facebook: {
      name: 'Facebook',
      icon: 'ri-facebook-fill',
      color: '#1877f2',
      fields: [
        { key: 'appId', label: 'App ID', required: true },
        { key: 'appSecret', label: 'App Secret', required: true, secret: true }
      ]
    },
    linkedin: {
      name: 'LinkedIn',
      icon: 'ri-linkedin-fill',
      color: '#0077b5',
      fields: [
        { key: 'clientId', label: 'Client ID', required: true },
        { key: 'clientSecret', label: 'Client Secret', required: true, secret: true }
      ]
    },
    twitter: {
      name: 'Twitter',
      icon: 'ri-twitter-fill',
      color: '#1da1f2',
      fields: [
        { key: 'apiKey', label: 'API Key', required: true },
        { key: 'apiSecret', label: 'API Secret', required: true, secret: true }
      ]
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading social login settings...</Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Social Login Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure social media authentication providers for your application
          </Typography>
        </Box>

        {saveStatus && (
          <Alert 
            severity={saveStatus.type} 
            sx={{ mb: 3 }}
            onClose={() => setSaveStatus(null)}
          >
            {saveStatus.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {Object.entries(providerConfig).map(([provider, config]) => (
              <Grid item xs={12} key={provider}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    border: '1px solid',
                    borderColor: socialProviders[provider].enabled ? config.color : 'divider',
                    borderRadius: 2,
                    transition: 'border-color 0.2s ease-in-out'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        backgroundColor: config.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <i className={`${config.icon} text-white text-xl`} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {config.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enable {config.name} social login
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={socialProviders[provider].enabled}
                          onChange={() => handleProviderToggle(provider)}
                          color="primary"
                        />
                      }
                      label=""
                      sx={{ ml: 2 }}
                    />
                  </Box>

                  {socialProviders[provider].enabled && (
                    <>
                      <Divider sx={{ mb: 3 }} />
                      <Grid container spacing={3}>
                        {config.fields.map((field) => (
                          <Grid item xs={12} sm={6} key={field.key}>
                            <TextField
                              fullWidth
                              label={field.label}
                              type={field.secret && !socialProviders[provider].showSecret ? 'password' : 'text'}
                              value={socialProviders[provider][field.key]}
                              onChange={(e) => handleInputChange(provider, field.key, e.target.value)}
                              required={field.required}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              InputProps={field.secret ? {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => toggleSecretVisibility(provider)}
                                      edge="end"
                                      size="small"
                                    >
                                      <i className={
                                        socialProviders[provider].showSecret 
                                          ? 'ri-eye-off-line'
                                          : 'ri-eye-line'
                                      } />
                                    </IconButton>
                                  </InputAdornment>
                                )
                              } : undefined}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              type="submit"
              startIcon={saving ? <CircularProgress size={16} /> : <i className="ri-save-line" />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 4, p: 3, backgroundColor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Setup Instructions:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            To enable social login, you need to create applications in the respective developer consoles:
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              • <strong>Google:</strong> Visit Google Cloud Console and create OAuth 2.0 credentials
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Facebook:</strong> Go to Facebook Developers and create a new app
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>LinkedIn:</strong> Create an application in LinkedIn Developer Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • <strong>Twitter:</strong> Set up a new app in Twitter Developer Portal
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SocialLogin
