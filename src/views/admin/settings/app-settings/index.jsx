'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Tabs,
  Tab,
  Switch,
  Divider,
  Alert,
  Chip
} from '@mui/material'
import { useAppSettings } from '@/contexts/appSettingsContext'
import { toast } from 'react-toastify'

const AppSettings = () => {
  const { settings, updateSettings, loadSettings } = useAppSettings()
  const [currentTab, setCurrentTab] = useState('app-settings')
  const [formData, setFormData] = useState({
    dateFormat: 'd-m-Y H:i:s',
    timeFormat: '12 Hours (12:30 pm)',
    defaultTimezone: 'Asia/Kolkata',
    defaultCurrency: '$ (USD)',
    language: 'English',
    enableCache: true,
    appDebug: false,
    appUpdate: false,
    turnOnEmailNotification: false,
    companyNeedApproval: false
  })

  const [appDebug, setAppDebug] = useState(true)
  const [appUpdate, setAppUpdate] = useState(true)
  const [enableCache, setEnableCache] = useState(true)
  const [emailNotification, setEmailNotification] = useState(true)
  const [companyNeedApproval, setCompanyNeedApproval] = useState(false)
  const [dateFormat, setDateFormat] = useState('d-m-Y H:i:s')
  const [timeFormat, setTimeFormat] = useState('12')
  const [defaultTimezone, setDefaultTimezone] = useState('Asia/Kolkata')
  const [defaultCurrency, setDefaultCurrency] = useState('USD')
  const [language, setLanguage] = useState('en')
  const [databaseRowLimit, setDatabaseRowLimit] = useState('25')
  const [sessionDriver, setSessionDriver] = useState('file')
  const [loading, setLoading] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)
    const [maxFileSize, setMaxFileSize] = useState('10')
    const [maxNumberOfFiles, setMaxNumberOfFiles] = useState('10')
    const [googleMapKey, setGoogleMapKey] = useState('')

  // Load existing settings on component mount
  useEffect(() => {
    // Initialize local state with context settings
    setDateFormat(settings.dateFormat || 'd-m-Y H:i:s')
    setTimeFormat(settings.timeFormat || '12')
    setDefaultTimezone(settings.defaultTimezone || 'Asia/Kolkata')
    setDefaultCurrency(settings.defaultCurrency || 'USD')
    setLanguage(settings.language || 'en')
    setDatabaseRowLimit(settings.databaseRowLimit || '25')
    setSessionDriver(settings.sessionDriver || 'file')
    setAppDebug(settings.appDebug || false)
    setAppUpdate(settings.appUpdate || false)
    setEnableCache(settings.enableCache || false)
    setEmailNotification(settings.emailNotification || false)
    setCompanyNeedApproval(settings.companyNeedApproval || false)
    setMaxFileSize(settings.maxFileSize || '10')
    setMaxNumberOfFiles(settings.maxNumberOfFiles || '10')
    setGoogleMapKey(settings.googleMapKey || '')
    setLocalSettings(settings)
  }, [settings])

  const handleSave = async () => {
    setLoading(true)
    try {
      const settingsData = {
        dateFormat,
        timeFormat,
        defaultTimezone,
        defaultCurrency,
        language,
        databaseRowLimit: parseInt(databaseRowLimit),
        sessionDriver,
        appDebug,
        appUpdate,
        enableCache,
        emailNotification,
        companyNeedApproval,
        maxFileSize: parseInt(maxFileSize),
        maxNumberOfFiles: parseInt(maxNumberOfFiles),
        googleMapKey: googleMapKey
      }

      const response = await fetch('/api/admin/app-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('App settings saved successfully!')
      } else {
        toast.error(result.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const settingsData = {
        dateFormat,
        timeFormat,
        defaultTimezone,
        defaultCurrency,
        language,
        databaseRowLimit: parseInt(databaseRowLimit),
        sessionDriver,
        appDebug,
        appUpdate,
        enableCache,
        emailNotification,
        companyNeedApproval,
        maxFileSize: parseInt(maxFileSize),
        maxNumberOfFiles: parseInt(maxNumberOfFiles),
        googleMapKey: googleMapKey
      }

      const result = await updateSettings(settingsData)

      if (result.success) {
        toast.success('Settings saved successfully! Changes are now applied globally.')
        // Reload settings to ensure we have the latest state
        await loadSettings()
      } else {
        toast.error(result.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const tabsData = [
    { value: 'app-settings', label: 'App Settings' },
    { value: 'file-upload-settings', label: 'File Upload Settings' },
    { value: 'google-map-settings', label: 'Google Map Settings' }
  ]

  return (
    <Card>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={currentTab}
            onChange={(e, value) => setCurrentTab(value)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '14px'
              }
            }}
          >
            {tabsData.map(tab => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {currentTab === 'app-settings' && (
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Date Format
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} size='small'>
                  <MenuItem value='d-m-Y H:i:s'>d-m-Y H:i:s</MenuItem>
                  <MenuItem value='m-d-Y H:i:s'>m-d-Y H:i:s</MenuItem>
                  <MenuItem value='Y-m-d H:i:s'>Y-m-d H:i:s</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Time Format
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)} size='small'>
                  <MenuItem value='12'>12 Hours (12:30 pm)</MenuItem>
                  <MenuItem value='24'>24 Hours (12:30)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Default Timezone
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={defaultTimezone} onChange={(e) => setDefaultTimezone(e.target.value)} size='small'>
                  <MenuItem value='Asia/Kolkata'>Asia/Kolkata</MenuItem>
                  <MenuItem value='America/New_York'>America/New_York</MenuItem>
                  <MenuItem value='Europe/London'>Europe/London</MenuItem>
                  <MenuItem value='UTC'>UTC</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Default Currency
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={defaultCurrency} onChange={(e) => setDefaultCurrency(e.target.value)} size='small'>
                  <MenuItem value='USD'>$ (USD)</MenuItem>
                  <MenuItem value='EUR'>€ (EUR)</MenuItem>
                  <MenuItem value='GBP'>£ (GBP)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Language
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={language} onChange={(e) => setLanguage(e.target.value)} size='small'>
                  <MenuItem value='en'>English</MenuItem>
                  <MenuItem value='es'>Spanish</MenuItem>
                  <MenuItem value='fr'>French</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Database Row Limit
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={databaseRowLimit} onChange={(e) => setDatabaseRowLimit(e.target.value)} size='small'>
                  <MenuItem value='25'>25</MenuItem>
                  <MenuItem value='50'>50</MenuItem>
                  <MenuItem value='100'>100</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Session Driver
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={sessionDriver} onChange={(e) => setSessionDriver(e.target.value)} size='small'>
                  <MenuItem value='file'>File</MenuItem>
                  <MenuItem value='database'>Database</MenuItem>
                  <MenuItem value='redis'>Redis</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  App Debug
                </Typography>
                <Switch
                  checked={appDebug}
                  onChange={(e) => setAppDebug(e.target.checked)}
                  size="small"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  App Update
                </Typography>
                <Switch
                  checked={appUpdate}
                  onChange={(e) => setAppUpdate(e.target.checked)}
                  size="small"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enableCache}
                    onChange={(e) => setEnableCache(e.target.checked)}
                    size="small"
                  />
                }
                label="Enable Cache"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Turn On Email Notification
                </Typography>
                <Switch
                  checked={emailNotification}
                  onChange={(e) => setEmailNotification(e.target.checked)}
                  size="small"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={companyNeedApproval}
                    onChange={(e) => setCompanyNeedApproval(e.target.checked)}
                    size="small"
                  />
                }
                label="Company Need Approval"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  type='button'
                  sx={{
                    backgroundColor: '#dc3545',
                    '&:hover': {
                      backgroundColor: '#c82333'
                    },
                    textTransform: 'none',
                    px: 4
                  }}
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {currentTab === 'file-upload-settings' && (
          <Grid container spacing={4}>
            {/* Server Information */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Server upload_max_filesize:</strong> 2 MB &nbsp;&nbsp;&nbsp;
                    <strong>Service post_max_size:</strong> 8 MB
                  </Typography>
                </Alert>
              </Box>
            </Grid>

            {/* Max File Size */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Max File size for upload *
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={maxFileSize}
                onChange={(e) => setMaxFileSize(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Typography variant="body2" color="text.secondary">
                      MB
                    </Typography>
                  )
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Enter lower value than 2 MB
              </Typography>
            </Grid>

            {/* Max Number of Files */}
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Max number of files for upload *
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={maxNumberOfFiles}
                onChange={(e) => setMaxNumberOfFiles(e.target.value)}
              />
            </Grid>

            {/* Save Button for File Upload Settings */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#dc3545',
                    '&:hover': {
                      backgroundColor: '#c82333'
                    },
                    textTransform: 'none',
                    px: 4,
                    py: 1.5
                  }}
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {currentTab === 'google-map-settings' && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Google map key
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. AIzaSyD8i2ihs7000000000000000000000XXXX"
                sx={{ mb: 2 }}
                value={googleMapKey}
                onChange={(e) => setGoogleMapKey(e.target.value)}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Leave blank to remove a Google map key
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Visit{' '}
                <a
                  href="https://console.cloud.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2', textDecoration: 'none' }}
                >
                  Google Cloud Console
                </a>
                {' '}to get the key's
              </Typography>
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: '#dc3545',
                    '&:hover': {
                      backgroundColor: '#c82333'
                    },
                    textTransform: 'none',
                    px: 4,
                    py: 1.5
                  }}
                >
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default AppSettings