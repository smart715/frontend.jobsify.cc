// React Imports
import { useState } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import Divider from '@mui/material/Divider'

const AddPaymentDrawer = ({ open, handleClose }) => {
  // States
  const [formData, setFormData] = useState({
    invoiceBalance: '5000.00',
    paymentAmount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    internalPaymentNotes: ''
  })

  const handleSubmit = e => {
    e.preventDefault()
    console.log(formData)
    handleClose()
  }

  const handleReset = () => {
    setFormData({
      invoiceBalance: '5000.00',
      paymentAmount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      internalPaymentNotes: ''
    })
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
        <Typography variant='h5'>Add Payment</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <TextField
            fullWidth
            label='Invoice Balance'
            value={formData.invoiceBalance}
            InputProps={{
              startAdornment: <InputAdornment position='start'>$</InputAdornment>,
              readOnly: true
            }}
          />
          <TextField
            fullWidth
            label='Payment Amount'
            value={formData.paymentAmount}
            onChange={e => setFormData({ ...formData, paymentAmount: e.target.value })}
            InputProps={{
              startAdornment: <InputAdornment position='start'>$</InputAdornment>
            }}
          />
          <TextField
            fullWidth
            type='date'
            label='Payment Date'
            value={formData.paymentDate}
            onChange={e => setFormData({ ...formData, paymentDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={formData.paymentMethod}
              label='Payment Method'
              onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              <MenuItem value='Cash'>Cash</MenuItem>
              <MenuItem value='Bank Transfer'>Bank Transfer</MenuItem>
              <MenuItem value='Credit Card'>Credit Card</MenuItem>
              <MenuItem value='Debit Card'>Debit Card</MenuItem>
              <MenuItem value='PayPal'>PayPal</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            rows={4}
            multiline
            label='Internal Payment Notes'
            value={formData.internalPaymentNotes}
            onChange={e => setFormData({ ...formData, internalPaymentNotes: e.target.value })}
          />
          <div className='flex items-center gap-4'>
            <Button fullWidth variant='contained' type='submit'>
              Send
            </Button>
            <Button fullWidth variant='outlined' color='secondary' type='reset' onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddPaymentDrawer