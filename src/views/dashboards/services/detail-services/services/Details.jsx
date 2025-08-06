'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme, styled } from '@mui/material/styles'

import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Switch,
  Chip,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Divider,
  FormControlLabel
} from '@mui/material';

import { RiAddLine, RiArrowDownSLine } from 'react-icons/ri';

import DirectionalIcon from '@components/DirectionalIcon'

// Constants
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const CATEGORY_OPTIONS = [
  'Coupe', 'Sedan', 'Crossover', 'SUV', 'Pickup',
  'CrewCab', 'MiniVan', 'Van'
]

const MenuProps = {
  PaperProps: {
    style: {
      inlineSize: 250,
      maxBlockSize: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

// Styled components
const Accordion = styled(MuiAccordion)({
  boxShadow: 'none !important',
  border: '1px solid var(--mui-palette-divider) !important',
  borderRadius: 'var(--mui-shape-borderRadius) !important',
  overflow: 'hidden',
  background: 'none',
  '&:not(:last-of-type)': { borderBottom: '0 !important' },
  '&:before': { display: 'none' },
  '&.Mui-expanded': { margin: 'auto' },
  '&:first-of-type': {
    borderTopLeftRadius: 'var(--mui-shape-borderRadius) !important',
    borderTopRightRadius: 'var(--mui-shape-borderRadius) !important'
  },
  '&:last-of-type': {
    borderBottomLeftRadius: 'var(--mui-shape-borderRadius) !important',
    borderBottomRightRadius: 'var(--mui-shape-borderRadius) !important'
  }
})

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  marginBottom: -1,
  padding: theme.spacing(3, 5),
  borderBottom: '1px solid var(--mui-palette-divider) !important',
  transition: 'min-height 0.15s ease-in-out',
  '& .MuiAccordionSummary-content.Mui-expanded': {
    margin: '12px 0'
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: `${theme.spacing(4)} ${theme.spacing(3)} !important`,
  backgroundColor: 'var(--mui-palette-background-paper)'
}))

const Details = ({ data }) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [categoryDetails, setCategoryDetails] = useState({});
  const [selectedZone, setSelectedZone] = useState('Combined')
  
  const zoneList = {
    Combined: ['Service is enabled for booking', 'Service appears on customer self booking website'],
    Interior: [],
    Exterior: []
  }

  // Accordion States
  const [expanded, setExpanded] = useState({ businessSetup: true })

  // Form Data
  const [traits, setTraits] = useState([])

  const [formData, setFormData] = useState({
    title1: 'Signature Handwash, Rinse and Dry',
    title2: 'Combined section'
  })

  const handleAccordionToggle = panel => (event, isExpanded) => {
    setExpanded({ ...expanded, [panel]: isExpanded })
  }

  const renderCategorySelect = () => (
    <FormControl fullWidth>
      <InputLabel>Categories</InputLabel>
      <Select
        label="Categories"
        multiple
        value={traits}
        MenuProps={MenuProps}
        onChange={e => {
          const selected = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value

          setTraits(selected)

          setCategoryDetails(prev => {
            const updated = { ...prev }

            selected.forEach(cat => {
              if (!updated[cat]) {
                updated[cat] = { shop: false, mobile: false, category: '', price: '', time: '' }
              }
            })

            // Remove unselected
            Object.keys(updated).forEach(cat => {
              if (!selected.includes(cat)) {
                delete updated[cat]
              }
            })

            return updated
          })
        }}
        renderValue={(selected) => (
          <div className='flex flex-wrap gap-1'>
            {selected.map(value => (
              <Chip key={value} label={value} size='small' />
            ))}
          </div>
        )}
      >
        {CATEGORY_OPTIONS.map(trait => (
          <MenuItem key={trait} value={trait}>{trait}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  return (
    <div>
      <Accordion expanded={expanded.businessSetup} onChange={handleAccordionToggle('businessSetup')}>
        <AccordionSummary id="panel-header-1" aria-controls="panel-content-1">
          <div className='flex items-center'>
            <i className='ri-checkbox-circle-fill text-primary me-2' />
            <Typography variant='h5' className='font-bold'>
              {formData.title1}
            </Typography>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={6} className='m-2'>

            {/* Left Column */}
            <Grid size={{ xs: 12, md: 4}}>
              <div className='mb-4'>
                <Typography variant='subtitle1' className='font-bold mb-2'>
                  Visibility:
                </Typography>
                {['Service is enabled for booking', 'Service appears on customer self booking website'].map(label => (
                  <div className='flex items-center' key={label}>
                    <Switch />
                    <Typography variant='body2'>{label}</Typography>
                  </div>
                ))}
              </div>

              <div className='mb-4'>{renderCategorySelect()}</div>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, md: 8}}>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12, sm: 6}}>
                  <TextField
                    fullWidth
                    label="Selectable Intervals"
                    value={formData.title1}
                    onChange={e => setFormData({ ...formData, title1: e.target.value })}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6}}>
                  <FormControl fullWidth>
                    <InputLabel>ZONES</InputLabel>
                    <Select
                      label="ZONES"
                      value={selectedZone}
                      onChange={e => setSelectedZone(e.target.value)}
                    >
                      {['Combined', 'Interior', 'Exterior'].map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {traits.map(trait => (
                  <Grid container spacing={3} key={trait} className='mb-4'>
                    <Grid size={{ xs: 6, sm: 3}}>
                      <div className='flex gap-4'>
                        {['shop', 'mobile'].map(type => (
                          <div className='flex items-center' key={type}>
                            <Switch
                              checked={categoryDetails[trait]?.[type] || false}
                              onChange={e => {
                                setCategoryDetails(prev => ({
                                  ...prev,
                                  [trait]: {
                                    ...prev[trait],
                                    [type]: e.target.checked
                                  }
                                }))
                              }}
                            />
                            <Typography variant='body2'>{type.charAt(0).toUpperCase() + type.slice(1)}</Typography>
                          </div>
                        ))}
                      </div>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 3}}>
                      <TextField
                        fullWidth
                        label="Category"
                        value={trait}
                        disabled
                      />
                    </Grid>

                    <Grid size={{ xs: 6, sm: 3}}>
                      <TextField
                        fullWidth
                        label="Price"
                        placeholder="$xxx.xx"
                        value={categoryDetails[trait]?.price || ''}
                        onChange={e =>
                          setCategoryDetails(prev => ({
                            ...prev,
                            [trait]: {
                              ...prev[trait],
                              price: e.target.value
                            }
                          }))
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 6, sm: 3}}>
                      <TextField
                        fullWidth
                        label="Time"
                        value={categoryDetails[trait]?.time || ''}
                        onChange={e =>
                          setCategoryDetails(prev => ({
                            ...prev,
                            [trait]: {
                              ...prev[trait],
                              time: e.target.value
                            }
                          }))
                        }
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Button
        variant="outlined"
        startIcon={<RiAddLine />}
        sx={{ width: '100%', mt: 2 }}
      >
        Add New Detail Services
      </Button>
    </div>
  )
}

export default Details
