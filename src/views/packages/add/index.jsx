'use client'

import React, { useState, useEffect, forwardRef } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'

import {
  Drawer, Typography, IconButton, Divider, TextField, Button, RadioGroup, FormControlLabel, Radio,
  Select, MenuItem, FormControl, InputLabel, Checkbox, FormGroup, Box
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

import { getLocalizedUrl } from '@/utils/i18n'
import { toast } from '@/utils/toast'



const FloatingGroupBox = ({ label, children }) => {
  return (
    <Box position="relative" className="border" borderRadius={1} px={3} pt={3} pb={3} mt={3}>
      <Typography
        component="label"
        variant="subtitle"
        sx={{
          position: 'absolute',
          top: -11,
          left: 16,
          px: 1,
          backgroundColor: 'var(--mui-palette-background-paper)',
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  )
}

const CreatePackageDrawer = ({ open, onClose, onSubmit }) => {
  const { lang: locale } = useParams()

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      packageType: 'paid',
      name: '',
      maxEmployees: '',
      positionNo: '',
      private: false,
      recommended: false,
      monthly_currency: 'USD',
      yearly_currency: 'USD',
      hasMonthly: false,
      monthlyPrice: '',
      hasAnnual: false,
      annualPrice: '',
      features: [],
      modules: []
    }
  })

  const watchHasMonthly = watch('hasMonthly')
  const watchHasAnnual = watch('hasAnnual')
  const watchPackageType = watch('packageType')

  const [featureOptions, setFeatureOptions] = useState([])
  const [moduleOptions, setModuleOptions] = useState([])

  // Fetch modules from API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules')
        if (response.ok) {
          const modules = await response.json()
          setModuleOptions(modules)
        }
      } catch (error) {
        console.error('Error fetching modules:', error)
      }
    }
    fetchModules()
  }, [])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [featuresRes, modulesRes] = await Promise.all([
          fetch('/api/features'),
          fetch('/api/modules')
        ])

        if (featuresRes.ok && modulesRes.ok) {
          const [featuresData, modulesData] = await Promise.all([
            featuresRes.json(),
            modulesRes.json()
          ])

          setFeatureOptions(featuresData.filter(f => f.isActive).map(f => f.name))
          //setModuleOptions(modulesData.filter(m => m.isActive).map(m => m.name))
        } else {
          console.error('Failed to fetch features or modules')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleReset = () => {
    reset()
    onClose()
  }

  const validateForm = (data) => {
    const errors = []

    // Required field validations
    if (!data.name?.trim()) {
      errors.push('Package name is required')
    }



    if (!data.maxEmployees || data.maxEmployees <= 0) {
      errors.push('Max employees must be greater than 0')
    }

    if (!data.positionNo || data.positionNo <= 0) {
      errors.push('Position number must be greater than 0')
    }

    // Pricing validation for paid packages
    if (data.packageType === 'paid') {
      if (!data.hasMonthly && !data.hasAnnual) {
        errors.push('At least one pricing plan (Monthly or Annual) must be selected for paid packages')
      }

      if (data.hasMonthly) {
        if (!data.monthlyPrice || parseFloat(data.monthlyPrice) <= 0) {
          errors.push('Monthly price must be greater than 0')
        }
        if (!data.monthly_currency) {
          errors.push('Monthly currency is required')
        }
      }

      if (data.hasAnnual) {
        if (!data.annualPrice || parseFloat(data.annualPrice) <= 0) {
          errors.push('Annual price must be greater than 0')
        }
        if (!data.yearly_currency) {
          errors.push('Annual currency is required')
        }
      }
    }

    // Features validation
    if (!data.features || data.features.length === 0) {
      errors.push('At least one feature must be selected')
    }

    // Modules validation
    if (!data.modules || data.modules.length === 0) {
      errors.push('At least one module must be selected')
    }

    return errors
  }

  const handleFormSubmit = async (data) => {
    const validationErrors = validateForm(data)

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        toast.error(error)
      })
      return
    }

    try {
      await onSubmit(data)
      toast.success('Package created successfully!')
      handleReset()
    } catch (error) {
      toast.error('Failed to create package. Please try again.')
    }
  }

  const currentFeatures = watch('features') || []
  const currentModules = watch('modules') || []

  const allSelected = featureOptions.length > 0 && featureOptions.every(feature => currentFeatures.includes(feature));
  const allModulesSelected = moduleOptions.length > 0 && moduleOptions.every(module => currentModules.includes(module.name));

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setValue('features', [...featureOptions]);
    } else {
      setValue('features', []);
    }
  };

  const handleSelectAllModulesChange = (e) => {
    if (e.target.checked) {
      setValue('modules', moduleOptions.map(module => module.name));
    } else {
      setValue('modules', []);
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Button
          variant='contained'
          component={Link}
          startIcon={<i className='ri-arrow-left-line' />}
          href={getLocalizedUrl('packages', locale)}
          className='max-sm:is-full'
        >
          Back to Packages
        </Button>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader
            title='Create Package'
          />
          <Divider/>
          <CardContent>
            <Box className='p-5' component='form' onSubmit={handleSubmit(handleFormSubmit)}>
              <Grid container spacing={4}>
                {/* Removing the modules dropdown field
                <Grid size={{ xs: 12}}>
                  <FormControl fullWidth>
                    <InputLabel>Select Module</InputLabel>
                    <Select
                      value={formData.modules}
                      onChange={e => handleChange('modules', e.target.value)}
                      label='Select Module'
                    >
                      {moduleOptions.map((module) => (
                        <MenuItem key={module.id} value={module.id}>
                          {module.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                */}
                <Grid size={{ xs: 12}}>
                  <FormControl component='fieldset'>
                    <Typography variant='subtitle1' className='mb-2'>Package Type</Typography>
                    <Controller
                      name="packageType"
                      control={control}
                      rules={{ required: 'Package type is required' }}
                      render={({ field }) => (
                        <RadioGroup row {...field}>
                          <FormControlLabel value='paid' control={<Radio />} label='Paid Plan' />
                          <FormControlLabel value='free' control={<Radio />} label='Free Plan' />
                        </RadioGroup>
                      )}
                    />
                    {errors.packageType && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.packageType.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12}}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12}}>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ 
                          required: 'Package name is required',
                          minLength: {
                            value: 2,
                            message: 'Package name must be at least 2 characters'
                          }
                        }}
                        render={({ field }) => (
                          <TextField 
                            {...field}
                            fullWidth 
                            label='Package Name' 
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12}}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 3}}>
                      <Controller
                        name="maxEmployees"
                        control={control}
                        rules={{ 
                          required: 'Max employees is required',
                          min: {
                            value: 1,
                            message: 'Max employees must be at least 1'
                          }
                        }}
                        render={({ field }) => (
                          <TextField 
                            {...field}
                            fullWidth 
                            type='number' 
                            label='Max Employees'
                            error={!!errors.maxEmployees}
                            helperText={errors.maxEmployees?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 3}}>
                      <Controller
                        name="positionNo"
                        control={control}
                        rules={{ 
                          required: 'Position number is required',
                          min: {
                            value: 1,
                            message: 'Position number must be at least 1'
                          }
                        }}
                        render={({ field }) => (
                          <TextField 
                            {...field}
                            fullWidth 
                            type='number' 
                            label='Position No'
                            error={!!errors.positionNo}
                            helperText={errors.positionNo?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12}}>
                  <FormGroup row>
                    <Controller
                      name="private"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel 
                          control={<Checkbox {...field} checked={field.value} />} 
                          label='Make Private' 
                        />
                      )}
                    />
                    <Controller
                      name="recommended"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel 
                          control={<Checkbox {...field} checked={field.value} />} 
                          label='Mark as Recommended' 
                        />
                      )}
                    />
                  </FormGroup>
                </Grid>
              </Grid>

              <Divider className='my-5' />

              <Box className='flex flex-col gap-4'>


                <Grid container spacing={4}>
                    <Grid size={{ xs: 6}}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12}} sx={{display: 'flex', alignItems: 'center'}}>
                              <Controller
                                name="hasMonthly"
                                control={control}
                                render={({ field }) => (
                                  <FormControlLabel 
                                    control={<Checkbox {...field} checked={field.value} />} 
                                    label='Monthly Plan' 
                                  />
                                )}
                              />
                            </Grid>
                            {watchHasMonthly && (
                              <>
                                <Grid size={{ xs: 6}}>
                                  <Controller
                                    name="monthly_currency"
                                    control={control}
                                    rules={watchHasMonthly ? { required: 'Monthly currency is required' } : {}}
                                    render={({ field }) => (
                                      <FormControl fullWidth error={!!errors.monthly_currency}>
                                        <InputLabel>Package Currency</InputLabel>
                                        <Select {...field} label='Package Currency'>
                                          <MenuItem value='USD'>USD</MenuItem>
                                          <MenuItem value='EUR'>EUR</MenuItem>
                                          <MenuItem value='INR'>INR</MenuItem>
                                        </Select>
                                        {errors.monthly_currency && (
                                          <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                                            {errors.monthly_currency.message}
                                          </Typography>
                                        )}
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                                <Grid size={{ xs: 6}}>
                                  <Controller
                                    name="monthlyPrice"
                                    control={control}
                                    rules={watchHasMonthly ? { 
                                      required: 'Monthly price is required',
                                      min: {
                                        value: 0.01,
                                        message: 'Monthly price must be greater than 0'
                                      }
                                    } : {}}
                                    render={({ field }) => (
                                      <TextField 
                                        {...field}
                                        fullWidth 
                                        label='Monthly Plan Price' 
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        error={!!errors.monthlyPrice}
                                        helperText={errors.monthlyPrice?.message}
                                      />
                                    )}
                                  />
                                </Grid>
                              </>
                            )}
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 6}}>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12}} sx={{display: 'flex', alignItems: 'center'}}>
                              <Controller
                                name="hasAnnual"
                                control={control}
                                render={({ field }) => (
                                  <FormControlLabel 
                                    control={<Checkbox {...field} checked={field.value} />} 
                                    label='Annual Plan' 
                                  />
                                )}
                              />
                            </Grid>
                            {watchHasAnnual && (
                              <>
                                <Grid size={{ xs: 6}}>
                                  <Controller
                                    name="yearly_currency"
                                    control={control}
                                    rules={watchHasAnnual ? { required: 'Annual currency is required' } : {}}
                                    render={({ field }) => (
                                      <FormControl fullWidth error={!!errors.yearly_currency}>
                                        <InputLabel>Package Currency</InputLabel>
                                        <Select {...field} label='Package Currency'>
                                          <MenuItem value='USD'>USD</MenuItem>
                                          <MenuItem value='EUR'>EUR</MenuItem>
                                          <MenuItem value='INR'>INR</MenuItem>
                                        </Select>
                                        {errors.yearly_currency && (
                                          <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                                            {errors.yearly_currency.message}
                                          </Typography>
                                        )}
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                                <Grid size={{ xs: 6}}>
                                  <Controller
                                    name="annualPrice"
                                    control={control}
                                    rules={watchHasAnnual ? { 
                                      required: 'Annual price is required',
                                      min: {
                                        value: 0.01,
                                        message: 'Annual price must be greater than 0'
                                      }
                                    } : {}}
                                    render={({ field }) => (
                                      <TextField 
                                        {...field}
                                        fullWidth 
                                        label='Annual Plan Price'
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        error={!!errors.annualPrice}
                                        helperText={errors.annualPrice?.message}
                                      />
                                    )}
                                  />
                                </Grid>
                              </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
              </Box>

              <Divider className='my-5' />

              <FloatingGroupBox label="Features">
                {loading ? (
                  <Typography>Loading features...</Typography>
                ) : (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12}}>
                        <FormControlLabel
                          control={
                              <Checkbox
                                checked={allSelected}
                                indeterminate={
                                  currentFeatures.length > 0 && currentFeatures.length < featureOptions.length
                                }
                                onChange={handleSelectAllChange}
                              />
                          }
                          label="Select All"
                        />
                    </Grid>
                    {featureOptions.map((feature, index) => (
                    <Grid size={{ xs: 2}} key={index}>
                      <Controller
                        name="features"
                        control={control}
                        rules={{ 
                          validate: value => value.length > 0 || 'At least one feature must be selected'
                        }}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value.includes(feature)}
                                onChange={e => {
                                  const updated = e.target.checked
                                    ? [...field.value, feature]
                                    : field.value.filter(f => f !== feature)
                                  field.onChange(updated)
                                }}
                              />
                            }
                            label={feature}
                          />
                        )}
                      />
                    </Grid>
                    ))}
                    {errors.features && (
                      <Grid size={{ xs: 12}}>
                        <Typography variant="caption" color="error">
                          {errors.features.message}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                )}
              </FloatingGroupBox>

              <FloatingGroupBox label="Modules">
                {loading ? (
                  <Typography>Loading modules...</Typography>
                ) : (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12}}>
                        <FormControlLabel
                          control={
                              <Checkbox
                                checked={allModulesSelected}
                                indeterminate={
                                  currentModules.length > 0 && currentModules.length < moduleOptions.length
                                }
                                onChange={handleSelectAllModulesChange}
                              />
                          }
                          label="Select All"
                        />
                    </Grid>
                    {moduleOptions.map((module, index) => (
                      <Grid size={{ xs: 2}} key={index}>
                        <Controller
                          name="modules"
                          control={control}
                          rules={{ 
                            validate: value => value.length > 0 || 'At least one module must be selected'
                          }}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value.includes(module.name)}
                                  onChange={e => {
                                    const updated = e.target.checked
                                      ? [...field.value, module.name]
                                      : field.value.filter(m => m !== module.name)
                                    field.onChange(updated)
                                  }}
                                />
                              }
                              label={module.name}
                            />
                          )}
                        />
                      </Grid>
                    ))}
                    {errors.modules && (
                      <Grid size={{ xs: 12}}>
                        <Typography variant="caption" color="error">
                          {errors.modules.message}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                )}
              </FloatingGroupBox>

              <Divider className='my-5' />



              <Box className='flex items-center gap-4 mt-6'>
                <Button variant='contained' type='submit'>Save</Button>
                <Button variant='outlined' color='secondary' onClick={handleReset}>Cancel</Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CreatePackageDrawer