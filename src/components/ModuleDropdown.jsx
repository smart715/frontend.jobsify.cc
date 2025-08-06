'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'

const ModuleDropdown = ({ 
  value = '', 
  onChange, 
  error = false, 
  helperText = '', 
  disabled = false,
  required = false,
  label = 'Select Module'
}) => {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('/api/modules')
        if (response.ok) {
          const data = await response.json()
          setModules(data)
        } else {
          console.error('Failed to fetch modules')
        }
      } catch (error) {
        console.error('Error fetching modules:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  const handleChange = (event) => {
    if (onChange) {
      onChange(event)
    }
  }

  return (
    <FormControl fullWidth error={error} disabled={disabled || loading}>
      <InputLabel id="module-dropdown-label">
        {label} {required && '*'}
      </InputLabel>
      <Select
        labelId="module-dropdown-label"
        value={value}
        onChange={handleChange}
        label={`${label} ${required ? '*' : ''}`}
        displayEmpty
      >
        <MenuItem value="">
          <em>Select Module</em>
        </MenuItem>
        {modules.map((module) => (
          <MenuItem key={module.id} value={module.id}>
            {module.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  )
}

export default ModuleDropdown