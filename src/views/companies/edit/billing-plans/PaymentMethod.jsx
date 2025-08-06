'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'

// Utils
import { showSuccessToast, showErrorToast, showLoadingToast, updateToast } from '@/utils/toast'

const PaymentMethod = () => {
  const params = useParams()
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState(null)
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: '',
    isDefault: false
  })

  useEffect(() => {
    fetchPaymentMethods()
  }, [params.id])

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`/api/payment-methods?companyId=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data)
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const loadingToastId = showLoadingToast(editingMethod ? 'Updating payment method...' : 'Adding payment method...')

    try {
      const url = editingMethod 
        ? `/api/payment-methods/${editingMethod.id}`
        : '/api/payment-methods'

      const method = editingMethod ? 'PUT' : 'POST'

      const payload = editingMethod 
        ? {
            cardholderName: formData.cardholderName,
            expiryMonth: formData.expiryMonth,
            expiryYear: formData.expiryYear,
            isDefault: formData.isDefault
          }
        : {
            companyId: params.id,
            cardNumber: formData.cardNumber,
            cardholderName: formData.cardholderName,
            expiryMonth: formData.expiryMonth,
            expiryYear: formData.expiryYear,
            cardType: getCardType(formData.cardNumber),
            isDefault: formData.isDefault
          }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchPaymentMethods()
        setDialogOpen(false)
        resetForm()
        updateToast(loadingToastId, `Payment method ${editingMethod ? 'updated' : 'added'} successfully!`, 'success')
      } else {
        const error = await response.json()
        updateToast(loadingToastId, `Error: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Error saving payment method:', error)
      updateToast(loadingToastId, 'An error occurred while saving payment method', 'error')
    }
  }

  const handleDelete = async (id) => {
    const loadingToastId = showLoadingToast('Deleting payment method...')

    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPaymentMethods()
        updateToast(loadingToastId, 'Payment method deleted successfully!', 'success')
      } else {
        const error = await response.json()
        updateToast(loadingToastId, `Error: ${error.error}`, 'error')
      }
    } catch (error) {
      console.error('Error deleting payment method:', error)
      updateToast(loadingToastId, 'An error occurred while deleting payment method', 'error')
    }
  }

  const getCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '')
    if (cleaned.startsWith('4')) return 'Visa'
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard'
    if (cleaned.startsWith('3')) return 'American Express'
    return 'Unknown'
  }

  const getCardIcon = (cardType) => {
    switch (cardType) {
      case 'Visa':
        return '/images/logos/visa.png'
      case 'Mastercard':
        return '/images/logos/mastercard.png'
      case 'American Express':
        return '/images/logos/american-express.png'
      default:
        return '/images/logos/visa.png'
    }
  }

  const resetForm = () => {
    setFormData({
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardType: '',
      isDefault: false
    })
    setEditingMethod(null)
  }

  const openEditDialog = (method) => {
    setEditingMethod(method)
    setFormData({
      cardNumber: '', // Don't populate for security
      cardholderName: method.cardholderName,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      cvv: '',
      cardType: method.cardType,
      isDefault: method.isDefault
    })
    setDialogOpen(true)
  }

  const openAddDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading payment methods...</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader
          title="Payment Methods"
          action={
            <Button variant="contained" onClick={openAddDialog}>
              Add Payment Method
            </Button>
          }
        />
        <CardContent className="flex flex-col gap-4">
          {paymentMethods.length === 0 ? (
            <Typography color="text.secondary">
              No payment methods added yet.
            </Typography>
          ) : (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex justify-between border rounded sm:items-center p-5 flex-col !items-start max-sm:gap-2 sm:flex-row"
              >
                <div className="flex flex-col items-start gap-2">
                  <img src={getCardIcon(method.cardType)} alt={method.cardType} height={25} />
                  <div className="flex items-center gap-2">
                    <Typography color="text.primary" className="font-medium">
                      {method.cardholderName}
                    </Typography>
                    {method.isDefault && (
                      <Chip variant="tonal" color="primary" label="Primary" size="small" />
                    )}
                  </div>
                  <Typography>
                    {method.cardNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Card expires at {method.expiryMonth}/{method.expiryYear}
                  </Typography>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openEditDialog(method)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(method.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Payment Method Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {!editingMethod && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Card Number"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    // Remove all non-digits and apply card number formatting
                    let value = e.target.value.replace(/\D/g, '')
                    value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
                    if (value.length <= 19) { // 16 digits + 3 spaces
                      setFormData({ ...formData, cardNumber: value })
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  inputProps={{ maxLength: 19 }}
                  required
                />
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Cardholder Name"
                value={formData.cardholderName}
                onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                required
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Expiry Month</InputLabel>
                <Select
                  value={formData.expiryMonth}
                  label="Expiry Month"
                  onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                >
                  <MenuItem value="01">01 - January</MenuItem>
                  <MenuItem value="02">02 - February</MenuItem>
                  <MenuItem value="03">03 - March</MenuItem>
                  <MenuItem value="04">04 - April</MenuItem>
                  <MenuItem value="05">05 - May</MenuItem>
                  <MenuItem value="06">06 - June</MenuItem>
                  <MenuItem value="07">07 - July</MenuItem>
                  <MenuItem value="08">08 - August</MenuItem>
                  <MenuItem value="09">09 - September</MenuItem>
                  <MenuItem value="10">10 - October</MenuItem>
                  <MenuItem value="11">11 - November</MenuItem>
                  <MenuItem value="12">12 - December</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Expiry Year</InputLabel>
                <Select
                  value={formData.expiryYear}
                  label="Expiry Year"
                  onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                >
                  {Array.from({ length: 20 }, (_, i) => {
                    const year = new Date().getFullYear() + i
                    return (
                      <MenuItem key={year} value={year.toString()}>
                        {year}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>

            {!editingMethod && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="CVV"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  placeholder="123"
                  type="password"
                  required
                />
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  />
                }
                label="Set as primary payment method"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained">
            {editingMethod ? 'Update' : 'Add'} Payment Method
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PaymentMethod