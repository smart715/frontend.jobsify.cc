
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Paper
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Utils
import { showSuccessToast, showErrorToast } from '@/utils/toast'

// Styled Components
const ModuleCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}))

const ModuleSettings = () => {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [installDialogOpen, setInstallDialogOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)
  const [updating, setUpdating] = useState({})
  const [addModuleDialogOpen, setAddModuleDialogOpen] = useState(false)

  // Fetch modules data
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/modules')
        
        if (response.ok) {
          const data = await response.json()
          setModules(data)
        } else {
          showErrorToast('Failed to load modules')
        }
      } catch (error) {
        console.error('Error fetching modules:', error)
        showErrorToast('Error loading modules')
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  const handleToggleModule = async (moduleId, isActive) => {
    try {
      setUpdating(prev => ({ ...prev, [moduleId]: true }))
      
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        // Update local state
        setModules(prev => prev.map(module => 
          module.id === moduleId 
            ? { ...module, isActive: !isActive }
            : module
        ))
        showSuccessToast(`Module ${!isActive ? 'activated' : 'deactivated'} successfully`)
      } else {
        showErrorToast('Failed to update module status')
      }
    } catch (error) {
      console.error('Error updating module:', error)
      showErrorToast('Error updating module')
    } finally {
      setUpdating(prev => ({ ...prev, [moduleId]: false }))
    }
  }

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setModules(prev => prev.filter(module => module.id !== moduleId))
        showSuccessToast('Module deleted successfully')
      } else {
        showErrorToast('Failed to delete module')
      }
    } catch (error) {
      console.error('Error deleting module:', error)
      showErrorToast('Error deleting module')
    }
  }

  const confirmInstallModule = async () => {
    if (!selectedModule) return
    
    try {
      // This would be actual installation logic for external modules
      console.log('Installing module:', selectedModule)
      showSuccessToast('Module installation feature coming soon')
      setInstallDialogOpen(false)
      setSelectedModule(null)
    } catch (error) {
      console.error('Error installing module:', error)
      showErrorToast('Error installing module')
    }
  }

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (module.description && module.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Module Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and configure your application modules
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<i className="ri-add-line" />}
          onClick={() => setAddModuleDialogOpen(true)}
        >
          Add New Module
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<i className="ri-download-line" />}
          onClick={() => setInstallDialogOpen(true)}
        >
          Install External Module
        </Button>
      </Box>

      {/* Search and Stats */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="ri-search-line" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {modules.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Modules
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {modules.filter(m => m.isActive).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                  {modules.filter(m => !m.isActive).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inactive
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Modules List */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Application Modules
            </Typography>
            <Chip 
              label={`${filteredModules.length} modules`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {filteredModules.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No modules found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? 'Try adjusting your search criteria' : 'Add your first module to get started'}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredModules.map((module) => (
                <Grid item xs={12} key={module.id}>
                  <ModuleCard variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Module Icon */}
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: module.isActive ? 'primary.main' : 'grey.400',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                          }}
                        >
                          {module.name.charAt(0).toUpperCase()}
                        </Box>
                        
                        {/* Module Info */}
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {module.name}
                            </Typography>
                            <Chip
                              label={module.isActive ? 'Active' : 'Inactive'}
                              size="small"
                              color={module.isActive ? 'success' : 'default'}
                              variant={module.isActive ? 'filled' : 'outlined'}
                            />
                          </Box>
                          {module.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {module.description}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={`ID: ${module.id.slice(-8)}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={module.isActive}
                                onChange={() => handleToggleModule(module.id, module.isActive)}
                                disabled={updating[module.id]}
                              />
                            }
                            label=""
                          />
                          
                          {updating[module.id] && (
                            <CircularProgress size={20} />
                          )}
                          
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteModule(module.id)}
                            disabled={updating[module.id]}
                          >
                            <i className="ri-delete-bin-line" />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </ModuleCard>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Install Module Dialog */}
      <Dialog open={installDialogOpen} onClose={() => setInstallDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Install External Module</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            External module installation feature is coming soon. You can currently manage built-in modules.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            This feature will allow you to install modules from external sources or the module marketplace.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInstallDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Module Dialog */}
      <Dialog open={addModuleDialogOpen} onClose={() => setAddModuleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Module</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Use the Modules section to add new modules to your application.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Navigate to Modules → List to create and manage modules, then return here to configure their settings.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => {
                setAddModuleDialogOpen(false)
                window.location.href = '/en/modules'
              }}
            >
              Go to Modules Section
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModuleDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ModuleSettings
