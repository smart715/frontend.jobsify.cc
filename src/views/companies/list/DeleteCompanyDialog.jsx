
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
import IconButton from '@mui/material/IconButton'

const DeleteCompanyDialog = ({ open, handleClose, onConfirm, companyData }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      handleClose()
    } catch (error) {
      console.error('Error deleting company:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div className="flex items-center justify-between">
          <Typography variant="h6">Delete Company</Typography>
          <IconButton onClick={handleClose} size="small">
            <i className="ri-close-line" />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the company "{companyData?.companyName}"? This action cannot be undone.
        </Typography>
        {companyData?.companyEmail && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Company Email: {companyData.companyEmail}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" disabled={isDeleting}>
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="contained" 
          color="error" 
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteCompanyDialog
