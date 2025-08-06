'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

// Utils Imports
import { toast } from '@/utils/toast'

const SecurityTab = ({ onNext, companyData }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNewCompany, setIsNewCompany] = useState(false)

  useEffect(() => {
    // Check if this is a newly created company
    if (companyData?.isNewCompany) {
      setIsNewCompany(true)
    }
  }, [companyData])

  const handlePasswordSet = async () => {
    if (!password || !confirmPassword) {
      toast.error('Please fill in both password fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    if (!companyData?.id) {
      toast.error('Company data not found')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/companies/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId: companyData.id,
          password: password
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Password set successfully!')
        // Move to next tab
        if (onNext) {
          onNext()
        }
      } else {
        toast.error(result.error || 'Failed to set password')
      }
    } catch (error) {
      console.error('Error setting password:', error)
      toast.error('An error occurred while setting the password')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title="Set Company Password" />
          <CardContent>
            <Grid container spacing={4}>
              {isNewCompany && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info">
                    Company "{companyData?.companyName}" has been created successfully. 
                    Please set a password for the company admin account.
                  </Alert>
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <Typography variant="body1" className="mb-4">
                  {isNewCompany 
                    ? 'Set a password for the newly created company admin account' 
                    : 'Set a password for the company admin account'
                  }
                </Typography>
              </Grid>

              {companyData && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="text.secondary" className="mb-4">
                    Company: {companyData.companyName}<br />
                    Admin Email: {companyData.adminEmail}<br />
                    Company ID: {companyData.companyId}
                  </Typography>
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  helperText="Minimum 6 characters"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  error={confirmPassword && password !== confirmPassword}
                  helperText={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  onClick={handlePasswordSet}
                  disabled={isSubmitting || !password || !confirmPassword || password !== confirmPassword}
                  size="large"
                >
                  {isSubmitting ? 'Setting Password...' : 'Set Password & Continue'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SecurityTab