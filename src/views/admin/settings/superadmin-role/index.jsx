'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Checkbox from '@mui/material/Checkbox'
import Alert from '@mui/material/Alert'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

// Utils
import { showSuccessToast, showErrorToast } from '@/utils/toast'

const RolesAndPermissions = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [rolePermissions, setRolePermissions] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Dialog states
  const [openRoleDialog, setOpenRoleDialog] = useState(false)
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedPermission, setSelectedPermission] = useState(null)

  // Form states
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    isActive: true,
    isDefault: false
  })

  const [permissionForm, setPermissionForm] = useState({
    name: '',
    description: '',
    category: '',
    isActive: true
  })

  const permissionCategories = [
    'User Management',
    'Content Management',
    'System Administration',
    'Financial Management',
    'Report Management',
    'Settings Management',
    'Company Management',
    'Module Management',
    'Feature Management'
  ]

  // Fetch data on component mount
  useEffect(() => {
    fetchRoles()
    fetchPermissions()
    fetchRolePermissions()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/roles')
      if (response.ok) {
        const data = await response.json()
        setRoles(data)
      } else {
        throw new Error('Failed to fetch roles')
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      setError('Failed to load roles')
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/permissions')
      if (response.ok) {
        const data = await response.json()
        setPermissions(data)
      } else {
        throw new Error('Failed to fetch permissions')
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
      setError('Failed to load permissions')
    } finally {
      setLoading(false)
    }
  }

  const fetchRolePermissions = async () => {
    try {
      const response = await fetch('/api/role-permissions')
      if (response.ok) {
        const data = await response.json()
        setRolePermissions(data)
      } else {
        throw new Error('Failed to fetch role permissions')
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error)
      setError('Failed to load role permissions')
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handlePermissionSubmit = async () => {
    try {
      setLoading(true)
      const method = selectedPermission ? 'PUT' : 'POST'
      const url = selectedPermission ? `/api/permissions/${selectedPermission.id}` : '/api/permissions'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(permissionForm)
      })

      if (response.ok) {
        const message = selectedPermission ? 'Permission updated successfully' : 'Permission created successfully'
        showSuccessToast(message)
        setSuccess(message)
        setOpenPermissionDialog(false)
        setSelectedPermission(null)
        setPermissionForm({ name: '', description: '', category: '', isActive: true })
        fetchPermissions()
      } else {
        throw new Error('Failed to save permission')
      }
    } catch (error) {
      console.error('Error saving permission:', error)
      showErrorToast('Failed to save permission')
      setError('Failed to save permission')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleEdit = (role) => {
    setSelectedRole(role)
    setRoleForm({
      name: role.name,
      description: role.description || '',
      isActive: role.isActive,
      isDefault: role.isDefault
    })
    setOpenRoleDialog(true)
  }

  const handleRoleDelete = async (roleId) => {
    if (!confirm('Are you sure you want to delete this role?')) return

    try {
      setLoading(true)
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showSuccessToast('Role deleted successfully')
        setSuccess('Role deleted successfully')
        fetchRoles()
      } else {
        throw new Error('Failed to delete role')
      }
    } catch (error) {
      console.error('Error deleting role:', error)
      showErrorToast('Failed to delete role')
      setError('Failed to delete role')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleSubmit = async () => {
    try {
      setLoading(true)
      const method = selectedRole ? 'PUT' : 'POST'
      const url = selectedRole ? `/api/roles/${selectedRole.id}` : '/api/roles'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roleForm)
      })

      if (response.ok) {
        const message = selectedRole ? 'Role updated successfully' : 'Role created successfully'
        showSuccessToast(message)
        setSuccess(message)
        setOpenRoleDialog(false)
        setSelectedRole(null)
        setRoleForm({ name: '', description: '', isActive: true, isDefault: false })
        fetchRoles()
      } else {
        throw new Error('Failed to save role')
      }
    } catch (error) {
      console.error('Error saving role:', error)
      showErrorToast('Failed to save role')
      setError('Failed to save role')
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionEdit = (permission) => {
    setSelectedPermission(permission)
    setPermissionForm({
      name: permission.name,
      description: permission.description || '',
      category: permission.category || '',
      isActive: permission.isActive
    })
    setOpenPermissionDialog(true)
  }

  const handlePermissionDelete = async (permissionId) => {
    if (!confirm('Are you sure you want to delete this permission?')) return

    try {
      setLoading(true)
      const response = await fetch(`/api/permissions/${permissionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showSuccessToast('Permission deleted successfully')
        setSuccess('Permission deleted successfully')
        fetchPermissions()
      } else {
        throw new Error('Failed to delete permission')
      }
    } catch (error) {
      console.error('Error deleting permission:', error)
      showErrorToast('Failed to delete permission')
      setError('Failed to delete permission')
    } finally {
      setLoading(false)
    }
  }

  const handlePermissionToggle = async (roleId, permissionId) => {
    try {
      const isGranted = hasPermission(roleId, permissionId)

      const response = await fetch('/api/role-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roleId,
          permissionId,
          granted: !isGranted
        })
      })

      if (response.ok) {
        setRolePermissions(prev => ({
          ...prev,
          [roleId]: isGranted 
            ? prev[roleId]?.filter(id => id !== permissionId) || []
            : [...(prev[roleId] || []), permissionId]
        }))
        showSuccessToast('Permission updated successfully')
      } else {
        throw new Error('Failed to update permission')
      }
    } catch (error) {
      console.error('Error updating permission:', error)
      showErrorToast('Failed to update permission')
    }
  }

  const hasPermission = (roleId, permissionId) => {
    // Superadmin always has all permissions
    if (roleId === 'SUPER_ADMIN') return true
    return rolePermissions[roleId]?.includes(permissionId) || false
  }

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const category = permission.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(permission)
    return acc
  }, {})

  const RolesTab = () => (
    <Card>
      <CardHeader 
        title="Roles Management"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenRoleDialog(true)}
            startIcon={<i className="ri-add-line" />}
          >
            Add Role
          </Button>
        }
      />
      <CardContent>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Manage system roles and their permissions. System-defined roles like Superadmin cannot be modified.
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Users</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Default</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => {
                const isSystemRole = role.id === 'SUPER_ADMIN' || role.name === 'Superadmin'
                
                return (
                  <TableRow key={role.id}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {role.name}
                        {isSystemRole && (
                          <Chip 
                            label="System"
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {role.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${role.userCount || 0} users`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={role.isActive ? 'Active' : 'Inactive'}
                        color={role.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {role.isDefault && (
                        <Chip 
                          label="Default"
                          color="primary"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => handleRoleEdit(role)}
                        disabled={isSystemRole || loading}
                        title={isSystemRole ? 'System roles cannot be edited' : 'Edit role'}
                      >
                        <i className="ri-edit-box-line" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleRoleDelete(role.id)}
                        disabled={isSystemRole || loading || role.userCount > 0}
                        title={
                          isSystemRole 
                            ? 'System roles cannot be deleted' 
                            : role.userCount > 0 
                            ? 'Cannot delete role with assigned users'
                            : 'Delete role'
                        }
                      >
                        <i className="ri-delete-bin-line" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )

  const PermissionsTab = () => (
    <Card>
      <CardHeader 
        title="Permissions Management"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenPermissionDialog(true)}
            startIcon={<i className="ri-add-line" />}
          >
            Add Permission
          </Button>
        }
      />
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
            <Accordion key={category} defaultExpanded>
              <AccordionSummary expandIcon={<i className="ri-arrow-down-s-line" />}>
                <Typography variant="h6">{category}</Typography>
                <Chip 
                  label={`${categoryPermissions.length} permissions`}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Permission Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoryPermissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {permission.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {permission.description || 'No description'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={permission.isActive ? 'Active' : 'Inactive'}
                              color={permission.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              onClick={() => handlePermissionEdit(permission)}
                            >
                              <i className="ri-edit-box-line" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handlePermissionDelete(permission.id)}
                            >
                              <i className="ri-delete-bin-line" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const AssignmentTab = () => (
    <Card>
      <CardHeader title="Role-Permission Assignment" />
      <CardContent>
        <Typography variant="body1" className="mb-4">
          Assign permissions to roles by checking the corresponding boxes.
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Permission</TableCell>
                <TableCell>Category</TableCell>
                {roles.map(role => (
                  <TableCell key={role.id} align="center">
                    <Typography variant="subtitle2">{role.name}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>
                    <Typography variant="body2">{permission.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={permission.category} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  {roles.map(role => (
                    <TableCell key={role.id} align="center">
                      <Checkbox
                        checked={hasPermission(role.id, permission.id)}
                        onChange={() => handlePermissionToggle(role.id, permission.id)}
                        disabled={role.id === 'SUPER_ADMIN'} // Superadmin always has all permissions
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )

  return (
    <Box>
      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="mb-4" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card>
        <CardHeader title="Roles & Permissions" />
        <CardContent>
          <Typography variant="body1" className="mb-4">
            Manage user roles and permissions for your application. Configure what users can and cannot do.
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Roles" />
            <Tab label="Permissions" />
            <Tab label="Assignment" />
          </Tabs>

          {activeTab === 0 && <RolesTab />}
          {activeTab === 1 && <PermissionsTab />}
          {activeTab === 2 && <AssignmentTab />}
        </CardContent>
      </Card>

      {/* Role Dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRole ? 'Edit Role' : 'Add Role'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Role Name"
              value={roleForm.name}
              onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={roleForm.description}
              onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={roleForm.isActive}
                  onChange={(e) => setRoleForm({ ...roleForm, isActive: e.target.checked })}
                />
              }
              label="Active"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={roleForm.isDefault}
                  onChange={(e) => setRoleForm({ ...roleForm, isDefault: e.target.checked })}
                />
              }
              label="Default Role (assigned to new users)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenRoleDialog(false)
              setSelectedRole(null)
              setRoleForm({ name: '', description: '', isActive: true, isDefault: false })
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRoleSubmit} 
            variant="contained"
            disabled={!roleForm.name || loading}
          >
            {selectedRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Permission Dialog */}
      <Dialog open={openPermissionDialog} onClose={() => setOpenPermissionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPermission ? 'Edit Permission' : 'Add Permission'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Permission Name"
              value={permissionForm.name}
              onChange={(e) => setPermissionForm({ ...permissionForm, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={permissionForm.description}
              onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={permissionForm.category}
                onChange={(e) => setPermissionForm({ ...permissionForm, category: e.target.value })}
                label="Category"
              >
                {permissionCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={permissionForm.isActive}
                  onChange={(e) => setPermissionForm({ ...permissionForm, isActive: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenPermissionDialog(false)
              setSelectedPermission(null)
              setPermissionForm({ name: '', description: '', category: '', isActive: true })
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePermissionSubmit} 
            variant="contained"
            disabled={!permissionForm.name || !permissionForm.category || loading}
          >
            {selectedPermission ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RolesAndPermissions