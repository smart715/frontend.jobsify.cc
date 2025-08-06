"use client"

import { useState, useRef } from 'react'

import Link from 'next/link';

import Image from 'next/image';


import { IoMdInformationCircleOutline } from "react-icons/io";

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

import { Divider } from '@mui/material'

import TextEditor from '@/components/GeneralSettings/TextEditor'
import Details from './Details';

const GeneralTab = () => {

  
  const [formData, setFormData] = useState({
    defaultStatus: '',
    blockTimeslotStatus: [],
    pendingPageStatus: [],
    hiddenCalendarStatus: [],
    additionalStatus: '',
    timeSystem: [],
    DataFormat: [],
    selectableIntervals: '',
    showAppointmentEndTime: '',
    disableVerboseDateOutpu: ''
  })
  
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  // Handle File Upload
  const handleFileUpload = event => {
    const { files } = event.target

    if (files && files.length !== 0) {
      setFileName(files[0].name)
    }
  }

  return (
    <Grid container spacing={6} sx={{mt: 3}}>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Uncategorized</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{padding: '10px'}}>
                <Grid size={{ xs: 12 }}>
                  <Details/>
                
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Combined</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{padding: '10px'}}>
                
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Exterior</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{padding: '10px'}}>
                
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Interior</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{padding: '10px'}}>
                
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
    </Grid>
  )
}

export default GeneralTab
