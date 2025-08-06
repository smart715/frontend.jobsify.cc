
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const DeleteDepartmentDialog = ({ open, handleClose, department, onSuccess }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!department) return

    try {
      setLoading(true)
      const response = await fetch(`/api/departments/${department.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        handleClose()
        onSuccess()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to delete department')
      }
    } catch (error) {
      console.error('Error deleting department:', error)
      alert('Failed to delete department')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Department</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the department "{department?.name}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleDelete} color='error' disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDepartmentDialog
