'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'

const AddDesignationDrawer = ({ open, handleClose, onSuccess }) => {
  // States
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Please enter designation name')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/designations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        handleReset()
        handleClose()
        onSuccess()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create designation')
      }
    } catch (error) {
      console.error('Error creating designation:', error)
      alert('Failed to create designation')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      description: ''
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
        <Typography variant='h5'>Add New Designation</Typography>
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
                fullWidth
                label='Designation Name'
                placeholder='Enter designation name'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label='Description'
                placeholder='Enter description'
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <div className='flex items-center gap-4'>
                <Button
                  variant='contained'
                  type='submit'
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add'}
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  type='reset'
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
    </Drawer>
  )
}

export default AddDesignationDrawer