
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import DialogContentText from '@mui/material/DialogContentText'

const DeletePackageDialog = ({ open, handleClose, onConfirm, packageData }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!packageData) return

    try {
      setLoading(true)
      const response = await fetch(`/api/packages/${packageData.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        handleClose()
        onConfirm()
      } else {
        const error = await response.json()
        alert(error.error || error.message || 'Failed to delete package')
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      alert('Failed to delete package')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-package-dialog-title"
      aria-describedby="delete-package-dialog-description"
    >
      <DialogTitle id="delete-package-dialog-title">
        <Typography variant="h5" component="span">
          Delete Package
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-package-dialog-description">
          Are you sure you want to delete the package "{packageData?.name}"? This action cannot be undone and may affect companies currently using this package.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          variant="contained" 
          autoFocus 
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeletePackageDialog
