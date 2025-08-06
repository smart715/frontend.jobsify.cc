'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

// Components
import UpgradePlanDialog from '@/components/dialogs/upgrade-plan'

// Utils
import { showSuccessToast, showErrorToast, showLoadingToast, updateToast } from '@/utils/toast'

const CurrentPlan = () => {
  const params = useParams()
  const [subscription, setSubscription] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)

  useEffect(() => {
    fetchSubscription()
    fetchCompany()
  }, [params.id])

  const fetchSubscription = async () => {
    try {
      const response = await fetch(`/api/company-subscriptions?companyId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      } else {
        console.error('Failed to fetch subscription')
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/companies/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setCompany(data)
      } else {
        console.error('Failed to fetch company')
      }
    } catch (error) {
      console.error('Error fetching company:', error)
    }
  }

  const handleUpgrade = async (packageId) => {
    const loadingToastId = showLoadingToast('Upgrading plan...')

    try {
      const response = await fetch('/api/company-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyId: params.id,
          packageId: packageId,
          billingCycle: 'monthly'
        })
      })

      if (response.ok) {
        const updatedSubscription = await response.json()
        setSubscription(updatedSubscription)
        await fetchCompany() // Refresh company data
        updateToast(loadingToastId, 'Plan upgraded successfully!', 'success')
      } else {
        const error = await response.json()
        updateToast(loadingToastId, `Error upgrading plan: ${error.error}`, 'error')
        throw new Error(error.error)
      }
    } catch (error) {
      console.error('Error upgrading plan:', error)
      updateToast(loadingToastId, 'An error occurred while upgrading plan', 'error')
      throw error
    }
  }

  const handleCancel = async () => {
    const loadingToastId = showLoadingToast('Cancelling subscription...')

    try {
      const response = await fetch(`/api/company-subscriptions/${params.id}/cancel`, {
        method: 'POST'
      })

      if (response.ok) {
        const updatedSubscription = await response.json()
        setSubscription(updatedSubscription)
        await fetchCompany() // Refresh company data
        updateToast(loadingToastId, 'Subscription cancelled successfully', 'success')
      } else {
        const error = await response.json()
        updateToast(loadingToastId, `Error cancelling subscription: ${error.error}`, 'error')
        throw new Error(error.error)
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      updateToast(loadingToastId, 'An error occurred while cancelling subscription', 'error')
      throw error
    }
  }

  const getDaysRemaining = () => {
    if (!subscription?.endDate) return 0
    const now = new Date()
    const endDate = new Date(subscription.endDate)
    const diffTime = endDate - now
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  const getSubscriptionDaysTotal = () => {
    if (!subscription?.startDate || !subscription?.endDate) return 30
    const startDate = new Date(subscription.startDate)
    const endDate = new Date(subscription.endDate)
    const diffTime = endDate - startDate
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTrialDaysRemaining = () => {
    if (!company?.trialEndDate) return 0
    const now = new Date()
    const trialEnd = new Date(company.trialEndDate)
    const diffTime = trialEnd - now
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  const getTrialDaysTotal = () => {
    if (!company?.trialStartDate || !company?.trialEndDate) return 30
    const trialStart = new Date(company.trialStartDate)
    const trialEnd = new Date(company.trialEndDate)
    const diffTime = trialEnd - trialStart
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const isInTrial = () => {
    if (!company?.trialEndDate) return false
    const now = new Date()
    const trialEnd = new Date(company.trialEndDate)
    return now < trialEnd
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading subscription details...</Typography>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    const trialDaysRemaining = getTrialDaysRemaining()
    const trialDaysTotal = getTrialDaysTotal()
    const inTrial = isInTrial()

    return (
      <>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              No Active Subscription
            </Typography>

            {inTrial && company?.trialStartDate && company?.trialEndDate && (
              <>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <AlertTitle>We need your attention!</AlertTitle>
                  Your plan requires update
                </Alert>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Trial Period: {formatDate(company.trialStartDate)} - {formatDate(company.trialEndDate)}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Days
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {trialDaysRemaining} of {trialDaysTotal} Days
                    </Typography>
                  </Box>

                  <LinearProgress 
                    variant="determinate" 
                    value={(trialDaysRemaining / trialDaysTotal) * 100} 
                    sx={{ mb: 1, height: 8, borderRadius: 1 }}
                  />

                  <Typography variant="body2" color="text.secondary">
                    {trialDaysRemaining} days remaining until your plan requires update
                  </Typography>
                </Box>
              </>
            )}

            {!inTrial && (
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                This company doesn't have an active subscription plan.
              </Typography>
            )}

            <Button 
              variant="contained" 
              onClick={() => setUpgradeDialogOpen(true)}
            >
              Choose Plan
            </Button>
          </CardContent>
        </Card>

        <UpgradePlanDialog
          open={upgradeDialogOpen}
          setOpen={setUpgradeDialogOpen}
          currentPlan={null}
          onUpgrade={handleUpgrade}
          onCancelSubscription={handleCancel}
        />
      </>
    )
  }

  const daysRemaining = getDaysRemaining()
  const subscriptionDaysTotal = getSubscriptionDaysTotal()
  const isExpiringSoon = daysRemaining <= 7 && subscription.status === 'active'

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Current Plan
          </Typography>

          {isExpiringSoon && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle>We need your attention!</AlertTitle>
              Your plan requires update
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Your Current Plan is {subscription.package?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {subscription.package?.type}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Active until {formatDate(subscription.nextBillingDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We will send you a notification upon Subscription expiration
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h6">
                ${subscription.amount} Per {subscription.billingCycle === 'yearly' ? 'Year' : 'Month'}
              </Typography>
              {subscription.package?.recommended && (
                <Chip label="Popular" size="small" color="primary" />
              )}
            </Box>

            <Typography variant="body2" color="text.secondary">
              Standard plan for small to medium businesses
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Days
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subscriptionDaysTotal - daysRemaining} of {subscriptionDaysTotal} Days
              </Typography>
            </Box>

            <LinearProgress 
              variant="determinate" 
              value={((subscriptionDaysTotal - daysRemaining) / subscriptionDaysTotal) * 100} 
              sx={{ mb: 1, height: 8, borderRadius: 1 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {daysRemaining} days remaining until your plan requires update
              </Typography>
              <Chip 
                label={subscription.status === 'active' ? 'Active' : 'Inactive'} 
                color={subscription.status === 'active' ? 'success' : 'error'}
                variant="tonal"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => setUpgradeDialogOpen(true)}
            >
              Upgrade Plan
            </Button>
            {subscription.status === 'active' && (
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleCancel}
              >
                Cancel Subscription
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <UpgradePlanDialog
        open={upgradeDialogOpen}
        setOpen={setUpgradeDialogOpen}
        currentPlan={subscription ? {
          name: subscription.package?.name,
          price: subscription.amount,
          packageId: subscription.packageId
        } : null}
        onUpgrade={handleUpgrade}
        onCancelSubscription={handleCancel}
      />
    </>
  )
}

export default CurrentPlan