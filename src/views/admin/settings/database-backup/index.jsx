
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// Toast
import { showSuccessToast, showErrorToast } from '@/utils/toast'

const DatabaseBackup = () => {
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(false)
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [settings, setSettings] = useState({
    autoBackup: false,
    backupFrequency: 'daily',
    retentionDays: 30,
    compression: true,
    emailNotification: false,
  })
  const [scheduleDialog, setScheduleDialog] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)

  // Fetch backups and settings on component mount
  useEffect(() => {
    fetchBackups()
    fetchSettings()
  }, [])

  const fetchBackups = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/database-backup')
      if (response.ok) {
        const data = await response.json()
        setBackups(data)
      } else {
        showErrorToast('Failed to fetch backups')
      }
    } catch (error) {
      console.error('Error fetching backups:', error)
      showErrorToast('Failed to fetch backups')
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/backup-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        console.error('Failed to fetch backup settings')
      }
    } catch (error) {
      console.error('Error fetching backup settings:', error)
    }
  }

  const handleCreateBackup = async () => {
    setBackupInProgress(true)
    try {
      const response = await fetch('/api/admin/database-backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'manual' }),
      })

      if (response.ok) {
        const newBackup = await response.json()
        setBackups(prev => [newBackup, ...prev])
        showSuccessToast('Database backup created successfully!')
      } else {
        const error = await response.json()
        showErrorToast(error.error || 'Failed to create backup')
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      showErrorToast('Failed to create backup')
    } finally {
      setBackupInProgress(false)
    }
  }

  const handleDownload = async (backup) => {
    try {
      const response = await fetch(`/api/admin/database-backup/download?filename=${backup.filename}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = backup.filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        showSuccessToast(`Downloading ${backup.filename}...`)
      } else {
        showErrorToast('Failed to download backup')
      }
    } catch (error) {
      console.error('Error downloading backup:', error)
      showErrorToast('Failed to download backup')
    }
  }

  const handleDelete = async (backup) => {
    if (!confirm(`Are you sure you want to delete ${backup.filename}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/database-backup?filename=${backup.filename}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBackups(prev => prev.filter(b => b.id !== backup.id))
        showSuccessToast('Backup deleted successfully!')
      } else {
        const error = await response.json()
        showErrorToast(error.error || 'Failed to delete backup')
      }
    } catch (error) {
      console.error('Error deleting backup:', error)
      showErrorToast('Failed to delete backup')
    }
  }

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveSettings = async () => {
    setSettingsLoading(true)
    try {
      const response = await fetch('/api/admin/backup-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        showSuccessToast('Backup settings saved successfully!')
        setScheduleDialog(false)
      } else {
        const error = await response.json()
        showErrorToast(error.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      showErrorToast('Failed to save settings')
    } finally {
      setSettingsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success'
      case 'In Progress':
        return 'info'
      case 'Failed':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Database Backup Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your database backups and configure automatic backup schedules
          </Typography>
        </Box>

        {/* Warning Alert */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Database backups are created using pg_dump when available. 
            For very large databases, the backup process may take some time. Make sure you have 
            sufficient storage space for backup files.
          </Typography>
        </Alert>

        {/* Action Buttons */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<i className="ri-database-2-line" />}
            onClick={handleCreateBackup}
            disabled={backupInProgress}
          >
            {backupInProgress ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Creating Backup...
              </>
            ) : (
              'Create Database Backup'
            )}
          </Button>
          <Button
            variant="outlined"
            startIcon={<i className="ri-settings-3-line" />}
            onClick={() => setScheduleDialog(true)}
          >
            Auto Backup Settings
          </Button>
          <Button
            variant="outlined"
            startIcon={<i className="ri-refresh-line" />}
            onClick={fetchBackups}
            disabled={loading}
          >
            Refresh List
          </Button>
        </Box>

        {/* Backup Progress */}
        {backupInProgress && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Creating database backup...
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {/* Backup List */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Backup History
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : backups.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <i className="ri-database-2-line text-4xl text-textSecondary" />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                No backups found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first database backup to get started
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Filename</TableCell>
                    <TableCell>Backup Size</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <i className="ri-file-3-line" />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {backup.filename}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {backup.size}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {backup.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={backup.type}
                          size="small"
                          variant={backup.type === 'Automatic' ? 'filled' : 'outlined'}
                          color={backup.type === 'Automatic' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={backup.status}
                          size="small"
                          color={getStatusColor(backup.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleDownload(backup)}
                            title="Download"
                          >
                            <i className="ri-download-line" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(backup)}
                            title="Delete"
                          >
                            <i className="ri-delete-bin-line" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* Auto Backup Settings Dialog */}
        <Dialog 
          open={scheduleDialog} 
          onClose={() => setScheduleDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Auto Backup Settings
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoBackup}
                      onChange={(e) => handleSettingsChange('autoBackup', e.target.checked)}
                    />
                  }
                  label="Enable Automatic Backups"
                />
              </Grid>
              
              {settings.autoBackup && (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Backup Frequency</InputLabel>
                      <Select
                        value={settings.backupFrequency}
                        label="Backup Frequency"
                        onChange={(e) => handleSettingsChange('backupFrequency', e.target.value)}
                      >
                        <MenuItem value="hourly">Hourly</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Retention Period (Days)"
                      type="number"
                      value={settings.retentionDays}
                      onChange={(e) => handleSettingsChange('retentionDays', parseInt(e.target.value))}
                      helperText="Number of days to keep backup files"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.compression}
                          onChange={(e) => handleSettingsChange('compression', e.target.checked)}
                        />
                      }
                      label="Enable Compression"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.emailNotification}
                          onChange={(e) => handleSettingsChange('emailNotification', e.target.checked)}
                        />
                      }
                      label="Email Notifications"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScheduleDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveSettings}
              disabled={settingsLoading}
            >
              {settingsLoading ? <CircularProgress size={20} /> : 'Save Settings'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default DatabaseBackup
