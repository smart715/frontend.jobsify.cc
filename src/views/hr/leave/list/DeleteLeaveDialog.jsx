
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

const DeleteLeaveDialog = ({ open, handleClose, leave, onSuccess }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!leave) return

    try {
      setLoading(true)
      const response = await fetch(`/api/leaves/${leave.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        handleClose()
        onSuccess()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to delete leave')
      }
    } catch (error) {
      console.error('Error deleting leave:', error)
      alert('Failed to delete leave')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Leave</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this leave record for "{leave?.employee?.name}"? This action cannot be undone.
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

export default DeleteLeaveDialog
