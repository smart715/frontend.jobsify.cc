
'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const TrialGuard = ({ children, companyId }) => {
  const [trialData, setTrialData] = useState(null)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (companyId && session?.user) {
      checkTrialStatus()
    }
  }, [companyId, session])

  const checkTrialStatus = async () => {
    try {
      const response = await fetch(`/api/companies/trial-status?companyId=${companyId}`)
      const data = await response.json()
      
      if (data.success) {
        setTrialData(data)
        
        // Show upgrade dialog if trial is expired
        if (data.trial.status === 'expired') {
          setShowUpgradeDialog(true)
        }
      }
    } catch (error) {
      console.error('Error checking trial status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = () => {
    router.push('/packages')
  }

  const handleContactSales = () => {
    router.push('/support')
  }

  const getTrialProgress = () => {
    if (!trialData?.trial) return 0
    const totalDays = 30
    const daysUsed = totalDays - trialData.trial.daysRemaining
    return Math.min((daysUsed / totalDays) * 100, 100)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  // If trial is expired, show upgrade dialog and restrict access
  if (trialData?.trial.status === 'expired') {
    return (
      <>
        <Dialog 
          open={showUpgradeDialog} 
          maxWidth="md" 
          fullWidth
          disableEscapeKeyDown
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <Typography variant="h4" color="error" fontWeight="600" sx={{ mb: 1 }}>
              🚫 Trial Period Expired
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Your 30-day free trial has ended
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ textAlign: 'center', py: 3 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Your trial period has ended. To continue using our platform and access all features, 
                please choose a subscription plan that fits your business needs.
              </Typography>
            </Alert>
            
            <Card variant="outlined" sx={{ bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" color="error.main" gutterBottom>
                  {trialData.company.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Trial ended on: {new Date(trialData.trial.endDate).toLocaleDateString()}
                  </Typography>
                  <Chip 
                    label="EXPIRED" 
                    color="error" 
                    size="small"
                    variant="filled"
                  />
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <i className="ri-star-line mr-2" style={{ color: '#ffa726' }} />
                What you'll get with a paid plan:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  ✅ Unlimited access to all features
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  ✅ Priority customer support
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  ✅ Advanced reporting and analytics
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  ✅ Data backup and security
                </Typography>
                <Typography component="li" variant="body2">
                  ✅ API access and integrations
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleUpgrade}
              sx={{ minWidth: 150 }}
              startIcon={<i className="ri-shopping-cart-line" />}
            >
              View Plans & Upgrade
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={handleContactSales}
              sx={{ minWidth: 150 }}
              startIcon={<i className="ri-customer-service-line" />}
            >
              Contact Sales
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Show limited access content */}
        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'error.50', borderRadius: 2, border: '1px solid', borderColor: 'error.200' }}>
          <i className="ri-lock-line text-4xl text-red-500 mb-4" />
          <Typography variant="h5" color="error.main" gutterBottom fontWeight="600">
            Access Restricted
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your trial period has expired. Please upgrade your plan to access this feature.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpgrade}
            startIcon={<i className="ri-arrow-right-line" />}
          >
            Upgrade Now
          </Button>
        </Box>
      </>
    )
  }

  // Show trial warning if expiring soon
  if (trialData?.trial.status === 'expiring_soon') {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="600">
                ⏰ Trial Expiring Soon
              </Typography>
              <Typography variant="body2">
                Only {trialData.trial.daysRemaining} day{trialData.trial.daysRemaining !== 1 ? 's' : ''} left in your trial. 
                Upgrade now to avoid service interruption.
              </Typography>
              <Box sx={{ mt: 1, width: 200 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={getTrialProgress()} 
                  color="warning"
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            </Box>
            <Button 
              variant="contained" 
              color="warning" 
              size="small"
              onClick={handleUpgrade}
            >
              Upgrade
            </Button>
          </Box>
        </Alert>
        {children}
      </Box>
    )
  }

  // Normal access - render children
  return children
}

export default TrialGuard
