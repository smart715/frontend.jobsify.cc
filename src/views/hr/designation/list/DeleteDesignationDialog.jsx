
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
import IconButton from '@mui/material/IconButton'

const DeleteDesignationDialog = ({ open, handleClose, designation, onSuccess }) => {
  // States
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!designation) return

    try {
      setLoading(true)
      const response = await fetch(`/api/designations/${designation.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        handleClose()
        onSuccess()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to delete designation')
      }
    } catch (error) {
      console.error('Error deleting designation:', error)
      alert('Failed to delete designation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='delete-designation-dialog-title'
      aria-describedby='delete-designation-dialog-description'
    >
      <DialogTitle id='delete-designation-dialog-title'>
        <div className='flex items-center justify-between'>
          <span>Delete Designation</span>
          <IconButton size='small' onClick={handleClose}>
            <i className='ri-close-line text-2xl' />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='delete-designation-dialog-description'>
          Are you sure you want to delete the designation "{designation?.name}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary' disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color='error' variant='contained' disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDesignationDialog
