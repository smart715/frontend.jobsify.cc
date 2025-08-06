
'use client'

import { useState } from 'react'
import {
  Drawer,
  Typography,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider
} from '@mui/material'
// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { toast } from 'react-toastify'

const AddTaskDrawer = ({ open, onClose, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    task: '',
    description: '',
    started: false,
    program: '',
    design: '',
    date: null,
    approved: ''
  })
  const [loading, setLoading] = useState(false)

  const teamMembers = ['Jules', 'Umakant', 'Lynn']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Task added successfully')
        onTaskAdded()
        onClose()
        setFormData({
          task: '',
          description: '',
          started: false,
          program: '',
          design: '',
          date: null,
          approved: ''
        })
      } else {
        toast.error('Failed to add task')
      }
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to add task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={onClose}
      ModalProps={{
        keepMounted: true
      }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between p-6 border-b'>
        <Typography variant='h5'>Add New Task</Typography>
        <IconButton onClick={onClose}>
          <i className='ri-close-line' />
        </IconButton>
      </div>

      <div className='p-6'>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Task'
                value={formData.task}
                onChange={(e) => handleInputChange('task', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Description'
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Started</InputLabel>
                <Select
                  value={formData.started}
                  label='Started'
                  onChange={(e) => handleInputChange('started', e.target.value)}
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Program</InputLabel>
                <Select
                  value={formData.program}
                  label='Program'
                  onChange={(e) => handleInputChange('program', e.target.value)}
                >
                  <MenuItem value=''>None</MenuItem>
                  {teamMembers.map((member) => (
                    <MenuItem key={member} value={member}>
                      {member}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Design</InputLabel>
                <Select
                  value={formData.design}
                  label='Design'
                  onChange={(e) => handleInputChange('design', e.target.value)}
                >
                  <MenuItem value=''>None</MenuItem>
                  {teamMembers.map((member) => (
                    <MenuItem key={member} value={member}>
                      {member}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <AppReactDatepicker
                selected={formData.date}
                onChange={(date) => handleInputChange('date', date)}
                placeholderText='Select Date'
                customInput={<TextField fullWidth label='Date' />}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Approved</InputLabel>
                <Select
                  value={formData.approved}
                  label='Approved'
                  onChange={(e) => handleInputChange('approved', e.target.value)}
                >
                  <MenuItem value=''>None</MenuItem>
                  {teamMembers.map((member) => (
                    <MenuItem key={member} value={member}>
                      {member}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider className='my-6' />

          <div className='flex items-center gap-4'>
            <Button
              variant='contained'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Task'}
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddTaskDrawer
