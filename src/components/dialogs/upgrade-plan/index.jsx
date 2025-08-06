'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

// Utils
import { showSuccessToast, showErrorToast } from '@/utils/toast'

const UpgradePlanDialog = ({
  open,
  setOpen,
  currentPlan = null,
  onUpgrade = () => {},
  onCancelSubscription = () => {},
}) => {
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState('')
  const [loading, setLoading] = useState(false)
  const [packagesLoading, setPackagesLoading] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      setPackagesLoading(true)
      try {
        const response = await fetch('/api/packages')
        if (response.ok) {
          const packagesData = await response.json()
          setPackages(packagesData)

          // Set default selected package if current plan exists
          if (currentPlan && packagesData.length > 0) {
            const currentPackage = packagesData.find(
              (pkg) => pkg.id === currentPlan.packageId
            )
            if (currentPackage) {
              setSelectedPackage(currentPackage.id)
            }
          }
        } else {
          showErrorToast('Failed to load packages')
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
        showErrorToast('Failed to load packages')
      } finally {
        setPackagesLoading(false)
      }
    }

    if (open) {
      fetchPackages()
    }
  }, [open, currentPlan])

  const handleUpgrade = async () => {
    if (!selectedPackage) {
      showErrorToast('Please select a plan')
      return
    }

    setLoading(true)
    try {
      const result = await onUpgrade(selectedPackage, isAnnual ? 'yearly' : 'monthly')
      if (result?.invoice) {
        showSuccessToast('Plan upgraded successfully! Invoice generated and confirmation email sent.')
        // Optionally redirect to invoice preview
        // window.open(`/billing/invoice/view/${result.invoice.id}`, '_blank')
      } else {
        showSuccessToast('Plan upgraded successfully! Confirmation email sent to admin.')
      }
      setOpen(false)
    } catch (error) {
      showErrorToast('Failed to upgrade plan')
    } finally {
      setLoading(false)
    }
  }

  const handleDirectUpgrade = async (packageId) => {
    setLoading(true)
    try {
      const result = await onUpgrade(packageId, isAnnual ? 'yearly' : 'monthly')
      if (result?.invoice) {
        showSuccessToast('Plan upgraded successfully! Invoice generated and confirmation email sent.')
        // Optionally redirect to invoice preview
        // window.open(`/billing/invoice/view/${result.invoice.id}`, '_blank')
      } else {
        showSuccessToast('Plan upgraded successfully! Confirmation email sent to admin.')
      }
      setOpen(false)
    } catch (error) {
      showErrorToast('Failed to upgrade plan')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setLoading(true)
    try {
      await onCancelSubscription()
      showSuccessToast('Subscription cancelled successfully')
      setOpen(false)
    } catch (error) {
      showErrorToast('Failed to cancel subscription')
    } finally {
      setLoading(false)
    }
  }

  const getPrice = (pkg) => {
    if (isAnnual && pkg.hasAnnual) {
      return pkg.annualPrice
    }
    return pkg.monthlyPrice || 0
  }

  const getPeriod = () => {
    return isAnnual ? 'year' : 'month'
  }

  const isCurrentPlan = (pkg) => {
    return currentPlan && pkg.id === currentPlan.packageId
  }

  const getPlanIcon = (planName) => {
    const name = planName?.toLowerCase()
    if (name?.includes('basic')) {
      return '🐷' // Piggy bank icon for basic
    }
    if (name?.includes('standard')) {
      return '💰' // Money bag for standard
    }
    if (name?.includes('enterprise') || name?.includes('premium')) {
      return '🏢' // Building for enterprise
    }
    return '📦' // Default package icon
  }

  const getPopularPlan = () => {
    // Mark the middle plan or standard plan as popular
    const standardPlan = packages.find((pkg) =>
      pkg.name?.toLowerCase().includes('standard')
    )
    if (standardPlan) return standardPlan.id

    // If no standard, mark the middle plan
    if (packages.length >= 3) {
      return packages[1].id
    }
    return null
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box textAlign="center" width="100%">
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              Pricing Plans
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              All plans include 40+ advanced tools and features to boost your
              product. Choose the best plan to fit your needs.
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            <i className="ri-close-line" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 4 }}>
        {/* Billing Toggle */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Typography variant="body1" sx={{ mr: 2 }}>
            Monthly
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isAnnual}
                onChange={(e) => setIsAnnual(e.target.checked)}
                color="primary"
              />
            }
            label=""
            sx={{ mx: 1 }}
          />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Annually
          </Typography>
          {isAnnual && (
            <Chip
              label="Save up to 30%"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ ml: 2 }}
            />
          )}
        </Box>

        {/* Pricing Cards */}
        {packagesLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography>Loading packages...</Typography>
          </Box>
        ) : packages.length === 0 ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography>No packages available</Typography>
          </Box>
        ) : (
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: '1fr',
              md: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
            gap={3}
            sx={{ mb: 4 }}
          >
            {packages.map((pkg) => {
              const isSelected = selectedPackage === pkg.id
              const isCurrent = isCurrentPlan(pkg)
              const isPopular = pkg.id === getPopularPlan()
              const price = getPrice(pkg)
              const period = getPeriod()

              return (
                <Card
                  key={pkg.id}
                  sx={{
                    position: 'relative',
                    border: isSelected ? 2 : 1,
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {isPopular && (
                    <Chip
                      label="Popular"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 1,
                      }}
                    />
                  )}

                  <CardContent
                    sx={{ p: 3, textAlign: 'center', height: '100%' }}
                  >
                    {/* Plan Icon */}
                    <Box sx={{ fontSize: '48px', mb: 2 }}>
                      {getPlanIcon(pkg.name)}
                    </Box>

                    {/* Plan Name */}
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {pkg.name}
                    </Typography>

                    {/* Plan Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, minHeight: 40 }}
                    >
                      {pkg.name?.toLowerCase().includes('basic') &&
                        'A simple start for everyone'}
                      {pkg.name?.toLowerCase().includes('standard') &&
                        'For small to medium businesses'}
                      {(pkg.name?.toLowerCase().includes('enterprise') ||
                        pkg.name?.toLowerCase().includes('premium')) &&
                        'Solution for big organizations'}
                      {!pkg.name
                        ?.toLowerCase()
                        .match(/(basic|standard|enterprise|premium)/) &&
                        'Perfect for your needs'}
                    </Typography>

                    {/* Price */}
                    <Box sx={{ mb: 3 }}>
                      <Box
                        display="flex"
                        alignItems="baseline"
                        justifyContent="center"
                        gap={0.5}
                      >
                        <Typography variant="h6" color="text.secondary">
                          $
                        </Typography>
                        <Typography
                          variant="h2"
                          color="primary.main"
                          sx={{ fontWeight: 700, lineHeight: 1 }}
                        >
                          {price || 0}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          /{period}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Features */}
                    <Stack spacing={1.5} sx={{ mb: 3, textAlign: 'left' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, textAlign: 'center' }}
                      >
                        Features included:
                      </Typography>
                      {pkg.features && pkg.features.length > 0 ? (
                        pkg.features.slice(0, 5).map((feature, index) => (
                          <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <i
                              className="ri-check-line"
                              style={{ color: '#4CAF50', fontSize: '16px' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {feature}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <>
                          <Box display="flex" alignItems="center" gap={1}>
                            <i
                              className="ri-check-line"
                              style={{ color: '#4CAF50', fontSize: '16px' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Max {pkg.maxEmployees} employees
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <i
                              className="ri-check-line"
                              style={{ color: '#4CAF50', fontSize: '16px' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              All core features included
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <i
                              className="ri-check-line"
                              style={{ color: '#4CAF50', fontSize: '16px' }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              24/7 customer support
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Stack>

                    {/* Action Button */}
                    <Button
                      variant={
                        isCurrent
                          ? 'outlined'
                          : isSelected
                            ? 'contained'
                            : 'outlined'
                      }
                      color={isCurrent ? 'success' : 'primary'}
                      fullWidth
                      disabled={isCurrent || loading}
                      sx={{ mt: 'auto' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!isCurrent && !loading) {
                          handleDirectUpgrade(pkg.id)
                        }
                      }}
                    >
                      {isCurrent ? 'Your Current Plan' : loading ? 'Upgrading...' : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        )}

        {/* Trial CTA and Cancel Subscription */}
        <Box textAlign="center" sx={{ mb: 3 }}>
          {packages.length === 0 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Still Not Convinced? Start with a 14-day FREE trial!
              </Typography>
              <Button variant="contained" color="secondary" sx={{ mb: 2 }}>
                Start Your Trial
              </Button>
              <br />
            </>
          )}
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelSubscription}
            disabled={loading}
          >
            Cancel Subscription
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default UpgradePlanDialog
