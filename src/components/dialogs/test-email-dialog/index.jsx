
'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'

const TestEmailDialog = ({ open, onClose, onSendTestEmail, emailSettings }) => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!email) {
      setError('Email is required')
      return
    }

    if (!message) {
      setError('Message is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onSendTestEmail(email, message, emailSettings)
      // Reset form and close dialog on success
      setEmail('')
      setMessage('')
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to send test email')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setMessage('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Send Test Email</Typography>
          <IconButton onClick={handleClose} size="small">
            <i className="ri-close-line" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Send a test email to verify your SMTP configuration is working correctly.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="Enter recipient email address"
            helperText="Email address to send the test email to"
          />

          <TextField
            label="Test Message"
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your test message..."
            helperText="Custom message to include in the test email"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSend} 
          variant="contained" 
          disabled={loading || !email || !message}
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TestEmailDialog
