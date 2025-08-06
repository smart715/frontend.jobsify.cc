'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// Component Imports
import AddDesignationDrawer from './AddDesignationDrawer'
import EditDesignationDrawer from './EditDesignationDrawer'
import DeleteDesignationDialog from './DeleteDesignationDialog'
import DesignationListTable from './DesignationListTable'
import TablePagination from '@mui/material/TablePagination'

const DesignationList = ({ dictionary }) => {
  // States
  const [addDesignationOpen, setAddDesignationOpen] = useState(false)
  const [editDesignationOpen, setEditDesignationOpen] = useState(false)
  const [deleteDesignationOpen, setDeleteDesignationOpen] = useState(false)
  const [selectedDesignation, setSelectedDesignation] = useState(null)
  const [designations, setDesignations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch designations
  const fetchDesignations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/designations')
      const data = await response.json()
      setDesignations(data.designations || [])
    } catch (error) {
      console.error('Error fetching designations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDesignations()
  }, [])

    // Filter designations based on search
    const filteredDesignations = designations.filter(designation =>
      designation.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      designation.description?.toLowerCase().includes(searchValue.toLowerCase())
    )
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage)
    }
  
    const handleChangeRowsPerPage = event => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
    }
  
    const paginatedData = filteredDesignations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    // Handle edit designation
    const handleEditDesignation = (designation) => {
      setSelectedDesignation(designation)
      setEditDesignationOpen(true)
    }

    // Handle delete designation
    const handleDeleteDesignation = (designation) => {
      setSelectedDesignation(designation)
      setDeleteDesignationOpen(true)
    }

    // Handle close edit drawer
    const handleCloseEditDrawer = () => {
      setEditDesignationOpen(false)
      setSelectedDesignation(null)
    }

    // Handle close delete dialog
    const handleCloseDeleteDialog = () => {
      setDeleteDesignationOpen(false)
      setSelectedDesignation(null)
    }


  return (
    <Grid container spacing={6}>
      <Grid xs={12}>
        <Card>
          <CardHeader
            title={dictionary?.navigation?.designation || 'Designations'}
            action={
              <div className='flex items-center gap-4'>
                <TextField
                  size='small'
                  placeholder='Search Designation'
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  className='is-[250px]'
                  InputProps={{
                    startAdornment: <i className='ri-search-line' />
                  }}
                />
                <Button
                  variant='contained'
                  startIcon={<i className='ri-add-line' />}
                  onClick={() => setAddDesignationOpen(true)}
                  className='is-full sm:is-auto'
                >
                  Add Designation
                </Button>
              </div>
            }
          />
          <DesignationListTable 
            designations={paginatedData}
            loading={loading}
            onRefresh={fetchDesignations}
            onEdit={handleEditDesignation}
            onDelete={handleDeleteDesignation}
          />
           <TablePagination
            component='div'
            count={filteredDesignations.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>
      </Grid>
      <AddDesignationDrawer
        open={addDesignationOpen}
        handleClose={() => setAddDesignationOpen(false)}
        onSuccess={fetchDesignations}
      />
      
      <EditDesignationDrawer
        open={editDesignationOpen}
        handleClose={handleCloseEditDrawer}
        designation={selectedDesignation}
        onSuccess={fetchDesignations}
      />
      
      <DeleteDesignationDialog
        open={deleteDesignationOpen}
        handleClose={handleCloseDeleteDialog}
        designation={selectedDesignation}
        onSuccess={fetchDesignations}
      />
    </Grid>
  )
}

export default DesignationList