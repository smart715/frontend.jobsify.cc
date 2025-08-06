'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import TablePagination from '@mui/material/TablePagination'

// Component Imports
import AppreciationListTable from './AppreciationListTable'
import AddAppreciationDrawer from './AddAppreciationDrawer'
import EditAppreciationDrawer from './EditAppreciationDrawer'
import DeleteAppreciationDialog from './DeleteAppreciationDialog'
import TableFilters from './TableFilters'

const AppreciationList = ({ dictionary }) => {
  // States
  const [addAppreciationOpen, setAddAppreciationOpen] = useState(false)
  const [editAppreciationOpen, setEditAppreciationOpen] = useState(false)
  const [deleteAppreciationOpen, setDeleteAppreciationOpen] = useState(false)
  const [selectedAppreciation, setSelectedAppreciation] = useState(null)
  const [appreciations, setAppreciations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetch appreciations
  const fetchAppreciations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/appreciations')
      if (response.ok) {
        const data = await response.json()
        // API returns appreciations directly as an array
        setAppreciations(Array.isArray(data) ? data : [])
      } else {
        console.error('Failed to fetch appreciations:', response.status)
        setAppreciations([])
      }
    } catch (error) {
      console.error('Error fetching appreciations:', error)
      setAppreciations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppreciations()
  }, [])

  // Filter appreciations based on search
  const filteredAppreciations = appreciations.filter(appreciation =>
    appreciation.givenTo?.toLowerCase().includes(searchValue.toLowerCase()) ||
    appreciation.award?.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const paginatedData = filteredAppreciations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  // Handle edit appreciation
  const handleEditAppreciation = (appreciation) => {
    setSelectedAppreciation(appreciation)
    setEditAppreciationOpen(true)
  }

  // Handle delete appreciation
  const handleDeleteAppreciation = (appreciation) => {
    setSelectedAppreciation(appreciation)
    setDeleteAppreciationOpen(true)
  }

  // Handle close edit drawer
  const handleCloseEditDrawer = () => {
    setEditAppreciationOpen(false)
    setSelectedAppreciation(null)
  }

  // Handle close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteAppreciationOpen(false)
    setSelectedAppreciation(null)
  }

  return (
    <Grid container spacing={6}>
      <Grid xs={12}>
        <Card>
          <CardHeader
            title={dictionary?.navigation?.appreciation || 'Appreciations'}
            action={
              <div className='flex items-center gap-4'>
                <TextField
                  size='small'
                  placeholder='Search Appreciation'
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
                  onClick={() => setAddAppreciationOpen(true)}
                  className='is-full sm:is-auto'
                >
                  Add Appreciation
                </Button>
              </div>
            }
          />
          <AppreciationListTable 
            appreciationData={paginatedData}
            loading={loading}
            onRefresh={fetchAppreciations}
            onEditClick={handleEditAppreciation}
            onDeleteClick={handleDeleteAppreciation}
          />
          <TablePagination
            component='div'
            count={filteredAppreciations.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>
      </Grid>
      <AddAppreciationDrawer
        open={addAppreciationOpen}
        handleClose={() => setAddAppreciationOpen(false)}
        onSuccess={fetchAppreciations}
      />

      <EditAppreciationDrawer
        open={editAppreciationOpen}
        handleClose={handleCloseEditDrawer}
        appreciationData={selectedAppreciation}
        onSuccess={fetchAppreciations}
      />

      <DeleteAppreciationDialog
        open={deleteAppreciationOpen}
        handleClose={handleCloseDeleteDialog}
        appreciation={selectedAppreciation}
        onSuccess={fetchAppreciations}
      />
    </Grid>
  )
}

export default AppreciationList