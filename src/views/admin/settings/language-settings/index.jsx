
'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material'
import { toast } from '@/utils/toast'
import ActionBtn from '@/components/ActionBtn'

const LanguageSettings = () => {
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editingLanguage, setEditingLanguage] = useState(null)
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    code: '',
    flag: '',
    rtlStatus: false,
    status: true,
    isDefault: false
  })

  useEffect(() => {
    fetchLanguages()
  }, [])

  const fetchLanguages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/languages')
      if (response.ok) {
        const data = await response.json()
        setLanguages(data)
      } else {
        toast.error('Failed to fetch languages')
      }
    } catch (error) {
      console.error('Error fetching languages:', error)
      toast.error('Error fetching languages')
    } finally {
      setLoading(false)
    }
  }

  const handleAddLanguage = async () => {
    try {
      if (!newLanguage.name || !newLanguage.code) {
        toast.error('Name and code are required')
        return
      }

      const response = await fetch('/api/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLanguage)
      })

      if (response.ok) {
        const data = await response.json()
        setLanguages([...languages, data])
        setNewLanguage({
          name: '',
          code: '',
          flag: '',
          rtlStatus: false,
          status: true,
          isDefault: false
        })
        setOpenAddDialog(false)
        toast.success('Language added successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to add language')
      }
    } catch (error) {
      console.error('Error adding language:', error)
      toast.error('Error adding language')
    }
  }

  const handleEditLanguage = async () => {
    try {
      if (!editingLanguage.name || !editingLanguage.code) {
        toast.error('Name and code are required')
        return
      }

      const response = await fetch(`/api/languages/${editingLanguage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingLanguage)
      })

      if (response.ok) {
        const data = await response.json()
        setLanguages(languages.map(lang => 
          lang.id === editingLanguage.id ? data : lang
        ))
        setOpenEditDialog(false)
        setEditingLanguage(null)
        toast.success('Language updated successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update language')
      }
    } catch (error) {
      console.error('Error updating language:', error)
      toast.error('Error updating language')
    }
  }

  const handleDeleteLanguage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this language?')) {
      return
    }

    try {
      const response = await fetch(`/api/languages/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setLanguages(languages.filter(lang => lang.id !== id))
        toast.success('Language deleted successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete language')
      }
    } catch (error) {
      console.error('Error deleting language:', error)
      toast.error('Error deleting language')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const language = languages.find(lang => lang.id === id)
      const response = await fetch(`/api/languages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...language,
          status: newStatus
        })
      })

      if (response.ok) {
        const data = await response.json()
        setLanguages(languages.map(lang => 
          lang.id === id ? data : lang
        ))
        toast.success('Language status updated')
      } else {
        toast.error('Failed to update language status')
      }
    } catch (error) {
      console.error('Error updating language status:', error)
      toast.error('Error updating language status')
    }
  }

  const handleRTLChange = async (id, rtlStatus) => {
    try {
      const language = languages.find(lang => lang.id === id)
      const response = await fetch(`/api/languages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...language,
          rtlStatus
        })
      })

      if (response.ok) {
        const data = await response.json()
        setLanguages(languages.map(lang => 
          lang.id === id ? data : lang
        ))
        toast.success('RTL status updated')
      } else {
        toast.error('Failed to update RTL status')
      }
    } catch (error) {
      console.error('Error updating RTL status:', error)
      toast.error('Error updating RTL status')
    }
  }

  const openEditLanguageDialog = (language) => {
    setEditingLanguage({ ...language })
    setOpenEditDialog(true)
  }

  const getStatusChip = (status) => {
    return status ? (
      <Chip label="Active" color="success" size="small" />
    ) : (
      <Chip label="Inactive" color="default" size="small" />
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Language Settings
          </Typography>
          
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<i className="ri-add-line" />}
              onClick={() => setOpenAddDialog(true)}
            >
              Add New Language
            </Button>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Simply enabling a language setting will not automatically change the language. 
              To effectively change the language, you must also have translations available in that specific language.
            </Typography>
          </Alert>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Language Name</TableCell>
                <TableCell>Language Code</TableCell>
                <TableCell>RTL Status</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {languages.map((language) => (
                <TableRow key={language.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {language.flag && <span>{language.flag}</span>}
                      <Typography variant="body2">
                        {language.name}
                        {language.isDefault && (
                          <Chip label="Default" color="primary" size="small" sx={{ ml: 1 }} />
                        )}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{language.code}</Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={language.rtlStatus}
                      onChange={(e) => handleRTLChange(language.id, e.target.checked)}
                      disabled={language.isDefault}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={language.status}
                      onChange={(e) => handleStatusChange(language.id, e.target.checked)}
                      disabled={language.isDefault}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <ActionBtn
                      mainButtonText="Edit"
                      mainButtonIcon="ri-pencil-line"
                      mainButtonProps={{
                        onClick: () => openEditLanguageDialog(language)
                      }}
                      options={[
                        {
                          text: 'Delete',
                          icon: 'ri-delete-bin-7-line',
                          menuItemProps: {
                            onClick: () => handleDeleteLanguage(language.id),
                            className: 'flex items-center gap-2 text-textSecondary',
                            disabled: language.isDefault
                          }
                        }
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Language Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Language</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Language Name"
                value={newLanguage.name}
                onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Language Code"
                value={newLanguage.code}
                onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                fullWidth
                required
                helperText="e.g., en, fr, es, de"
              />
              <TextField
                label="Flag"
                value={newLanguage.flag}
                onChange={(e) => setNewLanguage({ ...newLanguage, flag: e.target.value })}
                fullWidth
                helperText="Unicode flag emoji (optional)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newLanguage.rtlStatus}
                    onChange={(e) => setNewLanguage({ ...newLanguage, rtlStatus: e.target.checked })}
                  />
                }
                label="RTL Language"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newLanguage.status}
                    onChange={(e) => setNewLanguage({ ...newLanguage, status: e.target.checked })}
                  />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newLanguage.isDefault}
                    onChange={(e) => setNewLanguage({ ...newLanguage, isDefault: e.target.checked })}
                  />
                }
                label="Set as Default"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddLanguage} variant="contained">Add Language</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Language Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Language</DialogTitle>
          <DialogContent>
            {editingLanguage && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  label="Language Name"
                  value={editingLanguage.name}
                  onChange={(e) => setEditingLanguage({ ...editingLanguage, name: e.target.value })}
                  fullWidth
                  required
                />
                <TextField
                  label="Language Code"
                  value={editingLanguage.code}
                  onChange={(e) => setEditingLanguage({ ...editingLanguage, code: e.target.value })}
                  fullWidth
                  required
                  helperText="e.g., en, fr, es, de"
                />
                <TextField
                  label="Flag"
                  value={editingLanguage.flag || ''}
                  onChange={(e) => setEditingLanguage({ ...editingLanguage, flag: e.target.value })}
                  fullWidth
                  helperText="Unicode flag emoji (optional)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editingLanguage.rtlStatus}
                      onChange={(e) => setEditingLanguage({ ...editingLanguage, rtlStatus: e.target.checked })}
                    />
                  }
                  label="RTL Language"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editingLanguage.status}
                      onChange={(e) => setEditingLanguage({ ...editingLanguage, status: e.target.checked })}
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editingLanguage.isDefault}
                      onChange={(e) => setEditingLanguage({ ...editingLanguage, isDefault: e.target.checked })}
                    />
                  }
                  label="Set as Default"
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditLanguage} variant="contained">Update Language</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default LanguageSettings
