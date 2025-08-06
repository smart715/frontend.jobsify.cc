
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import SuperAdminListTable from './SuperAdminListTable'
import AddSuperAdminDrawer from './AddSuperAdminDrawer'
import EditSuperAdminDrawer from './EditSuperAdminDrawer'
import ViewSuperAdminDrawer from './ViewSuperAdminDrawer'

const SuperAdminList = ({ mode, locale, dictionary }) => {
  // States
  const [addSuperAdminOpen, setAddSuperAdminOpen] = useState(false)
  const [editSuperAdminOpen, setEditSuperAdminOpen] = useState(false)
  const [viewSuperAdminOpen, setViewSuperAdminOpen] = useState(false)
  const [selectedSuperAdmin, setSelectedSuperAdmin] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAddSuperAdmin = () => {
    setAddSuperAdminOpen(true)
  }

  const handleEditSuperAdmin = (superAdmin) => {
    setSelectedSuperAdmin(superAdmin)
    setEditSuperAdminOpen(true)
  }

  const handleViewSuperAdmin = (superAdmin) => {
    setSelectedSuperAdmin(superAdmin)
    setViewSuperAdminOpen(true)
  }

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleCloseEdit = () => {
    setEditSuperAdminOpen(false)
    setSelectedSuperAdmin(null)
  }

  const handleCloseView = () => {
    setViewSuperAdminOpen(false)
    setSelectedSuperAdmin(null)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SuperAdminListTable 
          refreshTrigger={refreshTrigger}
          onRefresh={handleRefresh}
          onEdit={handleEditSuperAdmin}
          onView={handleViewSuperAdmin}
          onAdd={handleAddSuperAdmin}
        />
      </Grid>
      <AddSuperAdminDrawer
        open={addSuperAdminOpen}
        setOpen={setAddSuperAdminOpen}
        onSuccess={handleRefresh}
      />
      <EditSuperAdminDrawer
        open={editSuperAdminOpen}
        handleClose={handleCloseEdit}
        userData={selectedSuperAdmin}
        onSuccess={handleRefresh}
      />
      <ViewSuperAdminDrawer
        open={viewSuperAdminOpen}
        handleClose={handleCloseView}
        userData={selectedSuperAdmin}
      />
    </Grid>
  )
}

export default SuperAdminList
