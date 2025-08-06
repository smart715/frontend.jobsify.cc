
'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton
} from '@mui/material'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const FeatureAssignmentManager = () => {
  const [modules, setModules] = useState([])
  const [features, setFeatures] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Mock user ID - in real app, get from auth context
  const userId = 'current-user-id'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [modulesRes, featuresRes, assignmentsRes] = await Promise.all([
        fetch('/api/modules'),
        fetch('/api/features'),
        fetch(`/api/module-feature-assignments?userId=${userId}`)
      ])

      if (modulesRes.ok && featuresRes.ok && assignmentsRes.ok) {
        const [modulesData, featuresData, assignmentsData] = await Promise.all([
          modulesRes.json(),
          featuresRes.json(),
          assignmentsRes.json()
        ])

        setModules(modulesData)
        setFeatures(featuresData)
        setAssignments(assignmentsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data')
    }
  }

  const handleAssignmentToggle = async (moduleId, featureId, enabled) => {
    try {
      const existingAssignment = assignments.find(
        a => a.moduleId === moduleId && a.featureId === featureId
      )

      if (existingAssignment) {
        // Update existing assignment
        const response = await fetch(`/api/module-feature-assignments/${existingAssignment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled })
        })

        if (response.ok) {
          setAssignments(prev => prev.map(a => 
            a.id === existingAssignment.id ? { ...a, enabled } : a
          ))
        }
      } else {
        // Create new assignment
        const response = await fetch('/api/module-feature-assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleId,
            featureId,
            userId,
            enabled
          })
        })

        if (response.ok) {
          const newAssignment = await response.json()
          setAssignments(prev => [...prev, newAssignment])
        }
      }
    } catch (error) {
      console.error('Error updating assignment:', error)
      setError('Failed to update assignment')
    }
  }

  const handleSortOrderChange = async (assignmentId, sortOrder) => {
    try {
      const response = await fetch(`/api/module-feature-assignments/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: parseInt(sortOrder) || null })
      })

      if (response.ok) {
        setAssignments(prev => prev.map(a => 
          a.id === assignmentId ? { ...a, sortOrder: parseInt(sortOrder) || null } : a
        ))
      }
    } catch (error) {
      console.error('Error updating sort order:', error)
      setError('Failed to update sort order')
    }
  }

  const getAssignmentStatus = (moduleId, featureId) => {
    const assignment = assignments.find(
      a => a.moduleId === moduleId && a.featureId === featureId
    )
    return assignment ? assignment.enabled : false
  }

  const getAssignmentSortOrder = (moduleId, featureId) => {
    const assignment = assignments.find(
      a => a.moduleId === moduleId && a.featureId === featureId
    )
    return assignment ? assignment.sortOrder : ''
  }

  const getAssignmentId = (moduleId, featureId) => {
    const assignment = assignments.find(
      a => a.moduleId === moduleId && a.featureId === featureId
    )
    return assignment ? assignment.id : null
  }

  return (
    <Card>
      <CardHeader title='Feature Assignment Management' />
      <CardContent>
        {error && (
          <Alert severity='error' className='mb-4' onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity='success' className='mb-4' onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Typography variant='body1' className='mb-4'>
          Configure which features are enabled for each module in your business account.
        </Typography>

        <div className='space-y-4'>
          {modules.map(module => (
            <Accordion key={module.id}>
              <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
                <div className='flex items-center gap-2'>
                  <Typography variant='h6'>{module.name}</Typography>
                  <Chip 
                    label={`${assignments.filter(a => a.moduleId === module.id && a.enabled).length} enabled`}
                    size='small'
                    color='primary'
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant='body2' className='mb-4 text-gray-600'>
                  {module.description || 'No description available'}
                </Typography>
                
                <Grid container spacing={2}>
                  {features.map(feature => (
                    <Grid item xs={12} sm={6} md={4} key={feature.id}>
                      <Card variant='outlined' className='p-4'>
                        <div className='flex items-start justify-between mb-2'>
                          <Typography variant='subtitle1' className='font-medium'>
                            {feature.name}
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={getAssignmentStatus(module.id, feature.id)}
                                onChange={(e) => handleAssignmentToggle(
                                  module.id, 
                                  feature.id, 
                                  e.target.checked
                                )}
                                size='small'
                              />
                            }
                            label=''
                          />
                        </div>
                        
                        {feature.description && (
                          <Typography variant='body2' className='text-gray-600 mb-2'>
                            {feature.description}
                          </Typography>
                        )}
                        
                        {getAssignmentStatus(module.id, feature.id) && (
                          <TextField
                            label='Sort Order'
                            type='number'
                            size='small'
                            fullWidth
                            value={getAssignmentSortOrder(module.id, feature.id)}
                            onChange={(e) => {
                              const assignmentId = getAssignmentId(module.id, feature.id)
                              if (assignmentId) {
                                handleSortOrderChange(assignmentId, e.target.value)
                              }
                            }}
                            placeholder='Display order'
                          />
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
        
        {modules.length === 0 && (
          <Typography variant='body1' className='text-center text-gray-500 mt-8'>
            No modules available. Contact your administrator to set up modules.
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default FeatureAssignmentManager
