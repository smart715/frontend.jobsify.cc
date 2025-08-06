
'use client'

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
import Grid from '@mui/material/Grid2'

// Vars
const initialData = {
  projectName: '',
  clientId: '',
  amount: '',
  paidAmount: '',
  status: 'Unpaid',
  dueDate: '',
  startDate: '',
  endDate: '',
  duration: '',
  notes: ''
}

const AddInvoiceDrawer = ({ open, handleClose, updateData, invoiceData }) => {
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    if (invoiceData) {
      setFormData({
        projectName: invoiceData.projectName || '',
        clientId: invoiceData.clientId || '',
        amount: invoiceData.amount || '',
        paidAmount: invoiceData.paidAmount || '',
        status: invoiceData.status || 'Unpaid',
        dueDate: invoiceData.dueDate ? invoiceData.dueDate.split('T')[0] : '',
        startDate: invoiceData.startDate ? invoiceData.startDate.split('T')[0] : '',
        endDate: invoiceData.endDate ? invoiceData.endDate.split('T')[0] : '',
        duration: invoiceData.duration || '',
        notes: invoiceData.notes || ''
      })
    } else {
      setFormData(initialData)
    }
  }, [invoiceData, open])

  const handleSubmit = async e => {
    e.preventDefault()

    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      paidAmount: parseFloat(formData.paidAmount) || 0,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
    }

    try {
      const url = invoiceData ? `/api/invoices/${invoiceData.id}` : '/api/invoices'
      const method = invoiceData ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        const invoice = await response.json()
        updateData(invoice)
        handleClose()
        setFormData(initialData)
      }
    } catch (error) {
      console.error('Error saving invoice:', error)
    }
  }

  const handleReset = () => {
    setFormData(invoiceData || initialData)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>
          {invoiceData ? 'Edit Invoice' : 'Add New Invoice'}
        </Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Project Name'
                fullWidth
                placeholder='Enter project name'
                value={formData.projectName}
                onChange={e => setFormData({ ...formData, projectName: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Client ID'
                fullWidth
                placeholder='Enter client ID'
                value={formData.clientId}
                onChange={e => setFormData({ ...formData, clientId: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Amount'
                fullWidth
                type='number'
                placeholder='0.00'
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Paid Amount'
                fullWidth
                type='number'
                placeholder='0.00'
                value={formData.paidAmount}
                onChange={e => setFormData({ ...formData, paidAmount: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label='Status'
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value='Paid'>Paid</MenuItem>
                  <MenuItem value='Unpaid'>Unpaid</MenuItem>
                  <MenuItem value='Overdue'>Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Due Date'
                fullWidth
                type='date'
                InputLabelProps={{ shrink: true }}
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='Start Date'
                fullWidth
                type='date'
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label='End Date'
                fullWidth
                type='date'
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Duration'
                fullWidth
                placeholder='e.g., 3 months'
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Notes'
                fullWidth
                multiline
                rows={3}
                placeholder='Additional notes...'
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              {invoiceData ? 'Update' : 'Submit'}
            </Button>
            <Button variant='outlined' color='secondary' type='reset' onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddInvoiceDrawer
