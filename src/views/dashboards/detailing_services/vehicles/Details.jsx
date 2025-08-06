'use client'

import { useState, useEffect } from 'react'

import axios from 'axios'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme, styled } from '@mui/material/styles'

import MuiTimeline from '@mui/lab/Timeline'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'

import { RiAddLine, RiDeleteBinLine } from 'react-icons/ri'

// Styled Timeline component
const Timeline = styled(MuiTimeline)({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': { display: 'none' }
  }
})

// Styled Accordion components
export const Accordion = styled(MuiAccordion)({
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

export const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  marginBottom: -1,
  padding: theme.spacing(3, 5),
  transition: 'min-height 0.15s ease-in-out',
  borderBottom: '1px solid var(--mui-palette-divider) !important',
  '& .MuiAccordionSummary-content.Mui-expanded': { margin: '12px 0' }
}))

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: `${theme.spacing(4)} ${theme.spacing(3)} !important`,
  backgroundColor: 'var(--mui-palette-background-paper)'
}))

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      inlineSize: 250,
      maxBlockSize: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

const Details = ({ data }) => {
  const theme = useTheme()
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [allMakes, setAllMakes] = useState([])
  const [selectedMake, setSelectedMake] = useState('')
  const [loadingMakes, setLoadingMakes] = useState(false)
  const [errorMakes, setErrorMakes] = useState(null)

  const [makeModels, setMakeModels] = useState([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [errorModels, setErrorModels] = useState(null)

  const [makeCategories, setMakeCategories] = useState([])
  const [traits, setTraits] = useState([])
  const [expanded, setExpanded] = useState({ vehicleDetails: true })

  const [displayedVehicles, setDisplayedVehicles] = useState([])

  useEffect(() => {
    const fetchMakes = async () => {
      setLoadingMakes(true)
      setErrorMakes(null)

      try {
        const res = await axios.get('/api/makes')

        setAllMakes(res.data)
      } catch {
        setErrorMakes('Failed to load makes. Please try again.')
      } finally {
        setLoadingMakes(false)
      }
    }

    fetchMakes()
  }, [])

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) {
        setMakeModels([])
        setMakeCategories([])
        setDisplayedVehicles([])
        setErrorModels(null)

        return
      }

      setLoadingModels(true)
      setErrorModels(null)

      try {
        const res = await axios.get(`/api/models/${selectedMake}`)
        const modelsData = res.data

        setMakeModels(modelsData)

        const transformedVehicles = modelsData.map(model => ({
          id: model.id, // Assuming model.id exists
          modelName: model.name, // Assuming model.name exists
          categoryName: model.variety, // Assuming model.variety is the category
          isCustom: false,
          isFetched: true
        }))
        
        setDisplayedVehicles(transformedVehicles)

        const uniqueCategories = [...new Set(modelsData.map(model => model.variety).filter(variety => variety))]
        
        setMakeCategories(uniqueCategories)
      } catch {
        setErrorModels('Failed to load models. Please try again.')
        setMakeModels([])
        setMakeCategories([])
        setDisplayedVehicles([])
      } finally {
        setLoadingModels(false)
      }
    }

    fetchModels()
  }, [selectedMake])

  const handleMakeChange = e => {
    const make = e.target.value

    setSelectedMake(make)
    setMakeModels([])
    setDisplayedVehicles([])
    setMakeCategories([])
    setErrorModels(null)
    setExpanded({ vehicleDetails: !!make })
  }

  const handleAccordionChange = panel => (_, isExp) => {
    setExpanded({ ...expanded, [panel]: isExp })
  }

  const selectedMakeName = allMakes.find(m => m.id === selectedMake)?.name || ''

  return (
    <div>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id='makes-select-label'>Select Make</InputLabel>
        <Select
          labelId='makes-select-label'
          id='makes-select'
          value={selectedMake}
          label='Select Make'
          onChange={handleMakeChange}
          disabled={loadingMakes || (!allMakes.length && !errorMakes)}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          {loadingMakes && (
            <MenuItem disabled>
              <em>Loading makes...</em>
            </MenuItem>
          )}
          {errorMakes && (
            <MenuItem disabled>
              <em>{errorMakes}</em>
            </MenuItem>
          )}
          {!loadingMakes && !errorMakes && !allMakes.length && (
            <MenuItem disabled>
              <em>No makes found. Add makes in settings.</em>
            </MenuItem>
          )}
          {allMakes.map(make => (
            <MenuItem key={make.id} value={make.id}>
              {make.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedMake && (
        <Accordion expanded={expanded.vehicleDetails} onChange={handleAccordionChange('vehicleDetails')}>
          <AccordionSummary id='vehicle-details-panel-header' aria-controls='vehicle-details-content'>
            <div className='flex items-center'>
              <i className='ri-car-fill text-primary me-2' />
              <Typography variant='h5' fontWeight='bold'>
                {selectedMakeName}
              </Typography>
            </div>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={6} className='m-2'>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography fontWeight='bold' gutterBottom>
                  Delivery:
                </Typography>
                <div className='flex items-center mb-1'>
                  <Switch />
                  <Typography variant='body2'>Enabled</Typography>
                </div>
                <div className='flex items-center mb-1'>
                  <Switch />
                  <Typography variant='body2'>Available for self booking</Typography>
                </div>
                <div className='flex items-center'>
                  <Switch />
                  <Typography variant='body2'>Allow reports to CarFAX</Typography>
                </div>

                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel>Traits</InputLabel>
                  <Select
                    label='Traits'
                    multiple
                    MenuProps={MenuProps}
                    value={traits}
                    onChange={e =>
                      setTraits(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)
                    }
                    renderValue={sel => (
                      <div className='flex flex-wrap gap-1'>
                        {sel.map(v => (
                          <Chip key={v} label={v} size='small' />
                        ))}
                      </div>
                    )}
                  >
                    {[
                      'Year',
                      'Make',
                      'Model',
                      'Color',
                      'Length',
                      'Boat Registration Number',
                      'Vin Number',
                      'Located At Campground',
                      'Located At Marina',
                      'Oxidation',
                      'Mildew',
                      'Aircraft Sqft',
                      'Truck Number'
                    ].map(trait => (
                      <MenuItem key={trait} value={trait}>
                        {trait}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                {displayedVehicles.map((vehicle, index) => (
                  <Grid container spacing={6} key={vehicle.id} className='mb-4 items-center'>
                    <Grid item xs={12} sm={true}> {/* Model: Fills remaining space */}
                      {vehicle.isFetched ? (
                        <TextField
                          label='Model'
                          value={vehicle.modelName}
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      ) : (
                        <TextField
                          label='Model'
                          value={vehicle.modelName}
                          fullWidth
                          onChange={e => {
                            
                            const newName = e.target.value
                            
                            setDisplayedVehicles(currentVehicles =>
                              currentVehicles.map((v, i) => (i === index ? { ...v, modelName: newName } : v))
                            )
                          }}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12} sm="auto"> {/* Category: Auto width based on content */}
                      {vehicle.isFetched ? (
                        <FormControl> {/* Removed fullWidth */}
                          <InputLabel>Category</InputLabel>
                          <Select
                            label='Category'
                            value={vehicle.categoryName}
                            sx={{ width: '150px' }} // Added fixed width
                            
                            onChange={e => {
                              const newCategoryName = e.target.value
                              
                              setDisplayedVehicles(currentVehicles =>
                                currentVehicles.map((v, i) => (i === index ? { ...v, categoryName: newCategoryName } : v))
                              )
                            }}
                          >
                            {makeCategories.map(category => (
                              <MenuItem key={category} value={category}>
                                {category}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <FormControl> {/* Removed fullWidth */}
                          <InputLabel>Category</InputLabel>
                          <Select
                            label='Category'
                            value={vehicle.categoryName}
                            
                            sx={{ width: '150px' }} // Added fixed width
                            onChange={e => {
                              const newCategory = e.target.value
                              
                              setDisplayedVehicles(currentVehicles =>
                                currentVehicles.map((v, i) => (i === index ? { ...v, categoryName: newCategory } : v))
                              )
                            }}
                          >
                            <MenuItem value=''>
                              <em>Select a category</em>
                            </MenuItem>
                            {makeCategories.map(category => (
                              <MenuItem key={category} value={category}>
                                {category}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                    {vehicle.isCustom && (
                      <Grid item xs={12} sm={1}> {/* Remove button: Fixed width */}
                        <IconButton
                          onClick={() => {
                            setDisplayedVehicles(currentVehicles =>
                              currentVehicles.filter((_, i) => i !== index)
                            )
                          }}
                          aria-label='Remove vehicle'
                        >
                          <RiDeleteBinLine />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                ))}

                <Button
                  onClick={() => {
                    // Add logic for adding a new custom vehicle
                    // For now, it pushes a blank custom vehicle.
                    // A more robust solution would use a unique temporary ID.
                    setDisplayedVehicles(currentVehicles => [
                      ...currentVehicles,
                      {
                        id: `custom-${Date.now()}`, // Temporary ID
                        modelName: '',
                        categoryName: '',
                        isCustom: true,
                        isFetched: false
                      }
                    ])
                  }}
                  startIcon={<RiAddLine />}
                  variant='outlined'
                  sx={{ mb: 2, borderStyle: 'dashed', width: '100%' }}
                >
                  Add Custom Vehicle
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  )
}

export default Details
