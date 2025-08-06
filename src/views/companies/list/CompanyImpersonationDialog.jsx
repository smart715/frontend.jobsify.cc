import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
} from '@mui/material'

const CompanyImpersonationDialog = ({ open, onClose, onConfirm, company }) => {
  if (!company) return null

  const handleConfirm = () => {
    onConfirm(company)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              width: 40,
              height: 40,
              fontSize: '1.2rem',
            }}
          >
            {company.companyName?.charAt(0)?.toUpperCase() || 'C'}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              Login as Company
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Impersonate company account
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to login as{' '}
          <strong>"{company.companyName}"</strong>?
        </Typography>

        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50', 
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Company ID:</strong> {company.companyId}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Company Name:</strong> {company.companyName}
          </Typography>
          {company.adminEmail && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Admin Email:</strong> {company.adminEmail}
            </Typography>
          )}
          <Typography variant="body2">
            <strong>Status:</strong> {company.status || 'Active'}
          </Typography>
        </Box>

        
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          startIcon={<i className="ri-login-circle-line" />}
        >
          Login as Company
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompanyImpersonationDialog
