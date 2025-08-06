
'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Chip,
  IconButton
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

const StripeSettings = () => {
  const [loading, setLoading] = useState(false)
  const [testMode, setTestMode] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      stripePublicKey: '',
      stripeSecretKey: '',
      stripeWebhookSecret: '',
      testMode: true,
      autoCapture: true,
      currency: 'USD',
      collectBillingAddress: true,
      collectShippingAddress: false,
      savePaymentMethods: true,
      allowPromotionCodes: true
    }
  })

  const watchTestMode = watch('testMode')

  useEffect(() => {
    fetchStripeSettings()
  }, [])

  const fetchStripeSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stripe-settings')
      if (response.ok) {
        const data = await response.json()
        reset(data)
        setTestMode(data.testMode)
        setConnectionStatus(data.connected ? 'connected' : 'disconnected')
      }
    } catch (error) {
      console.error('Error fetching Stripe settings:', error)
      toast.error('Failed to load Stripe settings')
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stripe-settings/test', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setConnectionStatus('connected')
        toast.success('Stripe connection successful!')
      } else {
        setConnectionStatus('failed')
        toast.error('Stripe connection failed')
      }
    } catch (error) {
      console.error('Error testing Stripe connection:', error)
      setConnectionStatus('failed')
      toast.error('Connection test failed')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stripe-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success('Stripe settings updated successfully')
        fetchStripeSettings()
      } else {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating Stripe settings:', error)
      toast.error('Failed to update Stripe settings')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success'
      case 'failed': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected'
      case 'failed': return 'Connection Failed'
      default: return 'Not Connected'
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={6}>
        {/* Connection Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">Stripe Connection Status</Typography>
                <Chip 
                  label={getStatusText()} 
                  color={getStatusColor()}
                  variant="outlined"
                />
              </Box>
              <Button
                variant="outlined"
                onClick={testConnection}
                disabled={loading}
              >
                Test Connection
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* API Configuration */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 4 }}>
                API Configuration
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Controller
                    name="testMode"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Test Mode (Use Stripe Test Keys)"
                      />
                    )}
                  />
                </Grid>

                {watchTestMode && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      Test mode is enabled. Use your Stripe test keys. No real payments will be processed.
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Controller
                    name="stripePublicKey"
                    control={control}
                    rules={{ required: 'Stripe public key is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={`Stripe ${watchTestMode ? 'Test' : 'Live'} Public Key`}
                        placeholder={`pk_${watchTestMode ? 'test' : 'live'}_...`}
                        error={!!errors.stripePublicKey}
                        helperText={errors.stripePublicKey?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="stripeSecretKey"
                    control={control}
                    rules={{ required: 'Stripe secret key is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="password"
                        label={`Stripe ${watchTestMode ? 'Test' : 'Live'} Secret Key`}
                        placeholder={`sk_${watchTestMode ? 'test' : 'live'}_...`}
                        error={!!errors.stripeSecretKey}
                        helperText={errors.stripeSecretKey?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="stripeWebhookSecret"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="password"
                        label="Webhook Endpoint Secret"
                        placeholder="whsec_..."
                        helperText="Required for processing webhook events securely"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Configuration */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Payment Configuration
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Default Currency"
                        placeholder="USD"
                        helperText="3-letter ISO currency code"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="autoCapture"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Auto-capture payments"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="savePaymentMethods"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Allow customers to save payment methods"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="allowPromotionCodes"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Allow promotion codes during checkout"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Billing Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Billing Information Collection
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Controller
                    name="collectBillingAddress"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Collect billing address"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="collectShippingAddress"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Collect shipping address"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Webhook Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Webhook Configuration
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Add this webhook endpoint URL to your Stripe dashboard to receive payment events:
              </Alert>
              
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {typeof window !== 'undefined' ? `${window.location.origin}/api/stripe/webhook` : 'https://your-domain.com/api/stripe/webhook'}
                </Typography>
              </Paper>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Required events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted, invoice.payment_succeeded, invoice.payment_failed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
            >
              {loading ? 'Saving...' : 'Save Stripe Settings'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

export default StripeSettings
