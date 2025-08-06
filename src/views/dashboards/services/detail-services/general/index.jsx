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
            <Typography variant='h5'>Appointment Settings</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{padding: '10px'}}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Time Restrictions</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Default status</InputLabel>
                        <Select
                          label='Default status'
                          value={formData.defaultStatus}
                          onChange={e => setFormData({ ...formData, defaultStatus: e.target.value })}
                        >
                          <MenuItem value='Approved'>Approved</MenuItem>
                          <MenuItem value='Pending Approved'>Pending Approved</MenuItem>
                          <MenuItem value='Completed'>Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Statuses that block timeslot</InputLabel>
                        <Select
                          label='Statuses that block timeslot'
                          multiple
                          value={formData.blockTimeslotStatus}
                          onChange={e => setFormData({ ...formData, blockTimeslotStatus: e.target.value })}
                        >
                          <MenuItem value='Approved'>Approved</MenuItem>
                          <MenuItem value='Pending Approved'>Pending Approved</MenuItem>
                          <MenuItem value='Completed'>Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Statuses that appear on pending page</InputLabel>
                        <Select
                          label='Statuses that appear on pending page'
                          multiple
                          value={formData.pendingPageStatus}
                          onChange={e => setFormData({ ...formData, pendingPageStatus: e.target.value })}
                        >
                          <MenuItem value='Approved'>Approved</MenuItem>
                          <MenuItem value='Pending Approved'>Pending Approved</MenuItem>
                          <MenuItem value='Completed'>Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Statuses hidden on calendar</InputLabel>
                        <Select
                          label='Statuses hidden on calendar'
                          multiple
                          value={formData.hiddenCalendarStatus}
                          onChange={e => setFormData({ ...formData, hiddenCalendarStatus: e.target.value })}
                        >
                          <MenuItem value='Approved'>Approved</MenuItem>
                          <MenuItem value='Pending Approved'>Pending Approved</MenuItem>
                          <MenuItem value='Completed'>Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Additional Statuses (comma separated)'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider/>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Date and time</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Time system</InputLabel>
                        <Select
                          label='Time system'
                          multiple
                          value={formData.timeSystem}
                          onChange={e => setFormData({ ...formData, timeSystem: e.target.value })}
                        >
                          <MenuItem value='Approved'>Approved</MenuItem>
                          <MenuItem value='Pending Approved'>Pending Approved</MenuItem>
                          <MenuItem value='Completed'>Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Date format</InputLabel>
                        <Select
                          label='Date format'
                          multiple
                          value={formData.DataFormat}
                          onChange={e => setFormData({ ...formData, DataFormat: e.target.value })}
                        >
                          <MenuItem value='English'>English</MenuItem>
                          <MenuItem value='French'>French</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Selectable intervals'
                          value={formData.selectableIntervals}
                          onChange={e => setFormData({ ...formData, selectableIntervals: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <div className='flex flex-start'>
                        <Switch checked={formData.showAppointmentEndTime} onChange={e => setFormData({ ...formData, showAppointmentEndTime: e.target.checked })} />
                        <div>
                          <Typography>Show appointment end time</Typography>
                          <Typography variant='caption'>Show booking end time during booking process and on summary</Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <div className='flex flex-start'>
                        <Switch checked={formData.disableVerboseDateOutput} onChange={e => setFormData({ ...formData, disableVerboseDateOutput: e.target.checked })} />
                        <div>
                          <Typography>Disable verbose date output</Typography>
                          <Typography variant='caption'>SUse number instead of name of the month when outputting dates</Typography>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Restrictions</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{padding: '10px'}}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Statuses</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12 }}>
                      <div className='p-6 bg-actionHover rounded'>
                        <Typography color='text.primary'>You can set restrictions on earliest/latest dates in the future when your customer can place an appointment. You can either use a relative values like for example `&quot;+1 month`&quot;, `&quot;+2 weeks`&quot;, `&quot;+5 days`&quot;, `&quot;+3 hours`&quot;, `&quot;+30 minutes`&quot; (entered without quotes), or you can use a fixed date in format YYYY-MM-DD. Leave blank to remove any limitations.</Typography>
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Earliest Possible Booking'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Latest Possible Booking'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider/>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Quantity Restrictions</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Maximum Number of Future Bookings per Customer'
                          value={formData.selectableIntervals}
                          onChange={e => setFormData({ ...formData, selectableIntervals: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider/>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Cart Settings</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12 }}>
                      <div className='flex flex-start'>
                        <Switch checked={formData.showAppointmentEndTime} onChange={e => setFormData({ ...formData, showAppointmentEndTime: e.target.checked })} />
                        <div>
                          <Typography>Disable Shopping Cart Functionality</Typography>
                          <Typography variant='caption'>This will disable ability to book multiple services in one order</Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <div className='flex flex-start'>
                        <Switch checked={formData.disableVerboseDateOutput} onChange={e => setFormData({ ...formData, disableVerboseDateOutput: e.target.checked })} />
                        <div>
                          <Typography>Reset Presets When Adding New Item</Typography>
                          <Typography variant='caption'>This will reset presets settings when adding new item</Typography>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Invoice Settings</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{padding: '10px'}}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Invoice Data</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12 }}>
                      
                    </Grid>
                    <Grid size={{ xs: 12, md: 4}}>
                      <FormControl fullWidth>
                        <TextField
                          label='Company Name'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='VAT Number/Tax ID'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4}}>
                      <FormControl fullWidth>
                        <TextField
                          label='Number Prefix'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12}}>
                      <FormControl fullWidth>
                        <TextField
                          multiline
                          rows={5}
                          label='Bill From'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12}}>
                      <FormControl fullWidth>
                        <TextField
                          multiline
                          rows={5}
                          label='Bill To'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider/>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Email Invoice</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12 }}>
                      <div className='p-6 bg-actionHover rounded'>
                        <Typography color='text.primary'>This subject and content will be used when invoice is being emailed.  <Link href='/' className='btn linkj'> <IoMdInformationCircleOutline /> Show Available Variables </Link></Typography>
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Subject'
                          value={formData.selectableIntervals}
                          onChange={e => setFormData({ ...formData, selectableIntervals: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextEditor />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <div className='relative'>
          <div className="absolute -top-4 left-4 bg-[var(--background-color)] px-2 text-sm font-medium text-gray-800">
            <Typography variant='h5'>Other Settings</Typography>
          </div>
          <Card>
            <CardContent>
              <Grid container spacing={6} sx={{padding: '10px'}}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Business Information</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 5 }}>
                      
                    </Grid>
                    <Grid size={{ xs: 12, md: 7 }}>
                      {/* <TextField
                        fullWidth
                        label='Choose File'
                        variant='outlined'
                        value={fileName}
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: fileName ? (
                              <InputAdornment position='end'>
                                <IconButton size='small' edge='end' onClick={() => setFileName('')}>
                                  <i className='ri-close-line' />
                                </IconButton>
                              </InputAdornment>
                            ) : null
                          }
                        }}
                      />
                      <Button component='label' variant='outlined' htmlFor='contained-button-file'>
                        Choose
                        <input hidden id='contained-button-file' type='file' onChange={handleFileUpload} ref={fileInputRef} />
                      </Button> */}
                    </Grid>
                    <Grid size={{ xs: 12, md: 4}}>
                      <FormControl fullWidth>
                        <TextField
                          label='Company Name'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Business Phone'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4}}>
                      <FormControl fullWidth>
                        <TextField
                          label='Business Address'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider/>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Calendar Settings</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12}}>
                      <FormControl fullWidth>
                        <TextField
                          rows={5}
                          label='Minimum height of a daily calendar (in pixels)'
                          placeholder='700'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <div className='p-6 bg-actionHover rounded'>
                        <Typography color='text.primary'>You can use variables in your booking template, they will be replaced with a value for the booking.<Link href='/' className='btn linkj'> <IoMdInformationCircleOutline /> Show Available Variables </Link></Typography>
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Booking tile information to display on calendar'
                          placeholder='{{service_name}}'
                          value={formData.selectableIntervals}
                          onChange={e => setFormData({ ...formData, selectableIntervals: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider/>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Conversion Tracking</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12}}>
                      <FormControl fullWidth>
                        <TextField
                          label='Minimum height of a daily calendar (in pixels)'
                          placeholder='700'
                          value={formData.additionalStatus}
                          onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <div className='p-6 bg-actionHover rounded'>
                        <Typography color='text.primary'>You can include some javascript or html that will be appended to the confirmation step. For example you can track ad conversions by triggering a tracking code or a facebook pixel. You can use these variables within your code. Click on the variable to copy.</Typography>
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Grid container spacing={6}>
                        <Grid size={{ xs: 12, md: 5 }}>
                          <Card>
                            <CardContent>
                              <Grid container spacing={1}>
                                <Grid size={{ xs: 12 }} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                  <Typography>Order ID#:</Typography>
                                  <Typography>{`{{location_ids}}`}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <Divider/>
                                </Grid>
                                <Grid size={{ xs: 12 }} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                  <Typography>Customer ID#:</Typography>
                                  <Typography>{`{{customer_id}}`}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <Divider/>
                                </Grid>
                                <Grid size={{ xs: 12 }} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                  <Typography>Order Total:</Typography>
                                  <Typography>{`{{order_total}}`}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <Divider/>
                                </Grid>
                                <Grid size={{ xs: 12 }} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                  <Typography>Service IDs#:</Typography>
                                  <Typography>{`{{service_ids}}`}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <Divider/>
                                </Grid>
                                <Grid size={{ xs: 12 }} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                  <Typography>Agent IDs#:</Typography>
                                  <Typography>{`{{agent_ids}}`}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <Divider/>
                                </Grid>
                                <Grid size={{ xs: 12 }} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                  <Typography>Bundle IDs#:</Typography>
                                  <Typography>{`{{bundle_ids}}`}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <Divider/>
                                </Grid>
                                <Grid size={{ xs: 12 }} sx={{display: 'flex', justifyContent: 'space-between'}}>
                                  <Typography>Location IDs#:</Typography>
                                  <Typography>{`{{blocation_ids}}`}</Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 7 }}>
                          <FormControl fullWidth>
                            <TextField
                              multiline
                              rows={9}
                              label='Enter Tracking code here'
                              placeholder='700'
                              value={formData.additionalStatus}
                              onChange={e => setFormData({ ...formData, additionalStatus: e.target.value })}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Booking tile information to display on calendar'
                          placeholder='{{service_name}}'
                          value={formData.selectableIntervals}
                          onChange={e => setFormData({ ...formData, selectableIntervals: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider/>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Data Tables</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <div className='flex flex-start'>
                        <Switch checked={formData.disableVerboseDateOutput} onChange={e => setFormData({ ...formData, disableVerboseDateOutput: e.target.checked })} />
                        <div>
                          <Typography>Allow non admins to download table data as csv</Typography>
                          <Typography variant='caption'>Only admins will be able to download table data as csv</Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Number of records per page</InputLabel>
                        <Select
                          label='Number of records per page'
                          value={formData.defaultStatus}
                          onChange={e => setFormData({ ...formData, defaultStatus: e.target.value })}
                        >
                          <MenuItem value='20'>20</MenuItem>
                          <MenuItem value='50'>50</MenuItem>
                          <MenuItem value='100'>100</MenuItem>
                          <MenuItem value='200'>200</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider/>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Export/Import</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<i className="ri-export-line" />}
                    >
                      Export Data
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<i className="ri-download-line" />}
                    >
                      Import Data
                    </Button>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider/>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant='body2'>Google Places API</Typography>
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12 }}>
                      <div className='p-6 bg-actionHover rounded'>
                        <Typography color='text.primary'>In order for address autocomplete to work, you need an API key. To learn how to create an API key for Google Places API<Link href='/' className='btn linkj'>click here</Link></Typography>
                      </div>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <TextField
                          label='Google Places API key'
                          value={formData.selectableIntervals}
                          onChange={e => setFormData({ ...formData, selectableIntervals: e.target.value })}
                        />
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Country Restriction</InputLabel>
                        <Select
                          label='Country Restriction'
                          value={formData.defaultStatus}
                          onChange={e => setFormData({ ...formData, defaultStatus: e.target.value })}
                        >
                          <MenuItem value='Australia'>Australia</MenuItem>
                          <MenuItem value='Austria'>Austria</MenuItem>
                          <MenuItem value='Brazil'>Brazil</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Grid>
      <Grid size={{ xs: 12 }} sx={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button variant='contained'>Save Settings</Button>
      </Grid>
    </Grid>
  )
}

export default GeneralTab
