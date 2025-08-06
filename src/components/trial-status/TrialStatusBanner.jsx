
'use client'

import { useState, useEffect } from 'react'
import { 
  Alert, 
  AlertTitle, 
  Button, 
  LinearProgress, 
  Box, 
  Typography,
  Chip,
  Card,
  CardContent,
  IconButton,
  Collapse
} from '@mui/material'
import { useRouter } from 'next/navigation'

const TrialStatusBanner = ({ companyId }) => {
  const [trialData, setTrialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (companyId) {
      fetchTrialStatus()
    }
  }, [companyId])

  const fetchTrialStatus = async () => {
    try {
      const response = await fetch(`/api/companies/trial-status?companyId=${companyId}`)
      const data = await response.json()
      
      if (data.success) {
        setTrialData(data)
      }
    } catch (error) {
      console.error('Error fetching trial status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = () => {
    router.push('/packages')
  }

  const handleDismiss = () => {
    setDismissed(true)
  }

  if (loading || !trialData || dismissed) {
    return null
  }

  const { trial, company } = trialData
  
  // Don't show banner if not on trial or trial hasn't expired and has more than 7 days
  if (trial.status === 'active' && trial.daysRemaining > 7) {
    return null
  }

  const getSeverity = () => {
    if (trial.status === 'expired') return 'error'
    if (trial.status === 'expiring_soon') return 'warning'
    return 'info'
  }

  const getProgressValue = () => {
    const totalDays = 30
    const daysUsed = totalDays - trial.daysRemaining
    return Math.min((daysUsed / totalDays) * 100, 100)
  }

  const getIcon = () => {
    if (trial.status === 'expired') return 'ri-error-warning-line'
    if (trial.status === 'expiring_soon') return 'ri-time-line'
    return 'ri-information-line'
  }

  return (
    <Alert 
      severity={getSeverity()} 
      sx={{ 
        mb: 3,
        '& .MuiAlert-action': {
          alignItems: 'flex-start',
          pt: 0
        }
      }}
      action={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <Button 
            color="inherit" 
            size="small" 
            variant="outlined"
            onClick={handleUpgrade}
            startIcon={<i className="ri-shopping-cart-line" />}
          >
            {trial.status === 'expired' ? 'Upgrade Now' : 'Upgrade'}
          </Button>
          {trial.status !== 'expired' && (
            <IconButton 
              size="small" 
              onClick={handleDismiss}
              sx={{ color: 'inherit' }}
            >
              <i className="ri-close-line" />
            </IconButton>
          )}
        </Box>
      }
    >
      <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <i className={getIcon()} />
        {trial.status === 'expired' ? 'Trial Expired' : 'Trial Period'}
        <Chip 
          label={trial.status === 'expired' ? 'EXPIRED' : `${trial.daysRemaining} days left`}
          size="small" 
          color={getSeverity()}
          sx={{ ml: 1 }}
        />
      </AlertTitle>
      
      <Box sx={{ mt: 1 }}>
        {trial.status === 'expired' ? (
          <Typography variant="body2">
            Your trial period has ended. Please choose a plan to continue using our services without interruption.
          </Typography>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your trial will expire in {trial.daysRemaining} day{trial.daysRemaining !== 1 ? 's' : ''}. 
              Upgrade to a paid plan to continue without interruption.
            </Typography>
            <Box sx={{ width: '100%', mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Trial Progress
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.round(getProgressValue())}% used
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getProgressValue()} 
                color={getSeverity()}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          </>
        )}
        
        <Button 
          size="small" 
          onClick={() => setExpanded(!expanded)}
          sx={{ mt: 1, p: 0, minWidth: 'auto' }}
        >
          <Typography variant="caption" sx={{ textDecoration: 'underline' }}>
            {expanded ? 'Hide' : 'Show'} trial details
          </Typography>
        </Button>
        
        <Collapse in={expanded}>
          <Card variant="outlined" sx={{ mt: 2, bgcolor: 'background.paper' }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Trial Information for {company.name}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, fontSize: '0.875rem' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Start Date:</Typography>
                  <Typography variant="body2">
                    {new Date(trial.startDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">End Date:</Typography>
                  <Typography variant="body2">
                    {new Date(trial.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Status:</Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {trial.status.replace('_', ' ')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Package:</Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {company.package || 'Trial'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Collapse>
      </Box>
    </Alert>
  )
}

export default TrialStatusBanner
