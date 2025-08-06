
'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Chip,
  Snackbar,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { showSuccessToast, showErrorToast } from '@/utils/toast'

const PaymentCredentials = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [providers, setProviders] = useState({
    paypal: { enabled: false, status: 'inactive' },
    stripe: { enabled: false, status: 'inactive' },
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      // PayPal Sandbox
      paypal_sandbox_client_id: '',
      paypal_sandbox_secret: '',
      paypal_sandbox_webhook_id: '',
      // PayPal Live
      paypal_live_client_id: '',
      paypal_live_secret: '',
      paypal_live_webhook_id: '',
      paypal_mode: 'sandbox',

      // Stripe Sandbox
      stripe_sandbox_publishable_key: '',
      stripe_sandbox_secret_key: '',
      stripe_sandbox_webhook_secret: '',
      // Stripe Live
      stripe_live_publishable_key: '',
      stripe_live_secret_key: '',
      stripe_live_webhook_secret: '',
      stripe_mode: 'sandbox',
    }
  })

  const paymentProviders = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '/images/apps/ecommerce/paypal.png',
      color: '#0070ba',
      description: 'Accept payments via PayPal'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '/images/logos/stripe.png',
      color: '#635bff',
      description: 'Accept credit card payments'
    },
  ]

  // Load existing configurations
  useEffect(() => {
    const loadConfigurations = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/payment-gateway-configurations')
        if (response.ok) {
          const configs = await response.json()
          
          // Update providers state
          const updatedProviders = { ...providers }
          configs.forEach(config => {
            if (updatedProviders[config.provider]) {
              updatedProviders[config.provider] = {
                enabled: config.isEnabled,
                status: config.isEnabled ? 'active' : 'inactive'
              }
            }
            
            // Set form values based on configuration
            if (config.provider === 'paypal') {
              setValue('paypal_sandbox_client_id', config.configuration.sandbox?.client_id || '')
              setValue('paypal_sandbox_secret', config.configuration.sandbox?.secret || '')
              setValue('paypal_sandbox_webhook_id', config.configuration.sandbox?.webhook_id || '')
              setValue('paypal_live_client_id', config.configuration.live?.client_id || '')
              setValue('paypal_live_secret', config.configuration.live?.secret || '')
              setValue('paypal_live_webhook_id', config.configuration.live?.webhook_id || '')
              setValue('paypal_mode', config.configuration.mode || 'sandbox')
            } else if (config.provider === 'stripe') {
              setValue('stripe_sandbox_publishable_key', config.configuration.sandbox?.publishable_key || '')
              setValue('stripe_sandbox_secret_key', config.configuration.sandbox?.secret_key || '')
              setValue('stripe_sandbox_webhook_secret', config.configuration.sandbox?.webhook_secret || '')
              setValue('stripe_live_publishable_key', config.configuration.live?.publishable_key || '')
              setValue('stripe_live_secret_key', config.configuration.live?.secret_key || '')
              setValue('stripe_live_webhook_secret', config.configuration.live?.webhook_secret || '')
              setValue('stripe_mode', config.configuration.mode || 'sandbox')
            }
          })
          
          setProviders(updatedProviders)
        }
      } catch (error) {
        console.error('Error loading configurations:', error)
        showErrorToast('Failed to load payment configurations')
      } finally {
        setLoading(false)
      }
    }

    loadConfigurations()
  }, [])

  const handleProviderToggle = (providerId) => {
    setProviders(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        enabled: !prev[providerId].enabled,
        status: !prev[providerId].enabled ? 'active' : 'inactive'
      }
    }))
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const saveConfiguration = async (provider, configuration) => {
    setSaving(true)
    try {
      const response = await fetch('/api/payment-gateway-configurations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          isEnabled: providers[provider].enabled,
          configuration,
        }),
      })

      if (response.ok) {
        showSuccessToast(`${provider} configuration saved successfully`)
        return true
      } else {
        showErrorToast(`Failed to save ${provider} configuration`)
        return false
      }
    } catch (error) {
      console.error('Error saving configuration:', error)
      showErrorToast(`Failed to save ${provider} configuration`)
      return false
    } finally {
      setSaving(false)
    }
  }

  const onSubmit = async (data) => {
    if (activeTab === 1) {
      // PayPal configuration
      const paypalConfig = {
        mode: data.paypal_mode,
        sandbox: {
          client_id: data.paypal_sandbox_client_id,
          secret: data.paypal_sandbox_secret,
          webhook_id: data.paypal_sandbox_webhook_id,
        },
        live: {
          client_id: data.paypal_live_client_id,
          secret: data.paypal_live_secret,
          webhook_id: data.paypal_live_webhook_id,
        }
      }
      await saveConfiguration('paypal', paypalConfig)
    } else if (activeTab === 2) {
      // Stripe configuration
      const stripeConfig = {
        mode: data.stripe_mode,
        sandbox: {
          publishable_key: data.stripe_sandbox_publishable_key,
          secret_key: data.stripe_sandbox_secret_key,
          webhook_secret: data.stripe_sandbox_webhook_secret,
        },
        live: {
          publishable_key: data.stripe_live_publishable_key,
          secret_key: data.stripe_live_secret_key,
          webhook_secret: data.stripe_live_webhook_secret,
        }
      }
      await saveConfiguration('stripe', stripeConfig)
    }
  }

  const renderProviderOverview = () => (
    <Grid container spacing={3}>
      {paymentProviders.map((provider) => (
        <Grid item xs={12} sm={6} md={4} key={provider.id}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: '100%',
              border: providers[provider.id].enabled ? `2px solid ${provider.color}` : '2px solid transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ mr: 2, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={provider.icon}
                  alt={provider.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {provider.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {provider.description}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Chip
                label={providers[provider.id].status}
                color={providers[provider.id].enabled ? 'success' : 'default'}
                size="small"
              />
              <Switch
                checked={providers[provider.id].enabled}
                onChange={() => handleProviderToggle(provider.id)}
                color="primary"
              />
            </Box>

            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => setActiveTab(paymentProviders.findIndex(p => p.id === provider.id) + 1)}
              disabled={!providers[provider.id].enabled}
            >
              Configure
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )

  const renderPayPalSettings = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ mr: 2, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/images/apps/ecommerce/paypal.png"
              alt="PayPal"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              PayPal Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure your PayPal payment settings
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={providers.paypal.enabled}
                  onChange={() => handleProviderToggle('paypal')}
                />
              }
              label="Enable PayPal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="paypal_mode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Environment Mode"
                  disabled={!providers.paypal.enabled}
                  SelectProps={{ native: true }}
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="live">Live</option>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Sandbox Keys
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="paypal_sandbox_client_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Sandbox Client ID"
                  placeholder="Enter PayPal Sandbox Client ID"
                  disabled={!providers.paypal.enabled}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="paypal_sandbox_secret"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Sandbox Secret"
                  type="password"
                  placeholder="Enter PayPal Sandbox Secret"
                  disabled={!providers.paypal.enabled}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="paypal_sandbox_webhook_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Sandbox Webhook ID"
                  placeholder="Enter Sandbox Webhook ID"
                  disabled={!providers.paypal.enabled}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Live Keys
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="paypal_live_client_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Live Client ID"
                  placeholder="Enter PayPal Live Client ID"
                  disabled={!providers.paypal.enabled}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="paypal_live_secret"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Live Secret"
                  type="password"
                  placeholder="Enter PayPal Live Secret"
                  disabled={!providers.paypal.enabled}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="paypal_live_webhook_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Live Webhook ID"
                  placeholder="Enter Live Webhook ID"
                  disabled={!providers.paypal.enabled}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

  const renderStripeSettings = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ mr: 2, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/images/logos/stripe.png"
              alt="Stripe"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Stripe Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure your Stripe payment settings
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={providers.stripe.enabled}
                  onChange={() => handleProviderToggle('stripe')}
                />
              }
              label="Enable Stripe"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="stripe_mode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Environment Mode"
                  disabled={!providers.stripe.enabled}
                  SelectProps={{ native: true }}
                >
                  <option value="sandbox">Sandbox (Test)</option>
                  <option value="live">Live (Production)</option>
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Sandbox Keys
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="stripe_sandbox_publishable_key"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Sandbox Publishable Key"
                  placeholder="pk_test_..."
                  disabled={!providers.stripe.enabled}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="stripe_sandbox_secret_key"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Sandbox Secret Key"
                  type="password"
                  placeholder="sk_test_..."
                  disabled={!providers.stripe.enabled}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="stripe_sandbox_webhook_secret"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Sandbox Webhook Secret"
                  type="password"
                  placeholder="whsec_..."
                  disabled={!providers.stripe.enabled}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Live Keys
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="stripe_live_publishable_key"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Live Publishable Key"
                  placeholder="pk_live_..."
                  disabled={!providers.stripe.enabled}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="stripe_live_secret_key"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Live Secret Key"
                  type="password"
                  placeholder="sk_live_..."
                  disabled={!providers.stripe.enabled}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="stripe_live_webhook_secret"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Live Webhook Secret"
                  type="password"
                  placeholder="whsec_..."
                  disabled={!providers.stripe.enabled}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

  const tabContent = [
    { label: 'Overview', content: renderProviderOverview() },
    { label: 'PayPal', content: renderPayPalSettings() },
    { label: 'Stripe', content: renderStripeSettings() },
  ]

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading payment configurations...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Payment Credentials
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Configure your payment gateways to start accepting payments. Make sure to test in sandbox mode before going live.
      </Alert>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabContent.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tabContent[activeTab].content}
        </Box>

        {activeTab > 0 && (
          <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              sx={{ mr: 2 }}
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setActiveTab(0)}
              disabled={saving}
            >
              Back to Overview
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  )
}

export default PaymentCredentials
