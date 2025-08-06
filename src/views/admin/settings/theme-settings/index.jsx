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
  Divider,
  Skeleton,
  Popper,
  ClickAwayListener
} from '@mui/material'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import { HexColorPicker } from 'react-colorful'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Utils
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import { useAppTitle } from '@/hooks/useAppTitle'

const ThemeSettings = () => {
  const [settings, setSettings] = useState({
    app_name: '',
    app_tagline: '',
    primary_color: '#0089ff',
    public_pages_theme: 'light',
    logo_url: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { getDocumentTitle } = useAppTitle()

  // Update document title
  useEffect(() => {
    document.title = getDocumentTitle('Theme Settings')
  }, [getDocumentTitle])
  const [appName, setAppName] = useState('Company Name')
  const [workSuite, setWorkSuite] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#1976d2')
  const [publicPagesTheme, setPublicPagesTheme] = useState('light')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null)
  const [fetchingSettings, setFetchingSettings] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [logos, setLogos] = useState({
    frontWebsite: null,
    lightMode: null,
    darkMode: null,
    loginScreen: null,
    favicon: null
  })

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetchingSettings(true)
        const response = await fetch('/api/admin/theme-settings')

        if (response.ok) {
          const data = await response.json()

          // Update state with fetched data
          setAppName(data.appName)
          setWorkSuite(data.workSuite)
          setPrimaryColor(data.primaryColor)
          setPublicPagesTheme(data.publicPagesTheme)
          setLogos(data.logos)
        } else {
          console.error('Failed to fetch theme settings')
          setAlertMessage('Failed to load theme settings')
          setAlertSeverity('error')
          setShowAlert(true)
        }
      } catch (error) {
        console.error('Error fetching theme settings:', error)
        setAlertMessage('Error loading theme settings')
        setAlertSeverity('error')
        setShowAlert(true)
      } finally {
        setFetchingSettings(false)
      }
    }

    fetchSettings()
  }, [])

  // Logo upload handlers
  const createDropzone = (logoType) => {
    return useDropzone({
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.svg']
      },
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            setLogos(prev => ({
              ...prev,
              [logoType]: reader.result
            }))
          }
          reader.readAsDataURL(file)
        }
      }
    })
  }

  const frontWebsiteDropzone = createDropzone('frontWebsite')
  const lightModeDropzone = createDropzone('lightMode')
  const darkModeDropzone = createDropzone('darkMode')
  const loginScreenDropzone = createDropzone('loginScreen')
  const faviconDropzone = createDropzone('favicon')

  const handleColorPickerToggle = (event) => {
    setColorPickerAnchor(event.currentTarget)
    setShowColorPicker(!showColorPicker)
  }

  const handleColorPickerClose = () => {
    setShowColorPicker(false)
    setColorPickerAnchor(null)
  }

  const handleSaveSettings = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/admin/theme-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appName,
          workSuite,
          primaryColor,
          publicPagesTheme,
          logos
        })
      })

      if (response.ok) {
        setAlertMessage('Theme settings saved successfully!')
        setAlertSeverity('success')

        // Update theme context with new primary color
        updateSettings({ primaryColor })

        showSuccessToast('Theme settings saved successfully!')
      } else {
        const errorData = await response.json()
        setAlertMessage(errorData.error || 'Failed to save theme settings')
        setAlertSeverity('error')
        showErrorToast('Failed to save theme settings')
      }
    } catch (error) {
      console.error('Error saving theme settings:', error)
      setAlertMessage('Error saving theme settings')
      setAlertSeverity('error')
      showErrorToast('Error saving theme settings')
    } finally {
      setLoading(false)
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
    }
  }

  const renderLogoUploadBox = (dropzone, logoType, title, currentLogo) => (
    <Box
      {...dropzone.getRootProps()}
      sx={{
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover'
        }
      }}
    >
      <input {...dropzone.getInputProps()} />
      {currentLogo ? (
        <Box>
          <img
            src={currentLogo}
            alt={title}
            style={{
              maxWidth: '100px',
              maxHeight: '60px',
              objectFit: 'contain',
              marginBottom: '8px'
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Click to change {title}
          </Typography>
        </Box>
      ) : (
        <Box>
          <i className="ri-upload-cloud-line" style={{ fontSize: '48px', color: '#999' }} />
          <Typography variant="body1" sx={{ mt: 1 }}>
            Upload {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            PNG, JPG, JPEG, SVG
          </Typography>
        </Box>
      )}
    </Box>
  )

  if (fetchingSettings) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Theme Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Skeleton variant="rectangular" width="100%" height={400} />
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
        Theme Settings
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

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                General Settings
              </Typography>

              {/* App Name */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  App Name
                </Typography>
                <TextField
                  fullWidth
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Enter app name"
                  size="medium"
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Jobsify */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Jobsify
                </Typography>
                <TextField
                  fullWidth
                  value={workSuite}
                  onChange={(e) => setWorkSuite(e.target.value)}
                  placeholder="Enter Jobsify name"
                  size="medium"
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Primary Color */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Primary Color
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    onClick={handleColorPickerToggle}
                    sx={{
                      width: 50,
                      height: 50,
                      backgroundColor: primaryColor,
                      border: '2px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}
                  />
                  <TextField
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#1976d2"
                    size="medium"
                    sx={{ minWidth: 150 }}
                  />
                </Box>
                <Popper open={showColorPicker} anchorEl={colorPickerAnchor} placement="bottom-start">
                  <ClickAwayListener onClickAway={handleColorPickerClose}>
                    <Paper sx={{ p: 2, mt: 1 }}>
                      <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                    </Paper>
                  </ClickAwayListener>
                </Popper>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Public Pages Theme */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Public Pages Theme
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={publicPagesTheme}
                    label="Theme"
                    onChange={(e) => setPublicPagesTheme(e.target.value)}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Logo Uploads */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Logo Settings
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                      Front Website Logo
                    </Typography>
                    {renderLogoUploadBox(frontWebsiteDropzone, 'frontWebsite', 'Front Website Logo', logos.frontWebsite)}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                      Light Mode Logo
                    </Typography>
                    {renderLogoUploadBox(lightModeDropzone, 'lightMode', 'Light Mode Logo', logos.lightMode)}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                      Dark Mode Logo
                    </Typography>
                    {renderLogoUploadBox(darkModeDropzone, 'darkMode', 'Dark Mode Logo', logos.darkMode)}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                      Login Screen Logo
                    </Typography>
                    {renderLogoUploadBox(loginScreenDropzone, 'loginScreen', 'Login Screen Logo', logos.loginScreen)}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                      Favicon
                    </Typography>
                    {renderLogoUploadBox(faviconDropzone, 'favicon', 'Favicon', logos.favicon)}
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Instructions */}
              <Box sx={{ mb: 4 }}>
                <Paper sx={{ p: 3, backgroundColor: 'action.hover' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Theme Configuration Instructions
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Configure your application's visual appearance:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>App Name:</strong> The main application name displayed throughout the interface
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Primary Color:</strong> The main brand color used for buttons, links, and accents
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>Logos:</strong> Upload different logo variations for various contexts (recommended: PNG format, transparent background)
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography variant="body2">
                        <strong>Public Pages Theme:</strong> Default theme for non-authenticated pages
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>

              {/* Save Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  startIcon={<i className="ri-save-line" />}
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ThemeSettings