
'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import ModuleListTable from '@/views/modules/list/ModuleListTable'

const ModulesList = () => {
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

  if (loading) {
    return <div>Loading modules...</div>
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <ModuleListTable tableData={modules} />
      </Grid>
    </Grid>
  )
}

export default ModulesList
