
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'

// Util Imports
import { getInitials } from '@/utils/getInitials'

const ViewSuperAdminDrawer = ({ open, handleClose, userData }) => {
  if (!userData) return null

  const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim()

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
        <Typography variant='h5'>View Super Admin</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <Card>
          <CardContent className='flex flex-col items-center gap-4'>
            <Avatar
              src={userData.image}
              sx={{ width: 100, height: 100 }}
            >
              {getInitials(fullName)}
            </Avatar>
            <div className='text-center'>
              <Typography variant='h6' className='font-medium'>
                {fullName}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {userData.email}
              </Typography>
            </div>
            <Chip
              label='Super Admin'
              color='primary'
              variant='tonal'
            />
          </CardContent>
        </Card>

        <div className='mt-6 space-y-4'>
          <Typography variant='h6' className='font-medium'>
            Details
          </Typography>
          
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <Typography variant='body2' color='text.secondary'>
                First Name:
              </Typography>
              <Typography variant='body2' className='font-medium'>
                {userData.firstName || 'N/A'}
              </Typography>
            </div>
            
            <div className='flex justify-between items-center'>
              <Typography variant='body2' color='text.secondary'>
                Last Name:
              </Typography>
              <Typography variant='body2' className='font-medium'>
                {userData.lastName || 'N/A'}
              </Typography>
            </div>
            
            <div className='flex justify-between items-center'>
              <Typography variant='body2' color='text.secondary'>
                Email:
              </Typography>
              <Typography variant='body2' className='font-medium'>
                {userData.email || 'N/A'}
              </Typography>
            </div>
            
            <div className='flex justify-between items-center'>
              <Typography variant='body2' color='text.secondary'>
                Role:
              </Typography>
              <Typography variant='body2' className='font-medium'>
                Super Admin
              </Typography>
            </div>
            
            <div className='flex justify-between items-center'>
              <Typography variant='body2' color='text.secondary'>
                Status:
              </Typography>
              <Chip
                label='Active'
                color='success'
                size='small'
                variant='tonal'
              />
            </div>
            
            <div className='flex justify-between items-center'>
              <Typography variant='body2' color='text.secondary'>
                Created At:
              </Typography>
              <Typography variant='body2' className='font-medium'>
                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
              </Typography>
            </div>
            
            <div className='flex justify-between items-center'>
              <Typography variant='body2' color='text.secondary'>
                Last Updated:
              </Typography>
              <Typography variant='body2' className='font-medium'>
                {userData.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : 'N/A'}
              </Typography>
            </div>
          </div>
        </div>

        <div className='mt-6'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleClose}
            fullWidth
          >
            Close
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default ViewSuperAdminDrawer
