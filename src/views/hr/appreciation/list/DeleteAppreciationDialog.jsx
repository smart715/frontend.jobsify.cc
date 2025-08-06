
'use client'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material'

const DeleteAppreciationDialog = ({ open, handleClose, onConfirm, appreciationData }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-appreciation-dialog-title"
      aria-describedby="delete-appreciation-dialog-description"
    >
      <DialogTitle id="delete-appreciation-dialog-title">
        <Typography variant="h5" component="span">
          Delete Appreciation
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-appreciation-dialog-description">
          Are you sure you want to delete the appreciation "{appreciationData?.award}" for{' '}
          <strong>{appreciationData?.givenTo}</strong>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteAppreciationDialog
