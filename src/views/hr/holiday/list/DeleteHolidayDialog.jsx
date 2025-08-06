
// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const DeleteHolidayDialog = ({ open, handleClose, onDelete, holidayName }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Holiday</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the holiday "{holidayName}"? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        <Button onClick={onDelete} color='error' variant='contained'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteHolidayDialog
