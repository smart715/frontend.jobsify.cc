// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

// Utils Imports
import { showLoadingToast, updateToast } from '@/utils/toast'

// Vars
const initialData = {
  from: '',
  to: '',
  subject: '',
  message: ''
}

const SendInvoiceDrawer = ({ open, setOpen, invoiceData }) => {
  // States
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setOpen(false)
    setFormData(initialData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.to.trim()) {
      updateToast('loading', 'Please enter recipient email', 'error')
      return
    }

    if (!formData.from.trim()) {
      updateToast('loading', 'Please enter sender email', 'error')
      return
    }

    setLoading(true)
    const loadingToastId = showLoadingToast('Sending invoice...')

    try {
      const response = await fetch('/api/invoices/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          invoiceId: invoiceData?.id,
          from: formData.from,
          to: formData.to,
          subject: formData.subject,
          message: formData.message
        })
      })

      if (response.ok) {
        updateToast(loadingToastId, 'Invoice sent successfully!', 'success')
        handleClose()
      } else {
        const errorData = await response.json()
        updateToast(loadingToastId, errorData.error || 'Failed to send invoice', 'error')
      }
    } catch (error) {
      console.error('Error sending invoice:', error)
      updateToast(loadingToastId, 'Failed to send invoice', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Set default values when drawer opens
  useEffect(() => {
    if (open && invoiceData) {
      setFormData({
        from: '',
        to: invoiceData?.company?.companyEmail || '',
        subject: `Invoice ${invoiceData?.invoiceId || ''}`,
        message: `Dear ${invoiceData?.company?.companyName || 'Customer'},

Thank you for your business, always a pleasure to work with you!

We have generated a new invoice ${invoiceData?.invoiceId || ''} in the amount of $${invoiceData?.amount || '0.00'}

We would appreciate payment of this invoice by ${invoiceData?.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString() : 'the due date'}.

Best regards,
Materialize Team`
      })
    }
  }, [open, invoiceData])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Send Invoice</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <TextField
            fullWidth
            required
            label='From'
            type='email'
            value={formData.from}
            placeholder='your-email@example.com'
            onChange={e => setFormData({ ...formData, from: e.target.value })}
          />
          <TextField
            fullWidth
            required
            label='To'
            type='email'
            value={formData.to}
            placeholder='customer@example.com'
            onChange={e => setFormData({ ...formData, to: e.target.value })}
          />
          <TextField
            fullWidth
            required
            label='Subject'
            value={formData.subject}
            placeholder='Invoice regarding services'
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />
          <TextField
            rows={10}
            fullWidth
            multiline
            label='Message'
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            placeholder='Enter your message here...'
          />
          <div className='flex items-center gap-4'>
            <Button 
              variant='contained' 
              type='submit'
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <i className='ri-send-plane-line' />}
            >
              {loading ? 'Sending...' : 'Send Invoice'}
            </Button>
            <Button 
              variant='outlined' 
              color='secondary' 
              type='button' 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default SendInvoiceDrawer